import { query } from "../../db/index.js";


function isoDate(d) {
return new Date(d).toISOString().slice(0, 10);
}

function defaultRange({ from, to }) {
const end = to ? new Date(to) : new Date();
const start = from ? new Date(from) : new Date(end);
if (!from) start.setDate(end.getDate() - 30);

const fromIso = isoDate(start);
const toIso = isoDate(end);

	return { fromIso, toIso };
}

export async function getSummary({ from, to}) {
	const { fromIso, toIso } = defaultRange({ from, to });

	const daily = await query(
		`SELECT day, 
		revenue::float AS revenue,
		orders,
		aov::float AS aov,
		refunds::float AS refunds
		FROM metrics_daily
		WHERE day BETWEEN $1::date AND $2::date
		ORDER BY day ASC
		`,
		[fromIso, toIso]
	);

	const totals = daily.reduce(
		(acc, r) => {
			acc.revenue += r.revenue || 0;
			acc.orders += r.orders || 0;
			acc.refunds += r.refunds || 0
			return acc;
		},
		{revenue: 0, orders: 0, refunds: 0 }
	);

	const aov = totals.orders > 0 ? totals.revenue / totals.orders: 0;

	return {
		range: { from: fromIso, to: toIso},
		totals: {
			revenue: Number(totals.revenue.toFixed(2)),
			orders: totals.orders,
			aov: Number(aov.toFixed(2)),
			refunds: Number(totals.refunds.toFixed(2)),
		},
		daily,
	};
}
