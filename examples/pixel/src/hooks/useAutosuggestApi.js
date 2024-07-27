import { useState, useEffect } from 'react';
import { autoSuggest } from '@bloomreach/discovery-web-sdk';
import { useCookies } from 'react-cookie';
import { BR_COOKIE } from '../constants';

function useAutosuggestApi(config, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cookies] = useCookies([BR_COOKIE]);

  useEffect(() => {
    if (!options.q) {
      return;
    }

    setLoading(true);
    autoSuggest(
      config,
      {
        _br_uid_2: cookies[BR_COOKIE],
        url: window.location.href,
        ref_url: window.location.href,
        request_id: Date.now(),
        q: options.q,
      },
    ).then((res) => {
      setLoading(false);
      setError(null);
      setData(res);
    }, (err) => {
      setLoading(false);
      setError(err);
      setData(null);
    });
  }, [config, options, cookies]);

  return { data, loading, error };
}

export default useAutosuggestApi;
