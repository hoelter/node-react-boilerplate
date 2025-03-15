import { isProduction } from "@server/utils/envUtils";
import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { ValiError } from "valibot";

class PublicHttpError extends Error {
  readonly errorCode: TRPC_ERROR_CODE_KEY = "NOT_IMPLEMENTED";
  readonly statusCode: number = 501;
}

export class NotFoundError extends PublicHttpError {
  readonly errorCode: TRPC_ERROR_CODE_KEY = "NOT_FOUND";
  readonly statusCode: number = 404;
}

export class BadRequestError extends PublicHttpError {
  readonly errorCode: TRPC_ERROR_CODE_KEY = "BAD_REQUEST";
  readonly statusCode: number = 400;
}

export class UnauthorizedError extends PublicHttpError {
  readonly errorCode: TRPC_ERROR_CODE_KEY = "UNAUTHORIZED";
  readonly statusCode: number = 401;
}

export function isPublicHttpError(error: TRPCError) {
  return error.cause instanceof PublicHttpError;
}

export function getTRPCErrorCode(defaultErrorCode: TRPC_ERROR_CODE_KEY, error: TRPCError): TRPC_ERROR_CODE_KEY {
  if (error.cause instanceof PublicHttpError) {
    return error.cause.errorCode;
  }
  return defaultErrorCode;
}

export function getTRPCHttpStatusCode(defaultHttpStatusCode: number, error: TRPCError): number {
  if (error.cause instanceof PublicHttpError) {
    return error.cause.statusCode;
  }
  return defaultHttpStatusCode;
}

export function getOutputMessage(message: string, error: TRPCError) {
  if (error.cause instanceof ValiError) {
    // return error.cause.flatten().formErrors[0];
    return error.cause.message;
  }
  if (!isProduction) {
    return message;
  }
  if (isProduction && isPublicHttpError(error)) {
    return message;
  }
  return "Something went wrong.";
}
