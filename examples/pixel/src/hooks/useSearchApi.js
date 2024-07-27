import { useState, useEffect } from "react";
import {useCookies} from "react-cookie";
import { productSearch, categorySearch, bestseller } from "@bloomreach/discovery-web-sdk";
import { product_fields } from "../config";
import { BR_COOKIE } from "../constants";

function useSearchApi(searchType = 'keyword', config, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cookies] = useCookies([BR_COOKIE]);

  useEffect(() => {
    if (!options.q) {
      return;
    }

    const opts = {
      ...{
        _br_uid_2: cookies[BR_COOKIE],
        url: window.location.href,
        ref_url: window.location.href,
        request_id: Date.now(),
        br_diagnostic: 'all',
        fl: product_fields,
      },
      ...options
    }

    const fetchData = async () => {
      setLoading(true);
      let res

      if (searchType === 'category') {
        res = await categorySearch(config, opts);
      } else if (searchType === 'bestseller') {
        res = await bestseller(config, opts);
      } else {
        res = await productSearch(config, opts);
      }
      setData(res);
      setError(null);
    }

    fetchData()
      .catch((e) => {
        setError(e);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchType, config, options, cookies])

  return { data, loading, error };
}
export default useSearchApi;
