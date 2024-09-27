import JsonView from '@uiw/react-json-view';
import { ProductCard } from './ProductCard';
import useAnalytics from '../hooks/useAnalytics';
import { useDeveloperTools } from '../hooks/useDeveloperTools';

export function ProductsCarouselWidget({ data }) {
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

  if (!data?.response) {
    return null;
  }

  return (
    <div>
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
