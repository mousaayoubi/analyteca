import { magentoGet } from "./magento.client.js";

/**
 * Fetch ALL Magento orders within [fromIso, toIso] inclusive.
 * Uses created_at gteq/lteq and paginates until all items are fetched.
 *
 * fromIso/toIso: yyyy-mm-dd
 */
export async function fetchOrdersByCreatedAt({ fromIso, toIso, pageSize = 100 }) {
  const fromTs = `${fromIso} 00:00:00`;
  const toTs = `${toIso} 23:59:59`;

  let currentPage = 1;
  const all = [];

  while (true) {
    const data = await magentoGet("/rest/V1/orders", {
      "searchCriteria[currentPage]": currentPage,
      "searchCriteria[pageSize]": pageSize,

      // created_at >= fromTs
      "searchCriteria[filterGroups][0][filters][0][field]": "created_at",
      "searchCriteria[filterGroups][0][filters][0][value]": fromTs,
      "searchCriteria[filterGroups][0][filters][0][conditionType]": "gteq",

      // created_at <= toTs
      "searchCriteria[filterGroups][0][filters][1][field]": "created_at",
      "searchCriteria[filterGroups][0][filters][1][value]": toTs,
      "searchCriteria[filterGroups][0][filters][1][conditionType]": "lteq",
    });

    const items = data?.items || [];
    all.push(...items);

    // stop if last page
    if (items.length < pageSize) break;

    currentPage += 1;
  }

  return all;
}
