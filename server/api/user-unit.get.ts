import { eq } from "drizzle-orm";
import { auth } from "~/lib/auth";
import db from "~/lib/db/index";
import { unit, userUnit } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    return createError({ statusCode: 401, message: "Unauthorized" });
  };
  const userId = Number(session.user.id);
  const units = await db
    .select({
      id: userUnit.id,
      unitId: userUnit.unitId,
      unitName: unit.name,
      boxedCount: userUnit.boxedCount,
      builtCount: userUnit.builtCount,
      primedCount: userUnit.primedCount,
      paintedCount: userUnit.paintedCount,
      battleReadyCount: userUnit.battleReadyCount,
    })
    .from(userUnit)
    .innerJoin(unit, eq(userUnit.unitId, unit.id))
    .where(eq(userUnit.userId, userId));
  return units;
});
