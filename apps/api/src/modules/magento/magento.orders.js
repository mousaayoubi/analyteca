import { magentoGet } from "./magento.client.js";

export async function fetchOrdersByCreatedAt({ fromIso, toIso, pageSize = 100 }) {
  const fromTs = `${fromIso} 00:00:00`;
  const toTs = `${toIso} 23:59:59`;

  let currentPage = 1;
  let totalCount = null;
  const all = [];

  while (true) {
    const data = await magentoGet("/rest/V1/orders", {
      "searchCriteria[currentPage]": currentPage,
      "searchCriteria[pageSize]": pageSize,

      "searchCriteria[filterGroups][0][filters][0][field]": "created_at",
      "searchCriteria[filterGroups][0][filters][0][value]": fromTs,
      "searchCriteria[filterGroups][0][filters][0][conditionType]": "from",

      "searchCriteria[filterGroups][0][filters][1][field]": "created_at",
      "searchCriteria[filterGroups][0][filters][1][value]": toTs,
      "searchCriteria[filterGroups][0][filters][1][conditionType]": "to",
    });

    const items = data.items || [];
    if (totalCount === null) totalCount = data.total_count ?? items.length;

    all.push(...items);

    const fetched = currentPage * pageSize;
    if (items.length === 0) break;
    if (fetched >= totalCount) break;

    currentPage += 1;
  }

  return all;
}
