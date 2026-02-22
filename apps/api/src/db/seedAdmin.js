import bcrypt from "bcryptjs";
import { query } from "./index.js";

const email = process.env.ADMIN_EMAIL || "admin@analytca.com";
const pass = process.env.ADMIN_PASSWORD || "Password1A";
const role = process.env.ADMIN_ROLE || "admin";

async function main(){
const hash = await bcrypt.hash(pass, 10);

await query(
	`INSERT INTO users (email, password_hash, role)
	VALUES ($1, $2, $3)
	ON CONFLICT (email) DO UPDATE
	SET password_hash = EXCLUDED.password_hash,
	role = EXCLUDED.role`,
	[email, hash, role]
);
console.log(`Seeded admin: ${email}`);
process.exit(0);
}

main().catch((e) => {
console.error(e);
process.exit(1);
});
