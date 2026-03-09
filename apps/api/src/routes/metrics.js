import { Router } from "express";
import { getSummary } from "../controllers/metricsController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = Router();

router.get("/summary", isLoggedIn, getSummary);

export default router;
