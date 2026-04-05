import { and, eq } from "drizzle-orm";
import { auth } from "~/lib/auth";
import db from "~/lib/db/index";
import { userUnit } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const id = Number(getRouterParam(event, "id"));
  if (!id) {
    throw createError({ statusCode: 400, message: "id is required" });
  }

  const userId = Number(session.user.id);
  const body = await readBody(event);

  const existing = await db
    .select()
    .from(userUnit)
    .where(and(eq(userUnit.id, id), eq(userUnit.userId, userId)));

  if (existing.length === 0) {
    throw createError({ statusCode: 404, message: "Unit not found" });
  }

  await db
    .update(userUnit)
    .set(body)
    .where(and(eq(userUnit.id, id), eq(userUnit.userId, userId)));

  return { success: true };
});
