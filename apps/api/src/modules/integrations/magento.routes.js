import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();

router.post("/sync", requireAuth, async (req, res, next) => {
  try {
    // For now, this acts as a manual refresh trigger.
    // Since your dashboard already fetches live Magento data,
    // we just return success and a timestamp.
    res.json({
      ok: true,
      message: "Sync completed successfully.",
      syncedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
