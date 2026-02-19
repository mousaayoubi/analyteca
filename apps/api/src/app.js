import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error.js";
import { query } from "./db/index.js";
import { env } from "./config/env.js";

const app = express();

app.use(cors());
app.use(express.json());

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
