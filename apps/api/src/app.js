import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error.js";
import { query } from "./db/index.js";
import { env } from "./config/env.js";
import authRoutes from "./modules/auth/auth.routes.js";
import metricsRoutes from "./modules/metrics/metrics.routes.js";
import syncRoutes from "./modules/sync/sync.routes.js";
import { requestId } from "./middleware/requestId.js";
import { loggerHttp } from "./middleware/loggerHttp.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestId);
app.use(loggerHttp);

app.use("/auth", authRoutes);
app.use("/metrics", metricsRoutes);
app.use("/sync", syncRoutes);

app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

app.get("/db-test", async (req, res) => {
	try {
		const result = await query("SELECT NOW()");
		res.json({ connected: true, time: result[0].now });
	} catch (err) {
		console.error(err);
		res.status(500).json({ 
			connected: false,
			error: err.message	
		});
	}
});

app.get("/env-check", (req, res) => {
res.json({
	DATABASE_URL: env.DATABASE_URL,
	DATABASE_URL_json: JSON.stringify(env.DATABASE_URL),
});
});

app.use(errorHandler);

export default app;
