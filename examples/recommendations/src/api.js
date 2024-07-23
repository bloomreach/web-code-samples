import {
  account_id,
  auth_key,
  domain_key,
  similar_products_widget_id,
} from "./config";
import { productSearch, getItemWidget } from '@bloomreach/discovery-web-sdk';

const config = {
  account_id: account_id,
  auth_key: auth_key,
  domain_key: domain_key,
};

export const getDetails = (pid) => {
  const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);

  // See https://documentation.bloomreach.com/discovery/reference/product-search-category-api
  // for descriptions about the parameters used below
  const options = {
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
  };

  return productSearch(config, options);
};

export const getRecommendations = (pid) => {
  const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);

  // See https://documentation.bloomreach.com/discovery/reference/recs-pathways-parameters-reference
  // for descriptions about the parameters used below
  const options = {
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
  };

  return getItemWidget(similar_products_widget_id, config, options);
};
