import { useState, useEffect } from 'react';
import { getItemWidget } from '@bloomreach/discovery-web-sdk';
import { useCookies } from 'react-cookie';
import { BR_COOKIE } from '../constants';
import { product_fields } from '../config';

function useItemBasedRecommendationsApi(widgetId, config, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cookies] = useCookies([BR_COOKIE]);

  useEffect(() => {
    if (!options.item_ids) {
      setLoading(false);
      setError(null);
      setData(null);
      return;
    }

    setLoading(true);
    getItemWidget(
      widgetId,
      config,
      {
        ...{
          _br_uid_2: cookies[BR_COOKIE],
          fields: product_fields,
          url: window.location.href,
          ref_url: window.location.href,
          request_id: Date.now(),
          br_diagnostic: 'all',
        },
        ...options,
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
  }, [widgetId, config, options, cookies]);

  return { data, loading, error };
}
export default useItemBasedRecommendationsApi;
