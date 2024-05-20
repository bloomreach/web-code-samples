import { account_id, auth_key, catalog_views, domain_key } from './config';
import { initialize, autoSuggest } from '@bloomreach/discovery-web-sdk';

initialize({
  account_id: account_id,
  auth_key: auth_key,
  domain_key: domain_key,
});

export const getSuggestions = (query) => {
  const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);
  const searchOptions = {
    _br_uid_2: uid,
    catalog_views: catalog_views,
    url: 'https://example.com',
    ref_url: 'https://example.com',
    request_id: '12345',
    q: query,
  };

  return autoSuggest(searchOptions);
};