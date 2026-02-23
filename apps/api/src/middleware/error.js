import { ZodError } from "zod";
import { zodIssues } from "./validate.js";
import { logger } from "../utils/logger.js";

export function errorHandler(err, req, res, _next) {
  // Expected client-side validation error
  if (err instanceof ZodError) {
    logger.warn(
      {
        requestId: req.requestId,
        path: req.originalUrl,
        method: req.method,
        issues: zodIssues(err),
      },
      "validation failed"
    );

    return res.status(400).json({
      error: "Validation Error",
      requestId: req.requestId,
      issues: zodIssues(err),
    });
  }

  const status = err.status || 500;

  // Only log stack traces for server errors
  if (status >= 500) {
    logger.error(
      {
        requestId: req.requestId,
        err, // pino will include stack
        path: req.originalUrl,
        method: req.method,
      },
      "request failed"
    );
  } else {
    logger.warn(
      {
        requestId: req.requestId,
        message: err.message,
        path: req.originalUrl,
        method: req.method,
      },
      "request rejected"
    );
  }

  return res.status(status).json({
    error: status === 500 ? "Internal Server Error" : (err.message || "Error"),
    requestId: req.requestId,
    ...(process.env.NODE_ENV !== "production" && status >= 500
      ? { message: err.message }
      : {}),
  });
}
