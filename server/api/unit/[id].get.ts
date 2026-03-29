import { eq } from "drizzle-orm";
import { auth } from "~/lib/auth";
import db from "~/lib/db/index";
import { unit } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    return createError({ statusCode: 401, message: "Unauthorized" });
  };
  const id = getRouterParam(event, "id");
  const result = await db.select().from(unit).where(eq(unit.id, Number(id)));
  if (result.length === 0) {
    return createError({ statusCode: 404, message: "Unit not found" });
  }
  return result[0]?.name;
});
