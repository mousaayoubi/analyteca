import { query } from "../../db/index.js";
import { fetchOrdersByCreatedAt } from "../magento/magento.orders.js";

/**
 * Clamp and normalize date range.
 * Ensures ISO yyyy-mm-dd format and sane defaults.
 */
function clampRange({ from, to }) {
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const toIso = to ? String(to).slice(0, 10) : todayIso;

  const fromDate = from
    ? new Date(String(from).slice(0, 10) + "T00:00:00Z")
    : new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const fromIso = fromDate.toISOString().slice(0, 10);

  return { fromIso, toIso };
}

/**
 * Main sync runner
 */
export async function runSync({ from, to }) {
  const { fromIso, toIso } = clampRange({ from, to });

  // 1) Create sync_run record
  const runRows = await query(
  `
  INSERT INTO sync_runs (range_from, range_to, status)
  VALUES ($1::date, $2::date, 'running')
  RETURNING id
  `,
  [fromIso, toIso]
);

const runId = runRows[0].id;

  try {
    // 2) Prepare daily buckets
    const dayMap = new Map();

    const start = new Date(fromIso + "T00:00:00Z");
    const end = new Date(toIso + "T00:00:00Z");

    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      dayMap.set(key, { revenue: 0, orders: 0 });
    }

    // 3) Fetch Magento orders for range
    const orders = await fetchOrdersByCreatedAt({
      fromIso,
      toIso,
      pageSize: 100,
    });

    const allowedStatuses = new Set(["processing", "complete"]);

    for (const o of orders) {
      if (!allowedStatuses.has(o.status)) continue;

      const day = String(o.created_at).slice(0, 10);
      if (!dayMap.has(day)) continue;

      const bucket = dayMap.get(day);

      const amount = Number(
        o.base_grand_total ?? o.grand_total ?? 0
      );

      bucket.revenue += amount;
      bucket.orders += 1;
    }

    // 4) Upsert metrics_daily
    for (const [day, b] of dayMap.entries()) {
      const revenue = Number(b.revenue.toFixed(2));
      const ordersCount = b.orders;
      const aov =
        ordersCount > 0
          ? Number((revenue / ordersCount).toFixed(2))
          : 0;

      await query(
        `
        INSERT INTO metrics_daily (day, revenue, orders, aov, refunds)
        VALUES ($1::date, $2, $3, $4, 0)
        ON CONFLICT (day)
        DO UPDATE SET
          revenue = EXCLUDED.revenue,
          orders = EXCLUDED.orders,
          aov = EXCLUDED.aov
        `,
        [day, revenue, ordersCount, aov]
      );
    }

    // 5) Mark sync as success
    await query(
      `
      UPDATE sync_runs
      SET status = 'success', completed_at = NOW()
      WHERE id = $1
      `,
      [runId]
    );

    return {
      ok: true,
      runId,
      range: { from: fromIso, to: toIso },
      daysProcessed: dayMap.size,
      ordersFetched: orders.length,
    };
  } catch (err) {
    // Mark as failed
    await query(
      `
      UPDATE sync_runs
      SET status = 'failed', completed_at = NOW()
      WHERE id = $1
      `,
      [runId]
    );

    throw err;
  }
}
