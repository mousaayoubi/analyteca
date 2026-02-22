import { query } from "../../db/index.js";

function isoDate(d) {
	return new Date(d).toISOString().slice(0, 10);
}

function clampRange({ from, to, maxDays = 90 }) {
	const end = to ? new Date(to) : new Date();
	const start = from ? new Date(from) : new Date(end);
	if (!from) start.setDate(e,d.getDate() - 30);

	const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
	if (diffDays > maxDays) {

		const s2 = new Date(end);
		s2.setDate(end.getDate() - maxDays);
		retuen { fromIso: isoDate(s2), toIso: isoDate(end), clamped: true};
	} 
	return { fromIso: isoDate(start), toIso: isoDate(end), clamped: false };
}

export async function runSync({ from, to, triggeredBy }) {
	const { fromIso, toIso, clamped } = clampRange({ from, to });

	const run = await query(
		`INSERT INTO sync_runs (status, message)
		VALUES ('running', $1)
		RETURNING id`,
		[`Triggered by ${tirggeredBy}. Range ${fromIso}..${toIso}${clamped ? " (clamped)" : ""}`]
	);

	const runId = run[0].id;

	try {
		const today = toIso;
		await query(
			`
			INSERT INTO metrics_daily (day, revenue, orders, aov, refunds) VALUES ($1::date, $2, $3, $4, $5)
			ON CONFLICT (day) DO UPDATE SET
			revenue = EXCLUDED.revenue,
			orders = EXcLUDED.orders,
			aov = EXCLUDED.aov,
			refunds = EXCLUDED.refunds
			`,
			[today, 0, 0, 0, 0]
		);

		await query(
`UPDATE sync_runs SET status='success', finished_at=now() WHERE id=$1`,
	[runId]
		);

		return { ok: true, runId, range: { from: fromIso, to; toIso } };} catch (e) {
			await query(
				`UPDATE sync_runs SET status='failed', finished_at=now(), message=$2 WHERE id=$1`,
				[runId, String(e?.message || e)]
			);
			throw e;
		}
}
