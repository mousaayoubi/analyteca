import { query } from "../../db/index.js";

/**
 * Normalize date range
 */
function normalizeRange({ from, to }) {
  const todayIso = new Date().toISOString().slice(0, 10);

  const toIso = to ? String(to).slice(0, 10) : todayIso;
  const fromIso = from
    ? String(from).slice(0, 10)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

  return { fromIso, toIso };
}

export async function getSummary({ from, to, includeZeros }) {
  const { fromIso, toIso } = normalizeRange({ from, to });

  const rows = await query(
    `
    SELECT day, revenue, orders, aov, refunds
    FROM metrics_daily
    WHERE day BETWEEN $1::date AND $2::date
    ORDER BY day ASC
    `,
    [fromIso, toIso]
  );

  // Format rows cleanly for frontend
  let daily = rows.map((r) => ({
    day: new Date(r.day).toISOString().slice(0, 10), // clean format
    revenue: Number(r.revenue || 0),
    orders: Number(r.orders || 0),
    aov: Number(r.aov || 0),
    refunds: Number(r.refunds || 0),
  }));

  // Optional: remove zero days
  if (includeZeros !== "1") {
    daily = daily.filter(
      (d) =>
        d.revenue !== 0 ||
        d.orders !== 0 ||
        d.refunds !== 0
    );
  }

  // Totals
  const totals = daily.reduce(
    (acc, d) => {
      acc.revenue += d.revenue;
      acc.orders += d.orders;
      acc.refunds += d.refunds;
      return acc;
    },
    { revenue: 0, orders: 0, refunds: 0 }
  );

  totals.aov =
    totals.orders > 0
      ? Number((totals.revenue / totals.orders).toFixed(2))
      : 0;

  return {
    range: { from: fromIso, to: toIso },
    totals: {
      revenue: Number(totals.revenue.toFixed(2)),
      orders: totals.orders,
      aov: totals.aov,
      refunds: Number(totals.refunds.toFixed(2)),
    },
    daily,
  };
}
