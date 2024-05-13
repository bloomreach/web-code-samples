import axios from "axios";
import { account_id, auth_key, catalog_views, domain_key } from "./config";

export const getSuggestions = (query) => {
  return axios.get(constructSuggestUrl(query)).then((response) => {
    return response.data;
  });
};

const constructSuggestUrl = (query) => {
  const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);

  const params = new URLSearchParams({
    _br_uid_2: uid,
    account_id: account_id,
    auth_key: auth_key,
    domain_key: domain_key,
    catalog_views: catalog_views,
    request_type: "suggest",
    url: "https://example.com",
    ref_url: "https://example.com",
    request_id: "12345",
    q: query,
  });

  return `https://suggest.dxpapi.com/api/v2/suggest/?${params.toString()}`;
};
