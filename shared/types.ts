import z from "zod";

export type HelloWorld = string & { brand: "HelloWorld" };

export type IsoDateTime = string & { brand: "IsoDateTime" };
export type UserId = number & { brand: "userId" };

export const loginRequestSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
