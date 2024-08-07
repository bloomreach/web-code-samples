import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JsonView from "@uiw/react-json-view";
import {
  ToggleField,
  LoaderIcon,
} from "@bloomreach/react-banana-ui";
import "@bloomreach/react-banana-ui/style.css";

import { getByCategory, getCategories } from "./api";
import { Price } from "./components/price";

import "./app.css";
import { Footer } from "./Footer";
import { Nav } from "./components/nav";
import { buildCategoryHierarchy, getActiveCategories } from "./utils";
import { Breadcrumbs } from "./components/breadcrumbs";
import BrLogo from "./assets/br-logo-primary.svg";
import { account_id, account_name } from "./config";

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [categoryHierarchy, setCategoryHierarchy] = useState([]);
  const [showJson, setShowJson] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  const queryParams = new URLSearchParams(searchParams);
  const categoryId = queryParams.get("cat");
  const activeCategories = getActiveCategories(categories, categoryId);

  function setActiveCategory(id) {
    setSearchParams(new URLSearchParams({ cat: id }));
  }

  // On initial load, get the categories
  useEffect(() => {
    getCategories().then((categoryFacets) => {
      const hierarchy = buildCategoryHierarchy(categoryFacets);
      setCategories(categoryFacets);
      setCategoryHierarchy(hierarchy);

      const queryParams = new URLSearchParams(searchParams);
      // and set a random category to fetch the products from
      if (!queryParams.get("cat")) {
        const randomCategory =
          hierarchy[Math.floor(Math.random() * hierarchy.length)];
        const randomCatId = randomCategory.cat_id;
        setActiveCategory(randomCatId);
      }
    });
  }, []);

  useEffect(() => {
    if (categoryId) {
      getCategoryProducts(categoryId);
    }
  }, [categoryId]);

  function getCategoryProducts(category) {
    setLoading(true);
    setError(null);

    getByCategory(category)
      .then((response) => {
        setLoading(false);
        setData(response);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching results:", error);
        setData({});
        setError(error);
      });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#002840]">
        <div className="max-w-5xl mx-auto flex flex-row p-2 text-slate-300 text-xs items-center">
          <div className="grow">
            <span className="font-semibold">Account:</span> {account_name} (
            {account_id})
          </div>
          <ToggleField
            className="text-slate-300 toggle-field"
            label="Show JSON"
            inputProps={{id: "show-json-toggle"}}
            checked={showJson}
            onChange={() => setShowJson(!showJson)}
          />
        </div>
      </div>
      <div className="app p-2 max-w-5xl w-full mx-auto grow">
        <div className="flex gap-2 items-center mt-4 mb-8">
          <div className="flex gap-2 items-center grow">
            <a href="https://bloomreach.com" target="_blank">
              <img src={BrLogo} width={150} />
            </a>
            <span>✨</span>
            <div className="text-lg font-semibold text-[#002840]">
              Categories
              {loading && <LoaderIcon className="animate-spin" />}
            </div>
          </div>
        </div>

        <div>
          {error && (
            <div>
              <h1 className="text-lg">Error: </h1>
              <JsonView value={error} />
            </div>
          )}
          {showJson ? (
            <JsonView value={data} collapsed={2} />
          ) : (
            <div className="my-2">
              <Breadcrumbs
                items={categories}
                active={activeCategories}
                onSelect={setActiveCategory}
              />
              <div className="flex gap-8 mt-2">
                <div className="w-96">
                  <Nav
                    items={categoryHierarchy}
                    active={activeCategories}
                    onSelect={setActiveCategory}
                  />
                </div>
                <div className="w-full">
                  {data?.response?.docs?.length ? (
                    <div className="flex flex-col">
                      <div className="flex flex-row flex-wrap gap-4">
                        {data?.response?.docs.map((product, index) => (
                          <div
                            className="m-2 w-48 shadow-md rounded-md border border-slate-100"
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
                                {product.variants?.length > 1 ? (
                                  <p className="text-sm opacity-50">
                                    {product.variants.length}
                                    {' '}
                                    variants
                                  </p>
                                ) : null}
                                <Price className="text-sm" product={product} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="m-2 text-xs text-slate-600">
                        Showing {data.response.docs.length} of{" "}
                        {data.response.numFound}
                      </div>
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
      <Footer />
    </div>
  );
}
