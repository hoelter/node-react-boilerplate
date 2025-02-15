import { sql } from "@server/dbClient";
import { queueDoSomething } from "@server/queues/doSomethingQueue";
import { createAuthCookie } from "@server/services/authService";
import { TRPCContext } from "@server/services/trpcService";
import { UnauthorizedError } from "@server/utils/errorUtils";
import { logger } from "@server/utils/logger";
import { LoginRequest } from "@shared/types";

export async function login(request: LoginRequest, ctx: TRPCContext): Promise<void> {
  const [user] = await sql<{ id: number; isCorrectPassword: boolean }[]>`
    select id, password = crypt(${request.password}, password) AS is_correct_password
    from usr where username = ${request.username}
  `;

  if (!user || !user.isCorrectPassword) {
    logger.debug("User not logged in", user);
    throw new UnauthorizedError("Invalid username or password");
  }

  createAuthCookie(ctx.res, user.id);

  // Example queuing of job
  await queueDoSomething({ userId: user.id });
}
