import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Highlighter from "react-highlight-words";
import JsonView from "@uiw/react-json-view";
import { Theme, ProductCard } from "@bloomreach/limitless-ui-react";
import {
  AccordionGroup,
  ToggleField,
  InputField,
  SearchIcon,
  LoaderIcon,
  ExternalLinkIcon,
} from "@bloomreach/react-banana-ui";
import { Pagination } from "@bloomreach/limitless-ui-react";

import { getSearchResults } from "./api";
import { Facet } from "./components/facet";
import { AppliedFacet } from "./components/applied-facet";
import { Footer } from "./Footer";
import { account_id, account_name } from "./config";
import BrLogo from "./assets/br-logo-primary.svg";

import "@bloomreach/react-banana-ui/style.css";
import "@bloomreach/limitless-ui-react/style.css";
import "./app.css";

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState(new URLSearchParams());
  const q = queryParams.get("q") || "";
  const sort = queryParams.get("sort") || "";
  const page = parseInt(queryParams.get("page") || 0);
  const perPage = parseInt(queryParams.get("perPage") || 12);

  const [searchedQuery, setSearchedQuery] = useState("");
  const [selectedFacets, setSelectedFacets] = useState({});
  const [activeFilters, setActiveFilters] = useState([]);

  const [showJson, setShowJson] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  // On initial load, if no query param is set, set `chair` as the default query
  useEffect(() => {
    const queryParams = new URLSearchParams(searchParams);
    if (!queryParams.get("q")) {
      setSearchParams(new URLSearchParams({ q: "chair" }));
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const queryParamFilters = getFiltersFromQueryParams(params)
    setQueryParams(params);
    setSelectedFacets(queryParamFilters);
    // Only set this on initial load if there are any selected
    // for URL updates later on when the user is applying filters, ignore this
    setActiveFilters((activeFilters) => {
      if (Object.keys(activeFilters).length === 0) {
        return Object.keys(queryParamFilters);
      }
      return activeFilters;
    })

  }, [setActiveFilters, searchParams]);

  const debouncedSearch = useMemo(() => _.debounce(search, 1000), []);

  useEffect(() => {
    if (q && q.length > 1) {
      debouncedSearch(
        q,
        page,
        perPage,
        sort,
        selectedFacets,
        data?.facet_counts,
      );
    } else {
      setData({});
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [q, page, perPage, sort, selectedFacets, debouncedSearch]);

  function search(query, page, perPage, sort, selectedFacets, facets) {
    setLoading(true);
    setError(null);

    getSearchResults(query, page, perPage, sort, selectedFacets)
      .then((response) => {
        setLoading(false);
        setData(response);
        setSearchedQuery(response.autoCorrectQuery || query);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching results:", error);
        setData({});
        setError(error);
      });
  }

  function updateQuery(newQuery) {
    setSearchParams(new URLSearchParams({ q: newQuery }));
  }

  function updateQueryParams(key, val) {
    const params = new URLSearchParams(searchParams);
    if (!val || (Array.isArray(val) && val.length === 0)) {
      params.delete(key);
    } else {
      if (Array.isArray(val)) {
        params.delete(key);
        val.forEach((v) => {
          params.append(key, v);
        });
      } else {
        params.set(key, val);
      }
    }
    setSearchParams(params);
  }

  function updateFilterQueryParams(key, val) {
    updateQueryParams(`f_${key}`, val);
  }

  function getFiltersFromQueryParams(params) {
    const ret = {};
    for (const key of params.keys()) {
      if (key.startsWith("f_")) {
        const filterKey = key.replace("f_", "");
        const filterValue = params.getAll(key);
        ret[filterKey] = filterValue;
      }
    }
    return ret;
  }

  function onFacetChange(facet, value) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      updateFilterQueryParams(facet, null);
    } else {
      updateFilterQueryParams(facet, value);
    }
  }

  function onFacetClear(facet, value) {
    if (selectedFacets[facet]) {
      const currentValue = selectedFacets[facet];
      if (currentValue.includes(value)) {
        const newValue = currentValue.filter((val) => val !== value);
        if (newValue.length === 0) {
          updateFilterQueryParams(facet, null);
        } else {
          updateFilterQueryParams(facet, newValue);
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#002840]">
        <div className="max-w-7xl mx-auto flex flex-row p-2 text-slate-300 text-xs items-center">
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
          <a
            href="https://github.com/bloomreach/web-code-samples/discussions/new"
            target="_blank"
            className="flex gap-2 items-center font-semibold bg-amber-300 text-slate-800 mx-2 px-2 rounded"
          >
            Feedback
            <ExternalLinkIcon size={10}/>
          </a>
        </div>
      </div>
      <div className="app p-2 max-w-7xl w-full mx-auto grow">
        <div className="flex gap-2 items-center mt-4 mb-8">
          <a
            href="https://bloomreach.com"
            target="_blank"
            className="flex gap-2 items-center"
          >
            <img src={BrLogo} alt="Bloomreach" width={150} />
          </a>
          <span>✨</span>
          <div className="text-lg font-semibold text-[#002840]">Facets</div>
        </div>

        <div className="grow">
          <InputField
            helperText="Search for chair, outdoor furniture, bed, pillow, art, plants..."
            value={q}
            leftElement={
              loading ? <LoaderIcon className="animate-spin" /> : <SearchIcon />
            }
            clearable
            fullWidth
            onChange={(e) => updateQuery(e.target.value)}
          />
          {error && (
            <div>
              <h1 className="text-lg">Error: </h1>
              <JsonView value={error} />
            </div>
          )}
          {showJson ? (
            <JsonView value={data} collapsed={2} />
          ) : (
            <Theme className="my-2">
              <div className="flex">
                <div className="grow text-sm my-2">
                  Search results for{" "}
                  <span className="font-semibold">{searchedQuery}</span>
                  {data.autoCorrectQuery ? <span> (autocorrected)</span> : null}
                  {data.did_you_mean?.length ? (
                    <div className="my-2">
                      Did you mean:{" "}
                      {data.did_you_mean.map((term) => (
                        <span
                          key={term}
                          className="cursor-pointer px-2 mr-2 bg-blue-100 text-blue-600 hover:underline"
                          onClick={() => updateQuery(term)}
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div>
                  <select
                    className="p-2 rounded border text-sm"
                    value={sort}
                    onChange={(e) =>
                      updateQueryParams("sort", e.target.value || "")
                    }
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
              <div className="flex gap-8 mt-2">
                <div className="w-96">
                  {Object.keys(selectedFacets).length > 0 ? (
                    <>
                      <div className="text-md font-semibold py-2 my-2 border-b">
                        Applied Filters
                      </div>
                      {data?.facet_counts?.facets?.map((facet) =>
                        selectedFacets[facet.name] ? (
                          <AppliedFacet
                            key={facet.name}
                            facet={facet}
                            value={selectedFacets[facet.name]}
                            onClear={(value) => onFacetClear(facet.name, value)}
                          />
                        ) : null,
                      )}
                    </>
                  ) : null}
                  <div className="text-md font-semibold py-2 border-b">
                    Filters
                  </div>
                  <div className="flex flex-col">
                    <AccordionGroup
                      value={activeFilters}
                      multiple={true}
                      onValueChange={(val) => setActiveFilters(val)}
                    >
                      {data?.facet_counts?.facets?.map((facet) => (
                        <Facet
                          key={facet.name}
                          facet={facet}
                          value={selectedFacets[facet.name]}
                          onChange={(value) => onFacetChange(facet.name, value)}
                        />
                      ))}
                    </AccordionGroup>
                  </div>
                </div>
                <div className="w-full">
                  {data?.response?.docs?.length ? (
                    <div className="flex flex-col">
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {data?.response?.docs.map((product) => (
                          <ProductCard.Root key={product.pid}>
                            <ProductCard.Header>
                              <ProductCard.Image src={product.thumb_image} alt={product.title}  />
                            </ProductCard.Header>
                            <ProductCard.Body>
                              <Highlighter
                                className="w-full text-sm font-bold"
                                searchWords={[searchedQuery]}
                                textToHighlight={product.title}
                              />
                              {product.variants?.length > 1 ? (
                                <ProductCard.SubTitle>{`${product.variants.length} variants`}</ProductCard.SubTitle>
                              ) : null}
                            </ProductCard.Body>
                            <ProductCard.Footer>
                              <ProductCard.Price price={product.price} salePrice={product.sale_price} />
                            </ProductCard.Footer>
                          </ProductCard.Root>
                        ))}
                      </div>
                      {data.response.numFound > 0 ? (
                        <div className="my-8">
                          <Pagination.Root
                            count={data.response.numFound}
                            itemsPerPage={perPage}
                            itemsPerPageOptions={[12, 24, 48]}
                            onItemsPerPageChange={(newPerPage) =>
                              updateQueryParams("perPage", newPerPage)
                            }
                            onPageChange={(newPage) =>
                              updateQueryParams("page", newPage)
                            }
                            page={page}
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
            </Theme>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
