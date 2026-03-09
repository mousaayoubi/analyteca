const MAGENTO_BASE_URL = (process.env.MAGENTO_BASE_URL || "").replace(/\/$/, "");
const MAGENTO_INTEGRATION_TOKEN = process.env.MAGENTO_INTEGRATION_TOKEN || "";

export class MagentoSummaryError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "MagentoSummaryError";
    this.status = status;
    this.data = data;
  }
}

function buildSummaryUrl({ from, to, statuses = [] } = {}) {
  const url = new URL(`${MAGENTO_BASE_URL}/rest/V1/analyteca/insights/summary`);

  if (from) url.searchParams.set("from", from);
  if (to) url.searchParams.set("to", to);

  const normalizedStatuses = Array.isArray(statuses)
    ? statuses.map((s) => String(s).trim()).filter(Boolean)
    : [];

  if (normalizedStatuses.length) {
    url.searchParams.set("statuses", normalizedStatuses.join(","));
  }

  return url.toString();
}

export async function fetchMagentoSummary({ from, to, statuses = [] } = {}) {
  if (!MAGENTO_BASE_URL) {
    throw new Error("MAGENTO_BASE_URL is not configured");
  }

  if (!MAGENTO_INTEGRATION_TOKEN) {
    throw new Error("MAGENTO_INTEGRATION_TOKEN is not configured");
  }

  const url = buildSummaryUrl({ from, to, statuses });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${MAGENTO_INTEGRATION_TOKEN}`,
    },
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new MagentoSummaryError("Failed to fetch Magento summary", {
      status: response.status,
      data,
    });
  }

  return {
    ...data,
    dataSource: "custom-magento-api",
  };
}
