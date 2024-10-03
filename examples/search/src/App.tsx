import { useEffect, useMemo, useState } from "react";
import {
  ToggleField,
  InputField,
  LoaderIcon,
  SearchIcon,
  Pagination,
} from "@bloomreach/react-banana-ui";
import {
  Configuration,
  ProductSearchOptions,
} from "@bloomreach/discovery-web-sdk";
import { ProductCard, useSearch } from '@bloomreach/limitless-ui-react';
import _ from "lodash";
import Highlighter from "react-highlight-words";
import JsonView from "@uiw/react-json-view";

import "@bloomreach/react-banana-ui/style.css";
import { Footer } from "./Footer";
import { account_id, account_name, auth_key, domain_key, product_fields } from "./config";
import BrLogo from "./assets/br-logo-primary.svg";

import "./app.css";

const config: Configuration = {
  account_id,
  auth_key,
  domain_key,
};

const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);

export default function App() {
  const [showJson, setShowJson] = useState<boolean>(false);

  // query rendered in the search input
  const [query, setQuery] = useState<string>("chair");

  // query used to make the search API calls, set after debouncing the search input value changes
  const [searchQuery, setSearchQuery] = useState<string>("chair");

  // query used to execute the search, in case the search input was auto-corrected by the API
  const [searchedQuery, setSearchedQuery] = useState<string>("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(12);

  const [options, setOptions] = useState<ProductSearchOptions>({
    _br_uid_2: uid,
    url: window.location.href,
    ref_url: window.location.href,
    request_id: Date.now(),
    'facet.version': '3.0',
    q: query,
    start: page * perPage,
    rows: perPage,
    sort: sort,
    'stats.field': 'sale_price',
    'query.numeric_precision': 'standard',
    br_diagnostic: 'all',
    fl: product_fields
  } as ProductSearchOptions)

  const debouncedUpdateSearchQuery = useMemo(() => _.debounce(updateSearchQuery, 300), []);
  const { loading, error, response: data } = useSearch('product', config, options);

  useEffect(() => {
    setOptions((opts: ProductSearchOptions) => ({
      ...{},
      ...opts,
      ...{
        q: searchQuery,
        start: page * perPage,
        rows: perPage,
        sort: sort,
      },
    }));
  }, [searchQuery, page, perPage, sort]);

  useEffect(() => {
    setSearchedQuery(data?.autoCorrectQuery || searchQuery);
  }, [data]);

  function updateSearchQuery(newQuery: string) {
    setPage(0);
    setSort("");
    setSearchQuery(newQuery);
  }

  function updateQuery(newQuery: string) {
    setQuery(newQuery);
    debouncedUpdateSearchQuery(newQuery);
  }

  function updateSort(newSort: string) {
    setPage(0);
    setSort(newSort);
  }

  function updatePerPage(newPerPage: number) {
    setPage(0);
    setPerPage(newPerPage);
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
            <div className="text-lg font-semibold text-[#002840]">Search</div>
          </div>
        </div>

        <div>
          <InputField
            helperText="Search for chair, bed, office furniture, chandeliers, chiar (for autocorrect)..."
            value={query}
            leftElement={loading ? <LoaderIcon className="animate-spin" /> : <SearchIcon />}
            clearable
            fullWidth
            onChange={(e) => updateQuery(e.target.value)}
          />
          {!!error && (
            <div>
              <h1 className="text-lg">Error: </h1>
              <JsonView value={error} />
            </div>
          )}

          {searchQuery ? (
            <div className="flex gap-4 mt-4">
              {showJson ? (
                <>{data ? <JsonView value={data} collapsed={1} /> : null}</>
              ) : (
                <div className="w-full">
                  <div className="flex mb-4 items-center">
                    <div className="grow text-sm my-2">
                      Search results for{" "}
                      <span className="font-semibold">{searchedQuery}</span>
                      {data?.autoCorrectQuery ? (
                        <span> (autocorrected)</span>
                      ) : null}
                      {data?.did_you_mean?.length ? (
                        <div className="my-2">
                          Did you mean:{" "}
                          {data.did_you_mean.map((term) => (
                            <span
                              key={term}
                              className="cursor-pointer px-2 mr-2 bg-blue-100 text-blue-600 hover:underline"
                              onClick={() => setQuery(term)}
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
                        onChange={(e) => updateSort(e.target.value || "")}
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
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {data?.response?.docs.map((product) => (
                          <ProductCard.Root
                            className="flex flex-col shadow-md rounded-md border border-slate-100"
                            key={product.pid}
                          >
                            <ProductCard.Header className="w-full max-h-56 rounded-t-md overflow-hidden border-b border-slate-200 ">
                              <img src={product.thumb_image} alt={product.title} className="mr-2 w-full object-cover object-top" />
                            </ProductCard.Header>
                            <ProductCard.Body className="flex flex-col grow p-2">
                              <Highlighter
                                className="w-full text-sm font-bold"
                                searchWords={[searchedQuery]}
                                textToHighlight={product.title}
                              />
                              {product.variants?.length > 1 ? (
                                <ProductCard.SubTitle className="text-sm opacity-60">
                                  {product.variants.length}
                                  {' '}
                                  variants
                                </ProductCard.SubTitle>
                              ) : null}
                            </ProductCard.Body>
                            <ProductCard.Footer className="flex flex-col gap-2 p-2">
                              <ProductCard.Price className="text-sm flex gap-2" price={product.price} salePrice={product.sale_price} />
                            </ProductCard.Footer>
                          </ProductCard.Root>
                        ))}
                      </div>
                      {data?.response?.numFound && data?.response?.numFound > 0 ? (
                        <div className="my-8">
                          <Pagination
                            count={data.response.numFound}
                            itemsPerPage={perPage}
                            itemsPerPageOptions={[12, 24, 48]}
                            onItemsPerPageChange={(newPerPage) =>
                              updatePerPage(newPerPage)
                            }
                            onPageChange={(newPage) => setPage(newPage)}
                            page={page}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">No results!</div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
}
