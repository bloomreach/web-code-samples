'use client';

import { useEffect, useState } from 'react';
import JsonView from '@uiw/react-json-view';
import { Button } from '@bloomreach/react-banana-ui';
import { useIntersectionObserver } from 'usehooks-ts';
import { Price } from '../../../components/Price';
import useCart from '../../../hooks/useCart';
import useAnalytics from '../../../hooks/useAnalytics';
import { useDeveloperTools } from '../../../hooks/useDeveloperTools';
import { ProductsCarouselWidget } from '../../../components/ProductsCarouselWidget';
import useSearchApi from '../../../hooks/useSearchApi';
import useRecommendationsApi from '../../../hooks/useRecommendationsApi';
import { similar_products_widget_id } from '../../../config';
import { CONFIG } from '../../../constants';

export default function Page({ params }) {
  const { id: pid } = params;
  const { showJson } = useDeveloperTools();
  const { addItem } = useCart();
  const { trackEvent } = useAnalytics();
  const [options, setOptions] = useState({});
  const [recOptions, setRecOptions] = useState({});
  const { loading, error, data } = useSearchApi('keyword', CONFIG, options);
  const { data: similarProducts } = useRecommendationsApi(similar_products_widget_id, CONFIG, recOptions);
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
      setRecOptions({
        item_ids: pid,
        filter: `-pid:("${pid}")`,
        rows: 4,
        start: 0,
      });
    }
  }, [pid]);

  const product = data?.response?.docs[0];
  const sku = product?.variants.length ? product.variants[0].skuid : undefined;

  useEffect(() => {
    if (!product) {
      return;
    }
    trackEvent({
      event: 'view_product',
      pid: product.pid,
      title: product.title,
      sku,
    });
  }, [product, sku]);

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
              <div className="flex flex-row gap-4">
                <div
                  className="w-128 gap-4 shadow-md rounded-md border border-slate-100 overflow-hidden"
                >
                  <img
                    src={product.thumb_image}
                    alt=""
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-2 w-96">
                  <h2 className="text-xl font-bold">{product.title}</h2>
                  {product.variants?.length > 1 ? (
                    <p className="opacity-50">
                      {product.variants.length}
                      {' '}
                      variants
                    </p>
                  ) : null}
                  <Price product={product} />
                  <p className="text-sm">{product.description}</p>
                  <Button type="primary" onClick={() => addToCart(product)}>Add to cart</Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
      <div className="w-full" ref={ref}>
        {isIntersecting && similarProducts && (<ProductsCarouselWidget data={similarProducts} />)}
      </div>
    </div>
  );
}
