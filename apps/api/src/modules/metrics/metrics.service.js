import { fetchMagentoSummary } from "../../services/magentoSummaryService.js";

export async function getSummary({ from, to }) {

  const statuses = ["pending", "processing", "complete"];

  const summary = await fetchMagentoSummary({
    from,
    to,
    statuses,
  });

  return summary;
}
