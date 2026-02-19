import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const env = {
  PORT: Number(process.env.PORT || 3000),
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret",
  DATABASE_URL: must("DATABASE_URL"),
  MAGENTO_BASE_URL: must("MAGENTO_BASE_URL"),
  MAGENTO_TOKEN: must("MAGENTO_TOKEN"),
};
