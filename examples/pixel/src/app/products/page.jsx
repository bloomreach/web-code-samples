'use client';

import { useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Highlighter from 'react-highlight-words';
import JsonView from '@uiw/react-json-view';
import { Pagination } from '@bloomreach/react-banana-ui';
import { Price } from '../../components/Price';
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
          <div className="w-full">
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
              <div className="flex flex-col">
                <div className="flex flex-row flex-wrap">
                  {data?.response?.docs.map((product) => (
                    <Link
                      href={`/products/${product.pid}`}
                      className="m-2 w-56 shadow-md rounded-md border border-slate-100"
                      key={product.pid}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="w-full max-h-56 rounded-t-md overflow-hidden border-b border-slate-200 ">
                          <img
                            src={product.thumb_image}
                            alt={product.title}
                            className="mr-2 w-full object-cover object-top"
                          />
                        </div>
                        <div className="p-2 pt-0">
                          <Highlighter
                            highlightClassName="bg-[#ffd500] rounded"
                            className="w-full text-sm font-bold"
                            searchWords={[searchedQuery]}
                            textToHighlight={product.title}
                          />
                          {product.variants?.length > 1 ? (
                            <p className="text-sm opacity-50 mb-1">
                              {product.variants.length}
                              {' '}
                              variants
                            </p>
                          ) : null}
                          <Price className="text-sm" product={product} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {data.response.numFound > 0 ? (
                  <div className="my-8">
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
