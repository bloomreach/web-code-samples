import { useEffect } from 'react';
import Link from 'next/link';
import { InfoIcon, Tooltip } from '@bloomreach/react-banana-ui';
import JsonView from '@uiw/react-json-view';
import { Price } from './Price';
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

  if (!data || !data.response) {
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
            <div className="flex flex-row gap-4">
              {data.response.docs.map((doc) => (
                <Link
                  className="m-2 w-48 shadow-md rounded-md border border-slate-100"
                  href={`/products/${doc.pid}`}
                  onClick={() => sendClickEvent(doc.pid)}
                  key={doc.pid}
                >
                  <div className="flex flex-col gap-2">
                    <div
                      className="w-full rounded-t-md overflow-hidden border-b border-slate-200 "
                    >
                      <img
                        src={doc.thumb_image}
                        alt={doc.title}
                        className="mr-2 w-full"
                      />
                    </div>
                    <div className="p-2 pt-0">
                      <h3 className="text-sm font-bold">{doc.title}</h3>
                      {doc.variants?.length > 1 ? (
                        <p className="text-sm opacity-50 mb-1">
                          {doc.variants.length}
                          {' '}
                          variants
                        </p>
                      ) : null}
                      <Price className="text-sm" product={doc} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
