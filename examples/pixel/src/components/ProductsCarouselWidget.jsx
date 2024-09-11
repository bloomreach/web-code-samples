import { useEffect } from 'react';
import { InfoIcon, Tooltip } from '@bloomreach/react-banana-ui';
import JsonView from '@uiw/react-json-view';
import { ProductCard } from './ProductCard';
import useAnalytics from '../hooks/useAnalytics';
import { useDeveloperTools } from '../hooks/useDeveloperTools';

export function ProductsCarouselWidget({ title = 'Similar products', data }) {
  const { showJson } = useDeveloperTools();
  const { trackEvent } = useAnalytics();

  function sendClickEvent(id) {
    trackEvent({
      event: 'event_widgetClick',
      widgetId: data.metadata.widget.id,
      widgetType: data.metadata.widget.type,
      widgetRequestId: data.metadata.widget.rid,
      itemId: id,
    });
  }

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
        <div className="text-md font-semibold">{title}</div>
        <div>
          <Tooltip title="This widget shows products similar to the product above">
            <InfoIcon className="text-slate-500" />
          </Tooltip>
        </div>
      </div>
      {showJson ? (
        <JsonView value={data} collapsed={1} />
      ) : (
        <div>
          {data?.response ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {data.response.docs.map((doc) => (
                <ProductCard key={doc.pid} product={doc} href={`/products/${doc.pid}`} onClick={() => sendClickEvent(doc.pid)} />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
