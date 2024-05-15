import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import Highlighter from "react-highlight-words";
import JsonView from "@uiw/react-json-view";
import {
  ToggleField,
  InputField,
  SearchIcon,
  LoaderIcon,
} from "@bloomreach/react-banana-ui";
import "@bloomreach/react-banana-ui/style.css";

import { getSuggestions } from "./api";
import { Footer } from "./Footer";
import { account_id, account_name } from "./config";
import BrLogo from "./assets/br-logo-primary.svg";

import "./app.css";

export default function App() {
  const [showJson, setShowJson] = useState(false);
  const [query, setQuery] = useState("cha");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [attributeSuggestions, setAttributeSuggestions] = useState([]);

  const debouncedSearch = useMemo(() => _.debounce(searchSuggestions, 300), []);

  useEffect(() => {
    if (query.length > 1) {
      // Only search if the query is 2 or more characters
      debouncedSearch(query);
    } else {
      setData({});
      setSuggestions([]); // Clear suggestions if the query is too short
      setProductSuggestions([]);
      setAttributeSuggestions([]);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  function searchSuggestions(query) {
    setLoading(true);
    setError(null);

    getSuggestions(query)
      .then((response) => {
        setLoading(false);
        setData(response);
        const results = response.suggestionGroups[0];
        setSuggestions(_.take(results.querySuggestions, 6));
        setProductSuggestions(_.take(results.searchSuggestions, 6));
        setAttributeSuggestions(_.take(results.attributeSuggestions, 6));
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setError(error);
        setData({});
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
              Autosuggest
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <InputField
            value={query}
            leftElement={
              loading ? <LoaderIcon className="animate-spin" /> : <SearchIcon />
            }
            clearable
            fullWidth
            helperText="Search for chair, sofa, bed, pillow..."
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <div>Loading...</div>}
          {error && (
            <div>
              <h1 className="text-lg">Error: </h1>
              <JsonView value={error} />
            </div>
          )}

          {showJson ? (
            <JsonView value={data} collapsed={3} />
          ) : (
            <div className="flex gap-8 mt-4">
              <div className="w-full">
                <div className="text-sm my-2 uppercase font-bold">
                  Query Suggestions
                </div>
                {suggestions.length ? (
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li
                        className="list-none p-2 my-2 border-b border-slate-200"
                        key={index}
                      >
                        <Highlighter
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
                <div className="text-sm my-2 uppercase font-bold">
                  Product Suggestions
                </div>
                {productSuggestions.length ? (
                  <ul>
                    {productSuggestions.map((suggestion, index) => (
                      <li
                        className="list-none my-4 rounded overflow-hidden shadow-sm border border-slate-200"
                        key={index}
                      >
                        <div className="flex gap-2">
                          <div className="w-24">
                            <img
                              src={suggestion.thumb_image}
                              className="mr-2 w-full"
                            />
                          </div>
                          <Highlighter
                            className="w-full text-sm p-2 font-semibold"
                            searchWords={[query]}
                            textToHighlight={suggestion.title}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-slate-500">NA</div>
                )}
              </div>

              <div className="w-full">
                <div className="text-sm my-2 uppercase font-bold">
                  Attribute Suggestions
                </div>
                {attributeSuggestions.length ? (
                  <ul>
                    {attributeSuggestions.map((suggestion, index) => (
                      <li
                        className="list-none p-2 my-2 border-b border-slate-200"
                        key={index}
                      >
                        <Highlighter
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
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
