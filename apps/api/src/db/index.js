import pkg from "pg";
import { env } from "../config/env.js";

const { Pool } = pkg;

export const pool = new Pool({
	connectionString: env.DATABASE_URL
});

export async function query(text, params){
const res = await pool.query(text, params);
	return res.rows;
}
