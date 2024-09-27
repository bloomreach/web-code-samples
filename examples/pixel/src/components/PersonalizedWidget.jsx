import { useEffect, useState } from 'react';
import useAnalytics from '../hooks/useAnalytics';
import usePersonalizedWidgetApi from '../hooks/usePersonalizedWidgetApi';
import { ProductsCarouselWidget } from './ProductsCarouselWidget';
import { CONFIG } from '../constants';

export function PersonalizedWidget({ widgetId, title = 'Recently viewed products' }) {
  const { trackEvent } = useAnalytics();
  const [options] = useState({ rows: 4, start: 0 });
  const { data } = usePersonalizedWidgetApi(widgetId, CONFIG, options);

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
