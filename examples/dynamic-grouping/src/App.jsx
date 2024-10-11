import {
  ToggleButtonGroup,
  ToggleButton,
  ToggleField,
  InputField,
  SearchIcon,
  Pagination,
  LoaderIcon,
  ExternalLinkIcon,
} from "@bloomreach/react-banana-ui";
import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import JsonView from "@uiw/react-json-view";

import "@bloomreach/react-banana-ui/style.css";
import { getSearchResults } from "./api";
import { Footer } from "./Footer";

import "./app.css";
import { account_id, account_name, group_options } from "./config";
import { ProductGroup } from "./components/product-group";
import BrLogo from "./assets/br-logo-primary.svg";

export default function App() {
  const [showJson, setShowJson] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("chair");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [groupBy, setGroupBy] = useState("material");
  const [data, setData] = useState({});
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(12);

  const debouncedSearch = useMemo(() => _.debounce(search, 300), []);

  useEffect(() => {
    if (query.length > 1) {
      debouncedSearch(query, page, perPage, groupBy);
    } else {
      setData({});
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [query, page, perPage, groupBy, debouncedSearch]);

  function search(query, page, perPage, groupBy) {
    setLoading(true);
    setError(null);

    getSearchResults(query, page, perPage, groupBy)
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
      <div className="app p-2 max-w-5xl w-full mx-auto grow">
        <div className="flex gap-2 items-center mt-4 mb-8">
          <div className="flex gap-2 items-center grow text-lg">
            <a href="https://bloomreach.com" target="_blank">
              <img src={BrLogo} width={150} />
            </a>
            <span>✨</span>
            <div className="text-lg font-semibold text-[#002840]">
              Dynamic grouping
            </div>
          </div>
        </div>

        <div>
          <InputField
            helperText="Search for chair, sofa, bed, pillow, coffee, chiar (for autocorrect)..."
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
                <div className="flex flex-row items-center gap-2 my-2">
                  <div className="text-sm font-semibold">Group by:</div>
                  <ToggleButtonGroup
                    value={groupBy}
                    onChange={(e, val) => setGroupBy(val)}
                  >
                    {group_options.map((opt) => (
                      <ToggleButton value={opt.value}>{opt.label}</ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </div>

                {data?.group_response?.[groupBy]?.groups.length ? (
                  <div className="flex flex-col mt-4">
                    <div className="flex flex-row flex-wrap gap-8">
                      {data?.group_response?.[groupBy]?.groups.map(
                        (group, index) => (
                          <ProductGroup key={index} group={group} />
                        ),
                      )}
                    </div>
                    {data?.group_response?.[groupBy]?.numGroups > 0 ? (
                      <div className="my-8">
                        <Pagination
                          count={data?.group_response?.[groupBy]?.numGroups}
                          itemsPerPage={perPage}
                          itemsPerPageOptions={[12, 24, 48]}
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
