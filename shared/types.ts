import * as v from "valibot";

export type HelloWorld = string & { brand: "HelloWorld" };

export type IsoDateTime = string & { brand: "IsoDateTime" };
export type UserId = number & { brand: "userId" };

export const loginRequestSchema = v.object({
  username: v.pipe(v.string(), v.trim(), v.minLength(1)),
  password: v.pipe(v.string(), v.trim(), v.minLength(1)),
});
export type LoginRequest = v.InferInput<typeof loginRequestSchema>;
