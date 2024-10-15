'use client';

import { useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import JsonView from '@uiw/react-json-view';
import { Pagination } from '@bloomreach/react-banana-ui';
import { ProductCard } from '../../components/ProductCard';
import useAnalytics from '../../hooks/useAnalytics';
import { useDeveloperTools } from '../../hooks/useDeveloperTools';
import useSearchApi from '../../hooks/useSearchApi';
import { CONFIG } from '../../constants';

export default function Page({ searchParams }) {
  const { showJson } = useDeveloperTools();
  const router = useRouter();
  const { q = '', sort = '', page = 0, rows = 12 } = searchParams;
  const { trackEvent } = useAnalytics();
  const [options, setOptions] = useState({});

  const { loading, error, data } = useSearchApi('keyword', CONFIG, options);

  useEffect(() => {
    setOptions({
      q: q || '',
      rows,
      start: page * rows,
      sort,
      'stats.field': 'sale_price',
      'query.numeric_precision': 'standard',
    });
  }, [q, page, rows, sort]);

  useEffect(() => {
    if (!data) {
      return;
    }
    trackEvent({
      event: 'view_search',
      query: q,
    });
  }, [data]);

  const updateQueryParams = useCallback(
    (obj) => {
      const params = new URLSearchParams(searchParams);

      Object.keys(obj).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          params.set(key, obj[key]);
        }
      });

      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams],
  );

  const searchedQuery = data?.autoCorrectQuery || q;

  return (
    <div>
      {loading && <div className="p-4 text-center text-xl opacity-50">Loading...</div>}
      {error && (
      <div>
        <h1 className="text-lg">Error: </h1>
        <JsonView value={error} />
      </div>
      )}
      <div className="flex gap-4 mt-4">
        {showJson ? (
          <JsonView value={data} collapsed={1} />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex">
              <div className="grow text-sm my-2">
                Search results for
                {' '}
                <span className="font-semibold">{searchedQuery}</span>
                {data?.autoCorrectQuery ? (
                  <span> (autocorrected)</span>
                ) : null}
                {data?.did_you_mean?.length ? (
                  <div className="my-2">
                    Did you mean:
                    {' '}
                    {data?.did_you_mean.map((term) => (
                      <Link
                        key={term}
                        className="cursor-pointer px-2 mr-2 bg-blue-100 text-blue-600 hover:underline"
                        href={`/products?q=${term}`}
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              <div>
                <select
                  className="p-2 rounded border text-sm"
                  value={sort}
                  onChange={(e) => updateQueryParams({ sort: e.target.value || '', page: 0 })}
                >
                  <option value="">Relevance</option>
                  <option value="price asc">Price (low to high)</option>
                  <option value="price desc">Price (high to low)</option>
                  <option value="sale_price asc">
                    Sale Price (low to high)
                  </option>
                  <option value="sale_price desc">
                    Sale Price (high to low)
                  </option>
                </select>
              </div>
            </div>

            {data?.response?.docs?.length ? (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {data?.response?.docs.map((product) => (
                    <div key={product.pid} className="flex">
                      <ProductCard product={product} highlight={searchedQuery} href={`/products/${product.pid}`} />
                    </div>
                  ))}
                </div>
                {data.response.numFound > 0 ? (
                  <div>
                    <Pagination
                      count={data.response.numFound}
                      itemsPerPage={parseInt(rows, 10)}
                      itemsPerPageOptions={[12, 24, 48]}
                      onItemsPerPageChange={(newPerPage) => updateQueryParams({ rows: newPerPage, page: 0 })}
                      onPageChange={(newPage) => updateQueryParams({ page: newPage })}
                      page={parseInt(page, 10)}
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-sm text-slate-500">NA</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
