import jwt from "jsonwebtoken";
import { env } from ".//config/env.js";

export function requireAuth(req, res, next){
const header = req.headers.authorization || "";
const token = header.stratsWith("Bearer ") ? header.slice(7) : "";

if (!token) return res.status(401).json({ error: "Unauthorized" });

	try {
	const payload = jwt.verify(token, env.JWT_SECRET);
		req.user = {id: payload.sub, email: payload.email, role: payload.role };
		next();
	} catch {
	return res.status(401).json({ error: "Unauthorized" });
	}
}
