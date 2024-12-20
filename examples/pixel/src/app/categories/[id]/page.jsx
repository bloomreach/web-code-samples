'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import JsonView from '@uiw/react-json-view';
import { LoaderIcon } from '@bloomreach/react-banana-ui';
import { Pagination } from '@bloomreach/limitless-ui-react';
import { Breadcrumbs } from './breadcrumbs';
import { CategoryNav } from './category-nav';
import { ProductCard } from '../../../components/ProductCard';

import { buildCategoryHierarchy, getActiveCategories } from './utils';
import useAnalytics from '../../../hooks/useAnalytics';
import { useDeveloperTools } from '../../../hooks/useDeveloperTools';
import useSearchApi from '../../../hooks/useSearchApi';
import { CONFIG } from '../../../constants';

export default function Page({ params, searchParams }) {
  const { id: categoryId } = params;
  const { page = 0, rows = 24 } = searchParams;
  const router = useRouter();
  const pathname = usePathname();
  const { showJson } = useDeveloperTools();
  const { trackEvent } = useAnalytics();
  const [categories, setCategories] = useState([]);
  const [categoryHierarchy, setCategoryHierarchy] = useState([]);
  const [categoryProductsOptions, setCategoryProductsOptions] = useState({});
  const [categoriesListOptions] = useState({ q: '*' });

  const { loading, error, data } = useSearchApi('category', CONFIG, categoryProductsOptions);
  const { loading: cLoading, error: cError, data: cData } = useSearchApi('keyword', CONFIG, categoriesListOptions);

  const activeCategories = getActiveCategories(categories, categoryId);

  useEffect(() => {
    if (cData) {
      const categoryFacets = cData?.facet_counts?.facets.find(
        (facet) => facet.name === 'category',
      );
      if (!categoryFacets) {
        return;
      }

      const hierarchy = buildCategoryHierarchy(categoryFacets.value);
      setCategories(categoryFacets.value);
      setCategoryHierarchy(hierarchy);
    }
  }, [cData]);

  useEffect(() => {
    if (categoryId) {
      setCategoryProductsOptions({
        q: categoryId,
        rows,
        start: page * rows,
      });
    }
  }, [categoryId, rows, page]);

  useEffect(() => {
    if (categories.length > 0 && data) {
      trackEvent({
        event: 'view_category',
        cat_id: categoryId,
        cat_crumb: activeCategories.join('|'),
      });
    }
  }, [data, categories]);

  const updateQueryParams = useCallback(
    (obj) => {
      const qParams = new URLSearchParams(searchParams);

      Object.keys(obj).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          qParams.set(key, obj[key]);
        }
      });

      router.push(`${pathname}?${qParams.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div>
      <div>
        {showJson ? (
          <JsonView value={data} collapsed={2} />
        ) : (
          <div className="my-2">
            <Breadcrumbs
              items={categories}
              active={activeCategories}
            />
            <div className="flex gap-8 mt-2">
              <div className="w-96">
                {cLoading && (
                  <div className="flex flex-row gap-2">
                    <LoaderIcon className="animate-spin" />
                    {' '}
                    Loading...
                  </div>
                )}
                {cError && (
                  <div>
                    <h1 className="text-lg">Error: </h1>
                    <JsonView value={cError} />
                  </div>
                )}
                <CategoryNav
                  items={categoryHierarchy}
                  active={activeCategories}
                />
              </div>
              <div className="w-full">
                {loading && (
                  <div className="flex flex-row gap-2">
                    <LoaderIcon className="animate-spin" />
                    {' '}
                    Loading...
                  </div>
                )}
                {error && (
                  <div>
                    <h1 className="text-lg">Error: </h1>
                    <JsonView value={error} />
                  </div>
                )}
                {data?.response?.docs?.length ? (
                  <div className="flex flex-col">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {data?.response?.docs.map((product) => (
                        <ProductCard key={product.pid} className="flex" product={product} href={`/products/${product.pid}`} />
                      ))}
                    </div>
                    {data.response.numFound > 0 ? (
                      <div className="my-8">
                        <Pagination.Root
                          count={data.response.numFound}
                          itemsPerPage={parseInt(rows, 10)}
                          itemsPerPageOptions={[12, 24, 48]}
                          onItemsPerPageChange={(newPerPage) =>
                            updateQueryParams({ rows: newPerPage, page: 0 })
                          }
                          onPageChange={(newPage) =>
                            updateQueryParams({ page: newPage })
                          }
                          page={parseInt(page, 10)}
                        >
                          <Pagination.Overview>
                            <Pagination.ItemsPerPageSelector />
                            <Pagination.Summary />
                          </Pagination.Overview>
                          <Pagination.Navigation>
                            <Pagination.PreviousButton />
                            <Pagination.Pages />
                            <Pagination.NextButton />
                          </Pagination.Navigation>
                        </Pagination.Root>
                      </div>
                    ) : null}

                  </div>
                ) : (
                  <div className="text-sm text-slate-500">NA</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
