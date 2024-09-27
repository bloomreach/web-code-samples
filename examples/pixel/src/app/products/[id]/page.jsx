'use client';

import { useEffect, useMemo, useState } from 'react';
import JsonView from '@uiw/react-json-view';
import { Button } from '@bloomreach/react-banana-ui';
import { useIntersectionObserver } from 'usehooks-ts';
import { Price } from '../../../components/Price';
import useCart from '../../../hooks/useCart';
import useAnalytics from '../../../hooks/useAnalytics';
import { useDeveloperTools } from '../../../hooks/useDeveloperTools';
import { ItemBasedRecommendationsWidget } from '../../../components/ItemBasedRecommendationsWidget';
import useSearchApi from '../../../hooks/useSearchApi';
import { similar_products_widget_id } from '../../../config';
import { CONFIG } from '../../../constants';

export default function Page({ params }) {
  const { id: pid } = params;
  const { showJson } = useDeveloperTools();
  const { addItem } = useCart();
  const { trackEvent } = useAnalytics();
  const [options, setOptions] = useState({});
  const [recPids, setRecPids] = useState([]);
  const { loading, error, data } = useSearchApi('keyword', CONFIG, options);
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  useEffect(() => {
    if (pid) {
      setOptions({
        q: '*',
        rows: 1,
        fq: `pid:"${pid}"`,
      });

      setRecPids([pid]);
    }
  }, [pid]);

  const product = useMemo(() => data?.response?.docs[0], [data]);
  const sku = useMemo(() => product && product.variants.length ? product.variants[0].skuid : undefined, [product]);
  const title = useMemo(() => product ? product.title : undefined, [product]);

  useEffect(() => {
    if (!pid || !title) {
      return;
    }
    trackEvent({
      event: 'view_product',
      pid,
      title,
      sku,
    });
  }, [pid, sku]);

  const addToCart = (item) => {
    addItem({
      id: item.pid,
      sku,
      image: item.thumb_image,
      title: item.title,
      subtitle: '',
      price: item.salePrice || item.price,
    });
    trackEvent({
      event: 'event_addToCart',
      pid: item.pid,
      sku,
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      {loading && <div className="p-4 text-center text-xl opacity-50">Loading...</div>}
      {error && (
        <div>
          <h1 className="text-lg">Error: </h1>
          <JsonView value={error} />
        </div>
      )}
      <div className="w-full">
        {showJson ? (
          <JsonView value={data} collapsed={1} />
        ) : (
          <div>
            {product ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <div
                  className="gap-4 shadow-md rounded-md border border-slate-100 overflow-hidden sm:w-1/2"
                >
                  <img
                    src={product.thumb_image}
                    alt=""
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:w-1/2">
                  <h2 className="text-xl font-bold">{product.title}</h2>
                  <p className="text-sm">{product.description}</p>
                  {product.variants?.length > 1 ? (
                    <p className="opacity-50">
                      {product.variants.length}
                      {' '}
                      variants
                    </p>
                  ) : null}
                  <Price className="font-semibold" product={product} />
                  <div className="flex flex-col sm:flex-row">
                    <Button type="primary" onClick={() => addToCart(product)}>Add to cart</Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
      <div className="w-full" ref={ref}>
        {isIntersecting && (<ItemBasedRecommendationsWidget widgetId={similar_products_widget_id} pids={recPids} />)}
      </div>
    </div>
  );
}
