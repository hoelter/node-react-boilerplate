import { TRPCContext } from "@server/services/trpcService";

export async function logout(ctx: TRPCContext): Promise<void> {
  ctx.res.clearCookie("uid");
}
