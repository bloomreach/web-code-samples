import { account_id, auth_key, catalog_views, domain_key } from "./config";
import { AutosuggestOptions, autoSuggest, Configuration } from "@bloomreach/discovery-web-sdk";

const config: Configuration = {
  account_id: account_id,
  auth_key: auth_key,
  domain_key: domain_key,
};

export const getSuggestions = (query: string) => {
  const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);
  // See https://documentation.bloomreach.com/discovery/reference/get-product-suggestions
  // for descriptions about the parameters used below
  const searchOptions: AutosuggestOptions = {
    _br_uid_2: uid,
    catalog_views: catalog_views,
    url: "https://example.com",
    ref_url: "https://example.com",
    request_id: 12345,
    q: query,
  };

  return autoSuggest(config, searchOptions);
};
