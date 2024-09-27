import { useEffect, useState } from 'react';
import useAnalytics from '../hooks/useAnalytics';
import useItemBasedRecommendationsApi from '../hooks/useItemBasedRecommendationsApi';
import { ProductsCarouselWidget } from './ProductsCarouselWidget';
import { CONFIG } from '../constants';

export function ItemBasedRecommendationsWidget({ title = 'Similar products', widgetId, pids }) {
  const { trackEvent } = useAnalytics();
  const [options, setOptions] = useState({});
  const { data } = useItemBasedRecommendationsApi(widgetId, CONFIG, options);

  useEffect(() => {
    if (pids && pids.length) {
      setOptions({
        item_ids: pids.join(','),
        filter: `-pid:(${pids.map((pid) => `"${pid}"`).join(' OR ')})`,
        rows: 4,
        start: 0,
      });
    }
  }, [pids]);

  useEffect(() => {
    if (!data?.metadata) {
      return;
    }

    trackEvent({
      event: 'event_widgetView',
      widgetId: data.metadata.widget.id,
      widgetType: data.metadata.widget.type,
      widgetRequestId: data.metadata.widget.rid,
    });
  }, [data]);


  if (!data?.response) {
    return null;
  }

  return (
    <div>
      <div className="flex gap-2 my-2 items-center">
        <div className="font-semibold text-xl opacity-80">{title}</div>
      </div>
      {data && (<ProductsCarouselWidget data={data} />)}
    </div>
  );
}
