"use client";

import {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import JsonView from "@uiw/react-json-view";
import {LoaderIcon, Pagination} from "@bloomreach/react-banana-ui";
import { Breadcrumbs } from "./breadcrumbs";
import { CategoryNav } from "./category-nav";
import { Price } from "../../../components/Price";

import { buildCategoryHierarchy, getActiveCategories } from "./utils";
import useDataLayer from "../../../hooks/useDataLayer";
import {useDebugTools} from "../../../hooks/useDebugTools";
import useSearchApi from "../../../hooks/useSearchApi";
import {config} from "../../../utils";

export default function Page({ params, searchParams }) {
  const { id: categoryId } = params;
  const { page= 0, rows = 24 } = searchParams;
  const router = useRouter();
  const pathname = usePathname();
  const {showJson} = useDebugTools();
  const dataLayer = useDataLayer();
  const [categories, setCategories] = useState([]);
  const [categoryHierarchy, setCategoryHierarchy] = useState([]);
  const [categoryProductsOptions, setCategoryProductsOptions] = useState({});
  const [categoriesListOptions] = useState({q: '*'});

  const {loading, error, data} = useSearchApi('category', config, categoryProductsOptions);
  const {loading: cLoading, error: cError, data: cData} = useSearchApi('keyword', config, categoriesListOptions);

  const activeCategories = getActiveCategories(categories, categoryId);

  useEffect(() => {
    if (cData) {
      const categoryFacets = cData?.facet_counts?.facets.find(
        (facet) => facet.name === 'category'
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
        rows: rows,
        start: page * rows
      });
    }
  }, [categoryId, rows, page]);

  useEffect(() => {
    if (categories.length > 0 && data) {
      dataLayer.push({
        event: 'view_category',
        cat_id: categoryId,
        cat_crumb: activeCategories.join('|'),
      });
    }
  }, [data, categories]);

  const updateQueryParams = useCallback(
    (obj) => {
      const params = new URLSearchParams(searchParams);

      Object.keys(obj).forEach(key => {
        if (obj.hasOwnProperty(key)) {
          params.set(key, obj[key]);
        }
      })

      router.push(pathname + '?' + params.toString());
    },
    [router, pathname, searchParams]
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
                    <LoaderIcon className="animate-spin" /> Loading...
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
                    <LoaderIcon className="animate-spin" /> Loading...
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
                    <div className="flex flex-row flex-wrap gap-4">
                      {data?.response?.docs.map((product, index) => (
                        <Link
                          className="m-2 w-48 shadow-md rounded-md border border-slate-100"
                          href={`/products/${product.pid}`}
                          key={index}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="w-full rounded-t-md overflow-hidden border-b border-slate-200 ">
                              <img
                                src={product.thumb_image}
                                className="mr-2 w-full"
                              />
                            </div>
                            <div className="p-2 pt-0 flex flex-col gap-2">
                              <div className="w-full text-sm font-bold">
                                {product.title}
                              </div>
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
                          itemsPerPage={parseInt(rows)}
                          itemsPerPageOptions={[12, 24, 48]}
                          onItemsPerPageChange={(newPerPage) =>
                            updateQueryParams({rows: newPerPage, page: 0})
                          }
                          onPageChange={(newPage) => updateQueryParams({page: newPage})}
                          page={parseInt(page)}
                        />
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
