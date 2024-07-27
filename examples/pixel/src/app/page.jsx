"use client";
import {useEffect, useState} from "react";
import Link from 'next/link'
import { Price } from "../components/Price";
import JsonView from "@uiw/react-json-view";
import {useDebugTools} from "../hooks/useDebugTools";
import useSearchApi from "../hooks/useSearchApi";
import { config } from '../utils'

export default function Home() {
  const {showJson} = useDebugTools();
  const [categories, setCategories] = useState([]);
  const [options] = useState({
    q: '*',
    rows: 12
  });
  const { loading, error, data } = useSearchApi('bestseller', config, options)

  useEffect(() => {
    if (data) {
      setCategories(getRandomCategories(data));
    }
  }, [data])

  return (
    <div>
      {loading ? <div>Loading...</div> : (
        <>
          <div className="font-medium my-4 mt-8 uppercase opacity-50">Shop by category</div>
          <div className="flex flex-col">
            {showJson ? (
              <JsonView value={categories} collapsed={1}/>
            ) : (
              <div className="flex flex-row flex-wrap gap-4">
                {categories.map((category) => (
                  <Link
                    href={`/categories/${category.cat_id}`}
                    className="w-56 rounded-md border border-slate-200 bg-yellow-50 hover:bg-yellow-100"
                    key={category.cat_id}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="p-3">
                        <div
                          className="w-full text-sm font-bold"
                        >
                          {category.cat_name} ({category.count})
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="font-medium mt-8 uppercase opacity-50">Shop our best sellers</div>
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
                {!loading && data?.response?.docs?.length ? (
                  <div className="flex flex-col">
                    <div className="flex flex-row flex-wrap">
                      {data?.response?.docs.map((product, index) => (
                        <Link
                          href={`/products/${product.pid}`}
                          className="m-2 w-56 shadow-md rounded-md border border-slate-100"
                          key={index}
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
                              <div
                                className="w-full text-sm"
                              >
                                <div className="font-bold">{product.title}</div>
                                <Price className="text-sm" product={product} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">NA</div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function getRandomCategories(data) {
  const categories = data.facet_counts.facets.filter(facet => facet.name === 'category');
  if (!categories.length) {
    return [];
  }

  return categories[0].value
    .filter(cat => cat.cat_name.split(' ').length === 1)
    .slice(0, 12);
}


