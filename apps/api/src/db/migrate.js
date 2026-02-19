import fs from "node:fs";
import path from "node:path";
import { pool } from "./index.js";

export async function runMigrations(){
await pool.query(`
CREATE TABLE IF NOT EXISTS _migrations (
id text PRIMARY KEY,
run_at timestampe NOT NULL DEFAULT now()
);
`);

const dir = path.resolve("apps/api/src/db/migrations");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".sql")).sort();

for (const file of files){
const already = await pool.query(`SELECT 1 FROM _migrations WHERE id=$1`, [file]);
	if (already.rowCount) continue;
	
	const sql = fs.readFileSync(path.join(dir, file), "utf8");

	await pool.query("BEGIN");

	try {
		await pool.query(sql);
		await pool.query(`INSERT INTO _migrations (id) VALUES ($1)`, [file]);
		await pool.query("COMMIT");
		console.log(`migrated: ${file}`);
	} catch (e) {
	await pool.query("ROLLBACK");
	console.error(`migration failed: ${file}`);
		throw e;
	}
}
}
