import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getSummary, MetricsServiceError } from "./metrics.service.js";

const router = Router();

router.get("/summary", requireAuth, async (req, res) => {
  try {
    const { from, to } = req.query;

    const data = await getSummary({ from, to });

    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof MetricsServiceError) {
      return res.status(error.status).json({
        error: {
          code: error.code,
          message: error.message,
          details: error.details || null,
        },
      });
    }

    console.error("[metrics.summary] unexpected error", error);

    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected error while loading metrics summary.",
      },
    });
  }
});

export default router;
