import { useContext, useEffect, useState } from "react";
import { Configuration, ProductSearchOptions } from "@bloomreach/discovery-web-sdk";
import {
  ProductCard,
  SearchContext,
  SearchBox,
  Results,
  Pagination,
} from "@bloomreach/limitless-ui-react";

import Highlighter from "react-highlight-words";
import JsonView from "@uiw/react-json-view";

import "@bloomreach/react-banana-ui/style.css";
import "@bloomreach/limitless-ui-react/style.css";
import { Footer } from "./Footer";
import { account_id, account_name, auth_key, domain_key, product_fields } from "./config";
import BrLogo from "./assets/br-logo-primary.svg";

import "./app.css";
import "@bloomreach/limitless-ui-react/style.css";

const config: Configuration = {
  account_id,
  auth_key,
  domain_key,
};

const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);

export default function App() {
  // query used to execute the search, in case the search input was auto-corrected by the API
  const [searchedQuery, setSearchedQuery] = useState<string>("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [options, setOptions] = useState<ProductSearchOptions>({
    _br_uid_2: uid,
    url: window.location.href,
    ref_url: window.location.href,
    request_id: Date.now(),
    "facet.version": "3.0",
    start: page * perPage,
    rows: perPage,
    sort: sort,
    "stats.field": "sale_price",
    "query.numeric_precision": "standard",
    // br_diagnostic: 'all',
    fl: product_fields,
  });

  const searchContext = useContext(SearchContext);

  if (!searchContext) {
    throw new Error("Search Context not provided, can not retrieve results");
  }
  const { inputValue, setInputValue, error, searchResponse: data } = searchContext;

  useEffect(() => {
    setOptions((opts: ProductSearchOptions) => ({
      ...{},
      ...opts,
      ...{
        start: page * perPage,
        rows: perPage,
        sort: sort,
      },
    }));
  }, [page, perPage, sort]);

  useEffect(() => {
    setSearchedQuery(data?.autoCorrectQuery || inputValue);
  }, [data]);

  function updateSort(newSort = "") {
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
            <span className="font-semibold">Account:</span> {account_name} ({account_id})
          </div>
          <a
            href="https://github.com/bloomreach/web-code-samples/discussions/new"
            target="_blank"
            className="flex gap-2 items-center font-semibold bg-amber-300 text-slate-800 mx-2 px-2 rounded"
          >
            Feedback
          </a>
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
          <SearchBox.Root
            searchType="product"
            configuration={config}
            searchOptions={options}
            autoQuery={true}
            onSubmit={() => updateSort()}
            labels={{
              label: "Searchbox",
              placeholder:
                "Search for chair, bed, office furniture, chiar (for autocorrect), plant (for campaign), bloomreach (for redirect)...",
              submit: "Submit",
              reset: "Reset",
            }}
          />

          {!!error && (
            <div>
              <h1 className="text-lg">Error: </h1>
              <JsonView value={error} />
            </div>
          )}

          {!!data && (
            <div className="flex gap-4 mt-4">
              <div className="w-full">
                <div className="flex mb-4 items-center">
                  <div className="grow text-sm my-2">
                    Search results for <span className="font-semibold">{searchedQuery}</span>
                    {data?.autoCorrectQuery ? <span> (autocorrected)</span> : null}
                    {data?.did_you_mean?.length ? (
                      <div className="my-2">
                        Did you mean:{" "}
                        {data.did_you_mean.map((term) => (
                          <span
                            key={term}
                            className="cursor-pointer px-2 mr-2 bg-blue-100 text-blue-600 hover:underline"
                            onClick={() => setInputValue(term)}
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
                      <option value="sale_price asc">Sale Price (low to high)</option>
                      <option value="sale_price desc">Sale Price (high to low)</option>
                    </select>
                  </div>
                </div>

                {data?.keywordRedirect ? (
                  <div className="text-sm my-8">
                    Redirect to{" "}
                    <a
                      className="font-semibold text-blue-600"
                      href={data.keywordRedirect["redirected url"]}
                      target="_blank"
                    >
                      {data.keywordRedirect["redirected url"]}
                    </a>
                  </div>
                ) : null}

                {data ? (
                  <div className="flex flex-col">
                    <Results
                      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
                      resultComponent={({ result: product }) => (
                        <ProductCard.Root key={product.pid}>
                          <ProductCard.Header>
                            <ProductCard.Image src={product.thumb_image} alt={product.title} />
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
                            <ProductCard.Price
                              price={product.price}
                              salePrice={product.sale_price}
                            />
                          </ProductCard.Footer>
                        </ProductCard.Root>
                      )}
                    />

                    {data?.response?.numFound && data?.response?.numFound > 0 && (
                      <div className="my-8">
                        <Pagination.Root
                          count={data.response.numFound}
                          itemsPerPage={perPage}
                          page={page}
                          onPageChange={setPage}
                          itemsPerPageOptions={[10, 25, 50]}
                          onItemsPerPageChange={updatePerPage}
                        >
                          <Pagination.Summary
                            render={(start, end, total) => `Showing ${start} to ${end} of ${total}`}
                          />

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
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">No results!</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
