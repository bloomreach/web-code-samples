import {
    account_id,
    auth_key,
} from "./config";

import { bestseller } from '@bloomreach/discovery-web-sdk';

export const getSearchResults = (query, domainKey) => {
  const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);
  // See https://documentation.bloomreach.com/discovery/reference/product-search-category-api
  // for descriptions about the parameters used below
  const config = {
    account_id,
    auth_key,
    domain_key: domainKey,
  };

  // Call API using SDK
  return bestseller(config, {
        _br_uid_2: uid,
        url: 'https://example.com',
        ref_url: 'https://example.com',
        request_id: '12345',
        q: query,
        rows: 24,
        'stats.field': 'sale_price',
        'query.numeric_precision': 'standard',
        br_diagnostic: 'all',
        fl: 'pid,score,is_live,title,description,brand,price,price_range,sale_price,sale_price_range,url,promotions,thumb_image,skuid,sku_color,sku_size,sku_thumb_images,sku_swatch_images,sku_price,sku_sale_price,onSale,inStock'
  });
};
