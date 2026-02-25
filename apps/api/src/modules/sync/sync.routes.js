import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { runSync } from "./sync.service.js";

const router = Router();

router.post("/run", requireAuth, async (req, res, next) => {
  try {
    const result = await runSync(req.body || {});
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
