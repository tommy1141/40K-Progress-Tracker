import fs from "node:fs";
import { parse } from "csv-parse";
import db from "../lib/db";
import { faction, unit } from "../lib/db/schema";

type CsvRow = {
  Faction: string;
  Section: string;
  Unit: string;
};

const CSV_PATH = "content/40k_points.csv";

async function ingest() {
  const rows = await new Promise<CsvRow[]>((resolve, reject) => {
    const collected: CsvRow[] = [];
    fs.createReadStream(CSV_PATH)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row: CsvRow) => {
        if (row.Section === "Regular") {
          const faction = row.Faction.trim();
          if (!faction.toLowerCase().startsWith("codex") && !faction.toLowerCase().startsWith("index")) {
            row.Faction = `LEGENDS: ${faction}`;
          }
          collected.push(row);
        }
      })
      .on("end", () => resolve(collected))
      .on("error", reject);
  });

  // Insert unique factions
  const uniqueFactionNames = [...new Set(rows.map(r => r.Faction))];
  await db.insert(faction).values(uniqueFactionNames.map(name => ({ name }))).onConflictDoNothing();

  // Build faction name -> id map
  const factions = await db.select().from(faction);
  const factionMap = new Map(factions.map(f => [f.name, f.id]));

  // Insert units
  const unitRows = rows.map(r => ({
    name: r.Unit,
    factionId: factionMap.get(r.Faction)!,
  }));
  await db.insert(unit).values(unitRows).onConflictDoNothing();
}

ingest().catch(console.error);
