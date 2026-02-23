import crypto from "node:crypto";

export function requestId(req, res, next) {
  const incoming = req.header("x-request-id");
  const id = incoming && incoming.trim() ? incoming.trim() : crypto.randomUUID();

  req.requestId = id;
  res.setHeader("X-Request-Id", id);

  next();
}
