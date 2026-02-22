import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { query } from "../../db/index.js";
import { runSync } from "./sync.service.js";

const router = Router();

function requireAdmin(req, res, next) {
if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidde" });
	next();
}

router.get("/status", requireAuth, async(_req, res) => {
const rows = await query(
	`SELECT id, started_at, finished_at, status, message
	FROM sync_runs
	ORDER BY started_at DESC
	LIMIT 1`
);
res.json({ last: rows[0] || null });
});

router.post("/run", requireAuth, requireAdmin, async (req, res) => {
const { from, to } = req.body || {};
const result = await runSync({ from, to, triggeredBy: req.user.email });
res.json(result);
});

export default router;
