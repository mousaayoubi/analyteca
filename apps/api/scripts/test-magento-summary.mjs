import dotenv from "dotenv";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const baseUrl = (process.env.MAGENTO_BASE_URL || "").replace(/\/$/, "");
const token = process.env.MAGENTO_INTEGRATION_TOKEN || "";

if (!baseUrl || !token) {
  console.error("Missing MAGENTO_BASE_URL or MAGENTO_INTEGRATION_TOKEN");
  process.exit(1);
}

const url = new URL(`${baseUrl}/rest/V1/analyteca/insights/summary`);
url.searchParams.set("from", "2026-01-01");
url.searchParams.set("to", "2026-03-08");
url.searchParams.set("statuses", "pending,processing,complete");

const response = await fetch(url, {
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

const bodyText = await response.text();

let body;
try {
  body = JSON.parse(bodyText);
} catch {
  body = bodyText;
}

console.log("HTTP Status:", response.status);
console.log(JSON.stringify(body, null, 2));

if (!response.ok) {
  process.exit(1);
}
