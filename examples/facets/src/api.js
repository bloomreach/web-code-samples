import { account_id, auth_key, domain_key } from "./config";
import { productSearch } from '@bloomreach/discovery-web-sdk';

const config = {
  account_id,
  auth_key,
  domain_key,
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

export const getSearchResults = (
  query,
  page,
  perPage,
  sort,
  selectedFacets,
) => {
  const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);

  const params = {
    _br_uid_2: uid,
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
    fq: Object.keys(selectedFacets).map(key => `${key}:${formatFilterQuery(selectedFacets[key])}`),
    fl: "pid,score,is_live,title,description,brand,price,price_range,sale_price,sale_price_range,url,promotions,thumb_image,skuid,sku_color,sku_size,sku_thumb_images,sku_swatch_images,sku_price,sku_sale_price,onSale,inStock",
  };

  return productSearch(config, params);
};
