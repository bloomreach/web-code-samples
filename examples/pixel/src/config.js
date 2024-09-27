export const account_id = '7634';
export const auth_key = 'zjlc0tsp2xu7l7ro';
export const domain_key = 'showcase_pacifichome';
export const account_name = 'showcase-pacifichome.bloomreach.io';
export const catalog_views = 'showcase_pacifichome';

// Setting this to true sets the pixel to debug mode, so the events will not be used as learning data for Bloomreach's
// algorithms and you can see the pixels in real time on Event Management
export const debugPixel = false;

// Comment the lines below, if any of the widgets do not exist in your account
export const similar_products_widget_id = '09zwz059';
export const recently_viewed_widget_id = '2l7eo489';

export const product_fields = [
  'pid', 'score', 'is_live', 'title', 'description', 'brand',
  'price', 'price_range', 'sale_price', 'sale_price_range', 'url', 'promotions', 'thumb_image',
  'skuid', 'sku_color', 'sku_size', 'sku_thumb_images', 'sku_swatch_images', 'sku_price',
  'sku_sale_price', 'onSale', 'inStock',
].join(',');

// See https://documentation.bloomreach.com/discovery/docs/pixel-reference#currency for valid values
export const currency = 'USD';
