import { isProduction } from "@server/utils/envUtils";
import { logger } from "@server/utils/logger";
import { UserId } from "@shared/types";
import express from "express";

export function createAuthCookie(res: express.Response, userId: number) {
  logger.debug(`Creating auth cookie for userId ${userId}`);
  const oneYearInMs = 1000 * 60 * 60 * 24 * 365;
  res.cookie("uid", userId, {
    signed: true, // signed using server secret key
    httpOnly: true, // prevent access by any client side javascript
    secure: isProduction ? true : false, // only sent over https when true
    sameSite: isProduction ? "strict" : "lax", // Only sends cookie if the request originates from the same site, "lax": Sends cookie for top-level navigations and GET HTTP methods
    maxAge: oneYearInMs, // browser auto deletes this cookie after this time
  });
}

type AuthContext = {
  isAuthenticated: boolean;
  userId: UserId;
};

export function parseAuthCookie(req: express.Request): AuthContext {
  return {
    isAuthenticated: req.signedCookies.uid ? true : false,
    userId: req.signedCookies.uid,
  };
}

