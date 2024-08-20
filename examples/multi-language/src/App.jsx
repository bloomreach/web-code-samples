import {
  InputField,
  LoaderIcon,
  SearchIcon, SelectField, SelectOption,
  ToggleField,
} from "@bloomreach/react-banana-ui";
import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import Highlighter from "react-highlight-words";
import JsonView from "@uiw/react-json-view";

import "@bloomreach/react-banana-ui/style.css";
import { getSearchResults } from "./api";
import { Price } from "./components/price";
import { Footer } from "./Footer";
import { account_id, account_name, catalogs } from "./config";
import BrLogo from "./assets/br-logo-primary.svg";

import "./app.css";

export default function App() {
  const [showJson, setShowJson] = useState(false);
  const [domainKey, setDomainKey] = useState(catalogs[0].domainKey);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("chair");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [data, setData] = useState({});

  const debouncedSearch = useMemo(() => _.debounce(search, 300), []);

  useEffect(() => {
    if (query.length > 1) {
      debouncedSearch(query, domainKey);
    } else {
      setData({});
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, domainKey, debouncedSearch]);

  function search(query, domainKey) {
    setLoading(true);
    setError(null);

    getSearchResults(query, domainKey)
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
            <div className="text-lg font-semibold text-[#002840]">Multi-language</div>
          </div>
          <div>
            <SelectField
              value={domainKey}
              onChange={(event, value) =>setDomainKey(value)}
            >
              {catalogs.map(catalog => (
                <SelectOption key={catalog.domainKey} value={catalog.domainKey}>
                  {catalog.label}
                </SelectOption>
              ))}
            </SelectField>
          </div>
        </div>

        <div>
          <InputField
            helperText="Search for chair, bed, home decor, office decor, lights, chiar (for autocorrect)..."
            value={query}
            leftElement={loading ? <LoaderIcon className="animate-spin" /> : <SearchIcon />}
            clearable
            fullWidth
            onChange={(e) => updateQuery(e.target.value)}
          />
          {loading && <div>Loading...</div>}
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
                {data?.response?.docs?.length ? (
                  <div className="flex flex-col">
                    <div className="flex">
                      <div className="grow text-sm my-2">
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
                    <div className="flex flex-row flex-wrap">
                      {data?.response?.docs.map((product, index) => (
                        <div
                          className="m-2 w-56 shadow-md rounded-md border border-slate-100"
                          key={product.pid}
                        >
                          <div className="flex flex-col gap-2">
                            <div
                              className="w-full max-h-56 rounded-t-md overflow-hidden border-b border-slate-200 ">
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
                              <Price className="text-sm" product={product}/>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">NA</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
