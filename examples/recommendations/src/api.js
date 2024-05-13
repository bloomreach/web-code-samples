import axios from "axios";
import {
  account_id,
  auth_key,
  domain_key,
  similar_products_widget_id,
} from "./config";

export const getDetails = (pid) => {
  return axios.get(constructDetailsUrl(pid)).then((response) => {
    return response.data;
  });
};

export const getRecommendations = (pid) => {
  return axios.get(constructRecommendationsUrl(pid)).then((response) => {
    return response.data;
  });
};

export const constructDetailsUrl = (pid) => {
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
    fq: `pid:"${pid}"`,
    q: "*",
    rows: 1,
    br_diagnostic: "all",
    fl: "pid,title,price,sale_price,thumb_image,url,description,brand,images,var_inventoryQuantity,skuid,var_compareAtPrice,var_numericId,var_quantityAvailable,size,color,,skuid,color_id,sku_size,sku_color_group,sku_swatch_images,sku_color,sku_thumb_images",
  });

  return `https://core.dxpapi.com/api/v1/core/?${params.toString()}`;
};

export const constructRecommendationsUrl = (pid) => {
  const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);

  const params = new URLSearchParams({
    _br_uid_2: uid,
    account_id: account_id,
    auth_key: auth_key,
    domain_key: domain_key,
    item_ids: pid,
    fields: "pid,title,price,sale_price,description,thumb_image",
    filter: `-pid:${pid}`,
    url: "https://example.com",
    ref_url: "https://example.com",
    request_id: "12345",
    fq: `pid:"${pid}"`,
    rows: 4,
    start: 0,
    br_diagnostic: "all",
  });

  return `https://pathways.dxpapi.com/api/v2/widgets/item/${similar_products_widget_id}?${params.toString()}`;
};
