import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";

class HttpError extends Error {
  readonly errorCode: TRPC_ERROR_CODE_KEY = "NOT_IMPLEMENTED";
  readonly statusCode: number = 501;
}

export class NotFoundError extends HttpError {
  readonly errorCode: TRPC_ERROR_CODE_KEY = "NOT_FOUND";
  readonly statusCode: number = 404;
}

export class BadRequestError extends HttpError {
  readonly errorCode: TRPC_ERROR_CODE_KEY = "BAD_REQUEST";
  readonly statusCode: number = 400;
}

export class UnauthorizedError extends HttpError {
  readonly errorCode: TRPC_ERROR_CODE_KEY = "UNAUTHORIZED";
  readonly statusCode: number = 401;
}

export function getTRPCErrorCode(defaultErrorCode: TRPC_ERROR_CODE_KEY, error: TRPCError): TRPC_ERROR_CODE_KEY {
  if (error.cause instanceof HttpError) {
    return error.cause.errorCode;
  }
  return defaultErrorCode;
}

export function getTRPCHttpStatusCode(defaultHttpStatusCode: number, error: TRPCError): number {
  if (error.cause instanceof HttpError) {
    return error.cause.statusCode;
  }
  return defaultHttpStatusCode;
}