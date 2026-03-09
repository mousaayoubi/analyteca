import { fetchMagentoSummary } from "../services/magentoSummaryService.js";

export async function getSummary(req, res, next) {
  try {
    const { from, to } = req.query;

    const statuses =
      typeof req.query.statuses === "string"
        ? req.query.statuses.split(",").map((s) => s.trim()).filter(Boolean)
        : ["pending", "processing", "complete"];

    const summary = await fetchMagentoSummary({ from, to, statuses });

    return res.status(200).json(summary);
  } catch (error) {
    return next(error);
  }
}
