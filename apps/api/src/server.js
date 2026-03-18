import "dotenv/config";
import app from "./app.js";
import { env } from "./config/env.js";
import { runMigrations } from "./db/migrate.js";
import magentoIntegrationRoutes from "./modules/integrations/magento.routes.js";

async function main(){
await runMigrations();

app.use("/api/integrations/magento", magentoIntegrationRoutes);

app.listen(env.PORT, () => {
console.log(`Analyteca API is running on port ${env.PORT}`);
});
}

main().catch((err) => {
console.error(err);
process.exit(1);
});
