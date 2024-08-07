import {
  ToggleButtonGroup,
  ToggleButton,
  ToggleField,
  InputField,
  SearchIcon,
  Pagination,
  LoaderIcon,
} from "@bloomreach/react-banana-ui";
import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import Highlighter from "react-highlight-words";
import JsonView from "@uiw/react-json-view";

import "@bloomreach/react-banana-ui/style.css";
import { getSearchResults } from "./api";
import { Price } from "./components/price";
import { account_id, account_name, segments, views } from "./config";
import { Footer } from "./Footer";
import BrLogo from "./assets/br-logo-primary.svg";

import "./app.css";
export default function App() {
  const [showJson, setShowJson] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("switch");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [data, setData] = useState({});
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(12);

  const [viewId, setViewId] = useState(views[0]?.value);
  const [segment, setSegment] = useState(segments[0]?.value);

  const debouncedSearch = useMemo(() => _.debounce(search, 300), []);

  useEffect(() => {
    if (query.length > 1) {
      debouncedSearch(query, page, perPage, viewId, segment);
    } else {
      setData({});
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [query, page, perPage, viewId, segment, debouncedSearch]);

  function search(query, page, perPage, viewId, segment) {
    setLoading(true);
    setError(null);

    getSearchResults(query, page, perPage, viewId, segment)
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
    setPage(0);
    setQuery(newQuery);
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
            <div className="text-lg font-semibold">Relevance by segment</div>
          </div>
        </div>

        <div>
          <InputField
            helperText="Search for switch..."
            value={query}
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
          <div className="flex gap-4 mt-4">
            {showJson ? (
              <JsonView value={data} collapsed={1} />
            ) : (
              <div className="w-full">
                <div className="flex flex-row gap-8">
                  <div>
                    <div className="font-semibold text-sm mb-2">
                      Select industry:
                    </div>
                    <ToggleButtonGroup
                      value={viewId}
                      onChange={(_, val) => setViewId(val)}
                    >
                      {views.map((view) => (
                        <ToggleButton value={view.value}>
                          {view.label}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-2">
                      Select type of project:
                    </div>
                    <ToggleButtonGroup
                      value={segment}
                      onChange={(_, val) => setSegment(val)}
                    >
                      {segments.map((segment) => (
                        <ToggleButton value={segment.value}>
                          {segment.label}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </div>
                </div>

                <div className="flex">
                  <div className="grow text-sm my-4">
                    Search results for{" "}
                    <span className="font-semibold">{searchedQuery}</span>
                    {data.autoCorrectQuery ? (
                      <span> (autocorrected)</span>
                    ) : null}
                    {data.did_you_mean?.length ? (
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
                </div>

                {data?.response?.docs?.length ? (
                  <div className="flex flex-col">
                    <div className="flex flex-row flex-wrap">
                      {data?.response?.docs.map((product, index) => (
                        <div
                          className="m-2 w-56 shadow-md rounded-md border border-slate-100"
                          key={index}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="w-full h-64 rounded-t-md overflow-hidden border-b border-slate-200 ">
                              <img
                                src={product.thumb_image}
                                className="mr-2 w-full object-cover object-top"
                              />
                            </div>
                            <div className="p-2 pt-0">
                              <Highlighter
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
                        </div>
                      ))}
                    </div>
                    {data.response.numFound > 0 ? (
                      <div className="my-8">
                        <Pagination
                          count={data.response.numFound}
                          itemsPerPageOptions={[12, 24, 48]}
                          itemsPerPage={perPage}
                          onItemsPerPageChange={(newPerPage) =>
                            setPerPage(newPerPage)
                          }
                          onPageChange={(newPage) => setPage(newPage)}
                          page={page}
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
      </div>
      <Footer />
    </div>
  );
}
