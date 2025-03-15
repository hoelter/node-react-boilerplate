import { isProduction } from "@server/utils/envUtils";
import { UserId } from "@shared/types";
import { FastifyReply, FastifyRequest } from "fastify";

const oneYearInMs = 1000 * 60 * 60 * 24 * 365;
export function createAuthCookie(res: FastifyReply, userId: number) {
  res.cookie("uid", userId.toString(), {
    path: "/",
    signed: true, // signed using server secret key
    httpOnly: true, // prevent access by any client side javascript
    secure: isProduction ? true : false, // only send over https when true
    sameSite: isProduction ? "strict" : "lax", // strict - only sends cookie if the request originates from the same site ; "lax" - send cookie for top-level navigations and GET HTTP methods
    maxAge: oneYearInMs, // browser auto delete expiration
  });
}

type AuthContext =
  | {
      isAuthenticated: true;
      userId: UserId;
    }
  | {
      isAuthenticated: false;
      userId: undefined;
    };

export function parseAuthCookie(req: FastifyRequest): AuthContext {
  const cookie = req.unsignCookie(req.cookies.uid || "");

  if (cookie.valid) {
    return {
      isAuthenticated: true,
      userId: Number(cookie.value) as UserId,
    };
  }

  return {
    isAuthenticated: false,
    userId: undefined,
  };
}
