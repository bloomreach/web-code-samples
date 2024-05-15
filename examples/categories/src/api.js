import { account_id, auth_key, domain_key } from './config';

import { initialize, categorySearch, productSearch } from '@bloomreach/discovery-web-sdk';

initialize({
  account_id: account_id,
  auth_key: auth_key,
  domain_key: domain_key,
});

const callAPI = async (query, searchType = 'keyword') => {
  const options = {
    _br_uid_2: `uid=12345:v=11.8:ts=${Date.now()}:hc=3`,
    url: 'https://example.com',
    ref_url: 'https://example.com',
    request_id: '12345',
    q: query,
    rows: 24,
    'stats.field': 'sale_price',
    br_diagnostic: 'all',
    fl: 'pid,score,is_live,title,description,brand,price,price_range,sale_price,sale_price_range,url,promotions,thumb_image,skuid,sku_color,sku_size,sku_thumb_images,sku_swatch_images,sku_price,sku_sale_price,onSale,inStock',
  };


  if (searchType === 'keyword') {
    return productSearch(options);
  } else {
    return categorySearch(options);
  }
};

export const getCategories = async () => {
  const response = await callAPI('*');

  const categoryFacets = response?.facet_counts?.facets.find(
    (facet) => facet.name === 'category'
  );
  if (!categoryFacets) {
    return [];
  }
  return categoryFacets.value;
};

export const getByCategory = (category) => {
  return callAPI(category, 'category');
};
