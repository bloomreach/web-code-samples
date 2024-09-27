'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import JsonView from '@uiw/react-json-view';
import { useIntersectionObserver } from 'usehooks-ts';
import { ProductCard } from '../components/ProductCard';
import { useDeveloperTools } from '../hooks/useDeveloperTools';
import useSearchApi from '../hooks/useSearchApi';
import { PersonalizedWidget } from '../components/PersonalizedWidget';
import { recently_viewed_widget_id } from '../config';
import { CONFIG } from '../constants';

function getRandomCategories(data) {
  const categories = data.facet_counts.facets.filter((facet) => facet.name === 'category');
  if (!categories.length) {
    return [];
  }

  return categories[0].value
    .filter((cat) => cat.cat_name.split(' ').length === 1)
    .slice(0, 12);
}

export default function Home() {
  const { showJson } = useDeveloperTools();
  const [categories, setCategories] = useState([]);
  const [options] = useState({
    q: '*',
    rows: 12,
  });
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });
  const { loading, error, data } = useSearchApi('bestseller', CONFIG, options);

  useEffect(() => {
    if (data) {
      setCategories(getRandomCategories(data));
    }
  }, [data]);

  return (
    <div>
      {loading ? <div>Loading...</div> : (
        <>
          <div className="font-semibold text-xl my-4 mt-8 opacity-80">Shop by category</div>
          <div className="flex flex-col">
            {showJson ? (
              <JsonView value={categories} collapsed={1}/>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {categories.map((category) => (
                  <div key={category.cat_id} className="flex">
                    <Link
                      href={`/categories/${category.cat_id}`}
                      className="w-full rounded-md border border-slate-200 bg-gray-50 hover:bg-cyan-50"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="p-3">
                          <div
                            className="w-full text-sm font-bold"
                          >
                            {category.cat_name}
                            {' '}
                            (
                            {category.count}
                            )
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="font-semibold mt-8 text-xl opacity-80">Shop our best sellers</div>
          {error && (
            <div>
              <h1 className="text-lg">Error: </h1>
              <JsonView value={error} />
            </div>
          )}
          <div className="flex gap-4 mt-4">
            {showJson ? (
              <div>{data ? <JsonView value={data} collapsed={1} /> : null}</div>
            ) : (
              <div className="w-full">
                {!loading && data?.response?.docs?.length ? (
                  <div className="flex flex-col">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {data?.response?.docs.map((product) => (
                        <ProductCard key={product.pid} className="flex" product={product} href={`/products/${product.pid}`} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">NA</div>
                )}
              </div>
            )}
          </div>

          <div className="w-full mt-8" ref={ref}>
            {isIntersecting && (<PersonalizedWidget widgetId={recently_viewed_widget_id}/>)}
          </div>
        </>
      )}
    </div>
  );
}
