import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { runSync } from "./sync.service.js";
import { query } from "../../db/index.js"; // ✅ add this

const router = Router();

router.post("/run", requireAuth, async (req, res, next) => {
  try {
    const result = await runSync(req.body || {});
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ✅ NEW: GET /sync/last  -> last successful sync timestamp + range
router.get("/last", requireAuth, async (req, res, next) => {
  try {
    const rows = await query(
      `
      SELECT id, range_from, range_to, status, completed_at
      FROM sync_runs
      WHERE status = 'success'
      ORDER BY completed_at DESC NULLS LAST
      LIMIT 1
      `
    );

    const last = rows?.[0] || null;

    res.json({
      lastSyncAt: last?.completed_at || null,
      lastRange: last ? { from: last.range_from, to: last.range_to } : null,
      lastRunId: last?.id || null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
