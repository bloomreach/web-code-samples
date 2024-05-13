import axios from "axios";
import { account_id, auth_key, domain_key } from "./config";

export const getCategories = () => {
  return axios.get(constructApiUrl("*")).then((response) => {
    const data = response.data;
    const categoryFacets = data?.facet_counts?.facets.find(
      (facet) => facet.name === "category",
    );
    if (!categoryFacets) {
      return [];
    }
    return categoryFacets.value;
  });
};

export const getByCategory = (category) => {
  return axios.get(constructApiUrl(category, "category")).then((response) => {
    return response.data;
  });
};

const constructApiUrl = (query, search_type = "keyword") => {
  const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);

  const params = new URLSearchParams({
    _br_uid_2: uid,
    account_id: account_id,
    auth_key: auth_key,
    domain_key: domain_key,
    search_type: search_type,
    request_type: "search",
    url: "https://example.com",
    ref_url: "https://example.com",
    request_id: "12345",
    "facet.version": "3.0",
    q: query,
    start: 0,
    rows: 24,
    "stats.field": "sale_price",
    br_diagnostic: "all",
    fl: "pid,score,is_live,title,description,brand,price,price_range,sale_price,sale_price_range,url,promotions,thumb_image,skuid,sku_color,sku_size,sku_thumb_images,sku_swatch_images,sku_price,sku_sale_price,onSale,inStock",
  });

  return `https://core.dxpapi.com/api/v1/core/?${params.toString()}`;
};
