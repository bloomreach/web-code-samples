import _ from 'lodash';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import JsonView from '@uiw/react-json-view';
import Highlighter from 'react-highlight-words';
import { InputField, LoaderIcon, SearchIcon, Badge } from '@bloomreach/react-banana-ui';
import useAutosuggestApi from '../hooks/useAutosuggestApi';
import { config } from '../utils';
import useCart from '../hooks/useCart';
import useDataLayer from '../hooks/useDataLayer';

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartCount } = useCart();
  const dataLayer = useDataLayer();
  const [options, setOptions] = useState({});
  const [query, setQuery] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);
  const [isHoveringResults, setIsHoveringResults] = useState(false);
  const { loading, error, data } = useAutosuggestApi(config, options);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    setOptions({ q: query });
  }, [query]);

  const handleSubmit = (e) => {
    e && e.preventDefault();
    dataLayer.push({
      event: 'event_search',
      query,
    });
    setIsInputActive(false);
    router.push(`/products?q=${query}`);
  };

  const handleQuerySearch = (term) => {
    setIsHoveringResults(false);
    dataLayer.push({
      event: 'event_suggest',
      userQuery: query,
      query: term,
    });
    router.push(`/products?q=${term}`);
  };

  const isOpen = isInputActive || isHoveringResults;

  return (
    <>
      <div className="flex gap-2 items-center mt-4 mb-8">
        <div className="flex gap-2 items-center grow">
          <Link href="/">
            <img src="/br-logo-primary.svg" alt="" width={150} />
          </Link>
          <span>✨</span>
          <div className="text-lg font-semibold text-[#002840]">
            Pixel
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div>
            <Link href="/user" className="flex gap-2">User</Link>
          </div>
          <div>
            <Link href="/cart" className="flex gap-2">
              <Badge
                content={cartCount}
              >
                <span className="pr-2">Cart</span>
              </Badge>

            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 relative">
        <form onSubmit={handleSubmit}>
          <InputField
            value={query}
            leftElement={
              loading ? <LoaderIcon className="animate-spin" /> : <SearchIcon />
            }
            inputProps={{ id: 'search-field' }}
            clearable
            fullWidth
            helperText="Search for chair, sofa, bed, pillow..."
            onFocus={() => setIsInputActive(true)}
            onBlur={() => setIsInputActive(false)}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        {isOpen && query ? (
          <div
            className="border rounded bg-white shadow-md absolute z-10 w-full top-10"
            onMouseEnter={() => setIsHoveringResults(true)}
            onMouseLeave={() => setIsHoveringResults(false)}
          >
            <div>
              {error && <JsonView value={error} />}
              {
              data && (() => {
                const [results] = data.suggestionGroups;
                const querySuggestions = _.take(results.querySuggestions, 6);
                const productSuggestions = _.take(results.searchSuggestions, 6);

                return (
                  <div className="flex gap-8 mt-4 rounded">
                    <div className="w-full px-2">
                      <div className="text-sm my-2 uppercase font-bold">
                        Query Suggestions
                      </div>
                      {querySuggestions.length ? (
                        <ul>
                          {querySuggestions.map((suggestion) => (
                            <li
                              className={`
                              list-none p-2 my-2 border-b border-slate-200
                              cursor-pointer hover:bg-slate-100 last:border-b-0
                              `}
                              key={suggestion.displayText}
                              onClick={() => handleQuerySearch(suggestion.displayText)}
                            >
                              <Highlighter
                                highlightClassName="bg-[#ffd500] rounded"
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

                    <div className="w-full px-2">
                      <div className="text-sm my-2 uppercase font-bold">
                        Product Suggestions
                      </div>
                      {productSuggestions.length ? (
                        <ul>
                          {productSuggestions.map((suggestion) => (
                            <li
                              className="list-none py-1 rounded overflow-hidden shadow-sm border-b border-slate-200 last:border-b-0"
                              key={suggestion.pid}
                            >
                              <Link href={`/products/${suggestion.pid}`} className="flex gap-2">
                                <div className="w-8">
                                  <img
                                    src={suggestion.thumb_image}
                                    alt=""
                                    className="mr-2 w-full"
                                  />
                                </div>
                                <Highlighter
                                  highlightClassName="bg-[#ffd500] rounded"
                                  className="w-full text-sm p-2 font-semibold"
                                  searchWords={[query]}
                                  textToHighlight={suggestion.title}
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-slate-500">NA</div>
                      )}
                    </div>
                  </div>
                );
              })()
            }
            </div>
          </div>
        ) : null}
      </div>

    </>
  );
}
