import app from "./app.js";
import { env } from "./config/env.js";
import { runMigrations } from "./db/migrate.js";

async function main(){
await runMigrations();

app.listen(env.PORT, () => {
console.log(`Analyteca API is running on port ${env.PORT}`);
});
}

main().catch((err) => {
console.error(err);
process.exit(1);
});
