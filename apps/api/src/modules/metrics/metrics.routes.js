import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getSummary } from "./metrics.service.js";

const router = Router();

router.get("/summary", requireAuth, async (req, res) => {

	const { from, to } = req.query;

	const data = await getSummary({ from, to });
	res.json(data);
});

export default router;
