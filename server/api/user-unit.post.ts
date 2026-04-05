import { and, eq } from "drizzle-orm";
import { auth } from "~/lib/auth";
import db from "~/lib/db/index";
import { unit, userUnit } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);
  const { unitId, boxedCount, builtCount, primedCount, paintedCount, battleReadyCount } = body;

  if (!unitId) {
    throw createError({ statusCode: 400, message: "unitId is required" });
  }

  const userId = Number(session.user.id);

  const unitRows = await db.select({ factionId: unit.factionId }).from(unit).where(eq(unit.id, Number(unitId)));
  if (!unitRows[0]) {
    throw createError({ statusCode: 404, message: "Unit not found" });
  }
  const factionId = unitRows[0].factionId;

  const existing = await db
    .select({ id: userUnit.id })
    .from(userUnit)
    .where(and(eq(userUnit.userId, userId), eq(userUnit.unitId, Number(unitId))));

  if (existing.length > 0) {
    throw createError({ statusCode: 409, message: `You already have this unit in your collection, please go to your collection to edit` });
  }

  try {
    await db.insert(userUnit).values({
      userId,
      unitId: Number(unitId),
      factionId,
      boxedCount: Number(boxedCount ?? 0),
      builtCount: Number(builtCount ?? 0),
      primedCount: Number(primedCount ?? 0),
      paintedCount: Number(paintedCount ?? 0),
      battleReadyCount: Number(battleReadyCount ?? 0),
    });
    return { success: true };
  }
  catch (err: any) {
    throw createError({ statusCode: 500, message: err?.message ?? "Failed to insert unit" });
  }
});
