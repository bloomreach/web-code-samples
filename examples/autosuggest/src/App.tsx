import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import Highlighter from "react-highlight-words";
import JsonView from "@uiw/react-json-view";
import {
  ToggleField,
  InputField,
  SearchIcon,
  LoaderIcon,
  TabPanel,
  Tab,
  Tabs,
  TabList,
} from "@bloomreach/react-banana-ui";
import "@bloomreach/react-banana-ui/style.css";
import {
  SuggestResponse,
  SuggestResponseSuggestionGroups,
  SuggestResponseQuerySuggestions,
  SuggestResponseSearchSuggestions,
  SuggestResponseAttributeSuggestions,
} from "@bloomreach/discovery-web-sdk";

import { getSuggestions } from "./api";
import { Footer } from "./Footer";
import { account_id, account_name } from "./config";
import BrLogo from "./assets/br-logo-primary.svg";

import "./app.css";

const formatPrice = (price: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
};

export default function App() {
  const [showJson, setShowJson] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("cha");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState<SuggestResponse>({});

  const debouncedSearch = useMemo(() => _.debounce(searchSuggestions, 300), []);

  useEffect(() => {
    if (query.length > 0) {
      debouncedSearch(query);
    } else {
      setData({});
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  function searchSuggestions(query: string) {
    setLoading(true);
    setError(null);

    getSuggestions(query)
      .then((response: SuggestResponse) => {
        setLoading(false);
        setData(response);
      })
      .catch((error: unknown) => {
        setLoading(false);
        setError(error);
        setData({});
      });
  }

  const results = data?.suggestionGroups || [];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#002840]">
        <div className="max-w-5xl mx-auto flex flex-row p-2 text-slate-300 text-xs items-center">
          <div className="grow">
            <span className="font-semibold">Account:</span> {account_name} ({account_id})
          </div>
          <ToggleField
            className="text-slate-300 toggle-field"
            label="Show JSON"
            inputProps={{ id: "show-json-toggle" }}
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
            <div className="text-lg font-semibold text-[#002840]">Autosuggest</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <InputField
            value={query}
            leftElement={loading ? <LoaderIcon className="animate-spin" /> : <SearchIcon />}
            clearable
            fullWidth
            helperText="Search for chair, sofa, bed, pillow..."
            onChange={(e) => setQuery(e.target.value)}
          />
          {error ? (
            <div>
              <h1 className="text-lg">Error: </h1>
              <JsonView value={error} />
            </div>
          ) : null}

          {showJson ? (
            <>{data ? <JsonView value={data} collapsed={3} /> : null}</>
          ) : (
            <Tabs defaultValue={0}>
              {results.length > 1 ? (
                <TabList variant="primary">
                  {results.map((result: SuggestResponseSuggestionGroups, index: number) => (
                    <Tab key={`${result.catalogName}_${result.view}`} value={index}>
                      <span className="uppercase text-xs">
                        {result.catalogName} ({result.view})
                      </span>
                    </Tab>
                  ))}
                </TabList>
              ) : null}
              {results.map((result: SuggestResponseSuggestionGroups, index: number) => (
                <TabPanel keepMounted key={`${result.catalogName}_${result.view}`} value={index}>
                  <div className="flex flex-col gap-2 mt-4 md:flex-row md:gap-8">
                    <div className="w-full">
                      <div className="text-sm my-2 uppercase font-semibold">Query Suggestions</div>
                      {result.querySuggestions?.length ? (
                        <ul>
                          {result.querySuggestions.map((suggestion: SuggestResponseQuerySuggestions) => (
                            <li className="list-none py-2 border-b border-slate-200" key={suggestion.displayText}>
                              <Highlighter
                                highlightClassName="bg-yellow-300 rounded"
                                className="w-full text-sm"
                                searchWords={[query]}
                                textToHighlight={suggestion.displayText}
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-slate-500">NA</div>
                      )}
                    </div>

                    <div className="w-full">
                      <div className="text-sm my-2 uppercase font-semibold">
                        Product Suggestions
                      </div>
                      {result.searchSuggestions?.length ? (
                        <ul>
                          {result.searchSuggestions.map((suggestion: SuggestResponseSearchSuggestions) => (
                            <li
                              className="list-none my-4 rounded overflow-hidden shadow-sm border border-slate-200"
                              key={suggestion.pid}
                            >
                              <div className="flex gap-2">
                                <div className="w-24">
                                  <img src={suggestion.thumb_image} className="mr-2 w-full" />
                                </div>
                                <div className="w-full grow">
                                  <Highlighter
                                    highlightClassName="bg-yellow-300 rounded"
                                    className="text-sm font-semibold"
                                    searchWords={[query]}
                                    textToHighlight={suggestion.title}
                                  />
                                  {suggestion.sale_price ? (
                                    <p className="text-xs opacity-50 py-1">
                                      {formatPrice(suggestion.sale_price)}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-slate-500">NA</div>
                      )}
                    </div>

                    <div className="w-full">
                      <div className="text-sm my-2 uppercase font-semibold">
                        Attribute Suggestions
                      </div>
                      {result.attributeSuggestions?.length ? (
                        <ul>
                          {result.attributeSuggestions.map((suggestion: SuggestResponseAttributeSuggestions) => (
                            <li className="list-none py-2 border-b border-slate-200" key={suggestion.name}>
                              <p className="opacity-50 text-xs uppercase">
                                {suggestion.attributeType}
                              </p>
                              <Highlighter
                                highlightClassName="bg-yellow-300 rounded"
                                className="w-full text-sm"
                                searchWords={[query]}
                                textToHighlight={suggestion.name}
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-slate-500">NA</div>
                      )}
                    </div>
                  </div>
                </TabPanel>
              ))}
            </Tabs>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}