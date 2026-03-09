import { Router } from "express";
import { getInsightsSummary } from "../controllers/insightsController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = Router();

router.get("/summary", isLoggedIn, getInsightsSummary);

export default router;
