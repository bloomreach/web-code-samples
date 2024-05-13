import {
    account_id,
    auth_key,
    domain_key,
} from "./config";

import { initialize, searchProducts } from '@bloomreach/discovery-web-sdk';

const config = {
  productSearchEndpoint: 'https://core.dxpapi.com/api/v1/core/',
  account_id,
  auth_key,
  domain_key,
};

// initialize the Discovery SDK 
initialize(config);

export const getSearchResults = (query, page, perPage, sort) => {
  // call API using SDK
  return searchProducts({
        url: 'https://example.com',
        ref_url: 'https://example.com',
        request_id: '12345',
        'facet.version': '3.0',
        q: query,
        start: page * perPage,
        rows: perPage,
        sort: sort,
        'stats.field': 'sale_price',
        'query.numeric_precision': 'standard',
        br_diagnostic: 'all',
        fl: 'pid,score,is_live,title,description,brand,price,price_range,sale_price,sale_price_range,url,promotions,thumb_image,skuid,sku_color,sku_size,sku_thumb_images,sku_swatch_images,sku_price,sku_sale_price,onSale,inStock'
  });
};
