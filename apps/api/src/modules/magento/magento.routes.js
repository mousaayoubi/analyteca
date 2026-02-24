import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { magentoGet } from "./magento.client.js";

const router = Router();

router.get("/ping", requireAuth, async (req, res, next) => {
  try {
    const data = await magentoGet("/rest/V1/orders", {
      "searchCriteria[currentPage]": 1,
      "searchCriteria[pageSize]": 1,
    });

    const first = Array.isArray(data?.items) ? data.items[0] : null;

    res.json({
      ok: true,
      total_count: data?.total_count ?? null,
      sample: first
        ? {
            entity_id: first.entity_id,
            increment_id: first.increment_id,
            created_at: first.created_at,
            status: first.status,
            grand_total: first.grand_total,
            customer_email: first.customer_email,
          }
        : null,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/debug", requireAuth, (req, res) => {
  const t = process.env.MAGENTO_TOKEN || "";
  res.json({
    baseUrl: process.env.MAGENTO_BASE_URL,
    tokenPrefix: t.slice(0, 6),
    tokenSuffix: t.slice(-6),
    tokenLen: t.length,
  });
});

export default router;
