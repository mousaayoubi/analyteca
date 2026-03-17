const DEFAULT_TIMEOUT_MS = 20000;
const DEFAULT_ANALYTICS_PATH = "/rest/V1/analyteca/insights/summary";

class MetricsServiceError extends Error {
  constructor(message, { status = 500, code = "METRICS_SERVICE_ERROR", details } = {}) {
    super(message);
    this.name = "MetricsServiceError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new MetricsServiceError(`Missing required environment variable: ${name}`, {
      status: 500,
      code: "CONFIG_MISSING",
    });
  }
  return value;
}

function isValidDateOnly(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function assertValidRange({ from, to }) {
  if (!from || !to) {
    throw new MetricsServiceError("Both 'from' and 'to' query params are required.", {
      status: 400,
      code: "INVALID_RANGE",
    });
  }

  if (!isValidDateOnly(from) || !isValidDateOnly(to)) {
    throw new MetricsServiceError("Dates must be in YYYY-MM-DD format.", {
      status: 400,
      code: "INVALID_DATE_FORMAT",
    });
  }

  const fromDate = new Date(`${from}T00:00:00Z`);
  const toDate = new Date(`${to}T23:59:59Z`);

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    throw new MetricsServiceError("Invalid date values.", {
      status: 400,
      code: "INVALID_DATE",
    });
  }

  if (fromDate > toDate) {
    throw new MetricsServiceError("'from' cannot be later than 'to'.", {
      status: 400,
      code: "INVALID_RANGE_ORDER",
    });
  }

  const diffDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
  if (diffDays > 366) {
    throw new MetricsServiceError("Date range cannot exceed 366 days.", {
      status: 400,
      code: "RANGE_TOO_LARGE",
    });
  }
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function sortByDateAscending(items) {
  return [...items].sort((a, b) => {
    const aTime = new Date(`${a.date}T00:00:00Z`).getTime();
    const bTime = new Date(`${b.date}T00:00:00Z`).getTime();
    return aTime - bTime;
  });
}

function formatShortLabel(dateString) {
  const d = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
}

function formatDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function parsePossibleJsonObject(item) {
  if (item && typeof item === "object") {
    return item;
  }

  if (typeof item === "string") {
    try {
      const parsed = JSON.parse(item);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }

  return null;
}

function normalizeTimeseries(payload) {
  const raw =
    payload?.timeseries ||
    payload?.time_series ||
    payload?.daily ||
    payload?.series ||
    payload?.chart ||
    payload?.revenueSeries ||
    payload?.data?.timeseries ||
    payload?.data?.time_series ||
    [];

  if (!Array.isArray(raw)) return [];

  const parsed = raw.map(parsePossibleJsonObject).filter(Boolean);

  const normalized = parsed
    .map((item, index) => {
      const date =
        item?.date ||
        item?.day ||
        item?.period ||
        item?.label ||
        item?.name ||
        null;

      const safeDate =
        typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
          ? date
          : null;

      const label = safeDate ? formatShortLabel(safeDate) : item?.label || `Point ${index + 1}`;

      return {
        date: safeDate || item?.date || item?.label || `Point ${index + 1}`,
        label,
        revenue: toNumber(
          item?.revenue ??
            item?.totalRevenue ??
            item?.total_revenue ??
            item?.amount ??
            item?.grand_total ??
            0
        ),
        orders: toNumber(
          item?.orders ??
            item?.orderCount ??
            item?.totalOrders ??
            item?.total_orders ??
            item?.count ??
            0
        ),
        aov: toNumber(
          item?.aov ??
            item?.averageOrderValue ??
            item?.average_order_value ??
            item?.avgOrderValue ??
            0
        ),
      };
    })
    .filter((item) => item.date);

  return normalized.some((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.date))
    ? sortByDateAscending(normalized)
    : normalized;
}

function fillMissingDailyTimeseries(timeseries, from, to) {
  if (!from || !to) return timeseries;

  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return timeseries;
  }

  const byDate = new Map(
    timeseries.map((item) => [
      item.date,
      {
        ...item,
        revenue: toNumber(item.revenue, 0),
        orders: toNumber(item.orders, 0),
        aov: toNumber(item.aov, 0),
      },
    ])
  );

  const filled = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const date = formatDateOnly(cursor);
    const existing = byDate.get(date);

    if (existing) {
      filled.push({
        ...existing,
        label: existing.label || formatShortLabel(date),
      });
    } else {
      filled.push({
        date,
        label: formatShortLabel(date),
        revenue: 0,
        orders: 0,
        aov: 0,
      });
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return filled;
}

function normalizeStatusBreakdown(payload) {
  const raw =
    payload?.statusBreakdown ||
    payload?.statuses ||
    payload?.status_breakdown ||
    payload?.data?.statusBreakdown ||
    payload?.data?.status_breakdown ||
    [];

  if (!Array.isArray(raw)) return [];

  return raw.map((item) => ({
    status: String(item?.status || item?.name || "Unknown"),
    orders: toNumber(item?.orders ?? item?.count ?? item?.total_orders ?? 0),
    revenue: toNumber(item?.revenue ?? item?.amount ?? item?.total_revenue ?? 0),
  }));
}

function normalizeSummary(payload, sourceLabel, requestedFrom, requestedTo) {
  const revenue = toNumber(
    payload?.revenue ??
      payload?.totalRevenue ??
      payload?.total_revenue ??
      payload?.summary?.revenue ??
      payload?.data?.revenue ??
      payload?.totals?.revenue ??
      0
  );

  const orders = toNumber(
    payload?.orders ??
      payload?.totalOrders ??
      payload?.total_orders ??
      payload?.summary?.orders ??
      payload?.data?.orders ??
      payload?.totals?.orders ??
      0
  );

  const aov = toNumber(
    payload?.aov ??
      payload?.averageOrderValue ??
      payload?.average_order_value ??
      payload?.summary?.aov ??
      payload?.data?.aov ??
      payload?.totals?.aov ??
      (orders > 0 ? revenue / orders : 0)
  );

  const refunds = toNumber(
    payload?.refunds ??
      payload?.totalRefunds ??
      payload?.total_refunds ??
      payload?.summary?.refunds ??
      payload?.data?.refunds ??
      payload?.totals?.refunds ??
      0
  );

  const normalizedTimeseries = normalizeTimeseries(payload);
  const filledTimeseries = fillMissingDailyTimeseries(
    normalizedTimeseries,
    requestedFrom || payload?.from,
    requestedTo || payload?.to
  );

  return {
    revenue,
    orders,
    aov,
    refunds,
    timeseries: filledTimeseries,
    statusBreakdown: normalizeStatusBreakdown(payload),
    sourceLabel: payload?.source || sourceLabel,
    lastSyncedAt:
      payload?.lastSyncedAt ||
      payload?.last_synced_at ||
      payload?.syncedAt ||
      payload?.updatedAt ||
      payload?.generatedAt ||
      new Date().toISOString(),
  };
}

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const text = await response.text();

    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }

    if (!response.ok) {
      throw new MetricsServiceError("Magento analytics endpoint returned an error.", {
        status: 502,
        code: "UPSTREAM_ERROR",
        details: {
          upstreamStatus: response.status,
          upstreamBody: json || text,
        },
      });
    }

    if (!json || typeof json !== "object") {
      throw new MetricsServiceError("Magento analytics endpoint returned invalid JSON.", {
        status: 502,
        code: "UPSTREAM_INVALID_JSON",
      });
    }

    return json;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new MetricsServiceError("Magento analytics request timed out.", {
        status: 504,
        code: "UPSTREAM_TIMEOUT",
      });
    }

    if (error instanceof MetricsServiceError) {
      throw error;
    }

    throw new MetricsServiceError("Failed to fetch Magento analytics data.", {
      status: 502,
      code: "UPSTREAM_FETCH_FAILED",
      details: error.message,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function getSummary({ from, to }) {
  assertValidRange({ from, to });

  const magentoBaseUrl = getRequiredEnv("MAGENTO_BASE_URL").replace(/\/+$/, "");
  const magentoToken = getRequiredEnv("MAGENTO_ACCESS_TOKEN");
  const analyticsPath = process.env.MAGENTO_ANALYTICS_PATH || DEFAULT_ANALYTICS_PATH;
  const analyticsUrl = new URL(`${magentoBaseUrl}${analyticsPath}`);

  analyticsUrl.searchParams.set("from", from);
  analyticsUrl.searchParams.set("to", to);

  const payload = await fetchJsonWithTimeout(
    analyticsUrl.toString(),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${magentoToken}`,
      },
    },
    toNumber(process.env.MAGENTO_ANALYTICS_TIMEOUT_MS, DEFAULT_TIMEOUT_MS)
  );

  return normalizeSummary(payload, "Custom Magento API", from, to);
}

export { MetricsServiceError };
