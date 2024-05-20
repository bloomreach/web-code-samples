import axios from "axios";
import { account_id, auth_key, domain_key } from "./config";

export const getSearchResults = (
  query,
  page,
  perPage,
  sort,
  selectedFacets,
  facets,
) => {
  return axios
    .get(constructSearchUrl(query, page, perPage, sort, selectedFacets, facets))
    .then((response) => {
      return response.data;
    });
};

function formatFilterQuery(value) {
  if (Array.isArray(value)) {
    return value.map((v) => `"${escapeFilterQuery(v)}"`).join(" OR ");
  }

  return escapeFilterQuery(value);
}

function escapeFilterQuery(value) {
  return value.split('"').join('\\"');
}

const constructSearchUrl = (
  query,
  page,
  perPage,
  sort,
  selectedFacets,
  facets,
) => {
  const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);

  const params = new URLSearchParams({
    _br_uid_2: uid,
    account_id: account_id,
    auth_key: auth_key,
    domain_key: domain_key,
    search_type: "keyword",
    request_type: "search",
    url: "https://example.com",
    ref_url: "https://example.com",
    request_id: "12345",
    "facet.version": "3.0",
    q: query,
    start: page * perPage,
    rows: perPage,
    sort: sort,
    "stats.field": "sale_price",
    "query.numeric_precision": "standard",
    br_diagnostic: "all",
    fl: "pid,score,is_live,title,description,brand,price,price_range,sale_price,sale_price_range,url,promotions,thumb_image,skuid,sku_color,sku_size,sku_thumb_images,sku_swatch_images,sku_price,sku_sale_price,onSale,inStock",
  });

  Object.keys(selectedFacets).forEach((key) => {
    if (selectedFacets[key]) {
      params.append("fq", `${key}:${formatFilterQuery(selectedFacets[key])}`);
    }
  });

  return `https://core.dxpapi.com/api/v1/core/?${params.toString()}`;
};