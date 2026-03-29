import { auth } from "~/lib/auth";
import db from "~/lib/db/index";
import { faction } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    return createError({ statusCode: 401, message: "Unauthorized" });
  };
  const result = await db.select().from(faction);
  return result;
});
