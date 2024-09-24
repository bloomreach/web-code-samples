import _ from 'lodash';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Highlighter from 'react-highlight-words';
import {
  autoUpdate,
  size,
  flip,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  FloatingFocusManager,
  FloatingPortal,
} from '@floating-ui/react';
import { Button, LoaderIcon, SearchIcon, ArrowLeftIcon, ArrowRightIcon } from '@bloomreach/react-banana-ui';
import JsonView from '@uiw/react-json-view';
import useAnalytics from '../hooks/useAnalytics';
import useAutosuggestApi from '../hooks/useAutosuggestApi';
import { Price } from './Price';
import { CONFIG } from '../constants';

function SearchBarComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { trackEvent } = useAnalytics();
  const [options, setOptions] = useState({});
  const [query, setQuery] = useState('');
  const [userSelectedQuery, setUserSelectedQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const listRef = useRef([]);
  const { loading, error, data } = useAutosuggestApi(CONFIG, options);

  // Aggregate the results in the items, to support keyboard navigation across query and product
  // results lists
  const results = useMemo(() => data?.suggestionGroups?.[0], [data]);
  const querySuggestions = useMemo(() => _.take(results?.querySuggestions, 6), [results]);
  const productSuggestions = useMemo(() => _.take(results?.searchSuggestions, 6), [results]);
  const attributeSuggestions = useMemo(() => _.take(results?.attributeSuggestions, 6), [results]);

  const items = useMemo(() => [
    ...querySuggestions,
    ...attributeSuggestions,
    ...productSuggestions,
  ], [querySuggestions, attributeSuggestions, productSuggestions]);
  const queryIndexOffset = 1;
  const attributeIndexOffset = queryIndexOffset + querySuggestions.length;
  const productIndexOffset = attributeIndexOffset + attributeSuggestions.length;

  const handleActiveIndexChange = (newIndex) => {
    if (newIndex === null) {
      setUserSelectedQuery('');
    } else if (!newIndex || newIndex >= attributeIndexOffset) {
      setUserSelectedQuery('');
    } else {
      setUserSelectedQuery(querySuggestions[newIndex - 1].displayText);
    }
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setOpen(false);
  }, [searchParams]);

  useEffect(() => {
    if (open) {
      setOptions({ q: query });
    }
  }, [query, open]);

  const {
    refs,
    floatingStyles,
    context,
  } = useFloating({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      flip({ padding: 10 }),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
    ],
  });

  const role = useRole(context, { role: 'listbox' });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: handleActiveIndexChange,
    virtual: true,
    loop: true,
  });

  const {
    getReferenceProps,
    getFloatingProps,
    getItemProps,
  } = useInteractions([role, dismiss, listNav]);

  const setNewQuery = (newQuery) => {
    setUserSelectedQuery('');
    setQuery(newQuery);
  };

  // Handle user typing in the search input
  const onChange = (event) => {
    const { value } = event.target;
    setNewQuery(value);

    if (value) {
      setOpen(true);
      setActiveIndex(0);
    }
  };

  // Handle when a query term is selected (using keyboard)/clicked
  const handleQuerySuggestionSelect = (term) => {
    trackEvent({
      event: 'event_suggest',
      userQuery: query,
      query: term,
    });
    router.push(`/products?q=${term}`);
    setOpen(false);
  };

  // Handle when a product is selected (using keyboard)/clicked
  const handleProductSelect = (pid) => {
    router.push(`/products/${pid}`);
  };

  // Handle when an attribute suggestion is selected (using keyboard)/clicked
  // Attributes can be category or some other facetable value like brand, etc, so based on the
  // type, you need to handle it appropriately. If it is brand, you may want to redirect to the
  // search page with the brand filter applied following the pattern of your product
  const handleAttributeSuggestionSelect = (attributeType, value) => {
    if (attributeType === 'category') {
      router.push(`/categories/${value}`);
    } else {
      router.push(`/products?q=${value}`);
    }
  };

  const handleSearch = (term) => {
    if (!term) {
      return;
    }

    trackEvent({
      event: 'event_search',
      query: term,
    });
    router.push(`/products?q=${term}`);
  };

  // Handle when user hits `Enter` in the search input
  // If something is selected in the search results, use that to determine next action
  // If nothing is selected, then do a search using the term entered in the search input
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex !== null && activeIndex > 0 && items[activeIndex - 1]) {
      const item = items[activeIndex - 1];
      if (activeIndex < attributeIndexOffset) {
        handleQuerySuggestionSelect(item.displayText);
      } else if (activeIndex < productIndexOffset) {
        handleAttributeSuggestionSelect(item.attributeType, item.value);
      } else {
        handleProductSelect(item.pid);
      }
      setActiveIndex(null);
      return;
    }

    handleSearch(query);
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <div>
        <form className="flex gap-2 items-center relative" onSubmit={handleSubmit}>
          <div className="absolute px-3">
            {loading ? <LoaderIcon className="animate-spin" /> : <SearchIcon />}
          </div>
          <input
            className="border rounded w-full p-2 rounded pl-10 focus:outline-0"
            placeholder="Search for chair, sofa, bed, pillow, pen, paper"
            ref={refs.setReference}
            {...getReferenceProps({
              onChange,
              onFocus() {
                setOpen(true);
              },
              value: userSelectedQuery || query,
              'aria-autocomplete': 'list',
            })}
          />
        </form>
        <FloatingPortal>
          {open && (
            <FloatingFocusManager
              context={context}
              initialFocus={-1}
              visuallyHiddenDismiss
            >
              <div
                className="bg-white border rounded-b shadow-lg"
                {...getFloatingProps({
                  ref: refs.setFloating,
                  style: {
                    ...floatingStyles,
                    background: '#fff',
                    overflowY: 'auto',
                  },
                })}
              >
                {error ? <JsonView value={error} /> : null}
                {query && data ? (
                  <div>
                    <div className="flex flex-col gap-2 mt-4 rounded sm:flex-row">
                      <div className="flex flex-col gap-4 px-2 grow sm:w-1/3">
                        <div>
                          <div className="text-sm px-2 mb-2 uppercase font-semibold">
                            Query Suggestions
                          </div>
                          {querySuggestions.length ? (
                            <ul>
                              {querySuggestions.map((suggestion, index) => (
                                <li
                                  role="button"
                                  key={suggestion.displayText}
                                  className={`
                                  ${activeIndex === queryIndexOffset + index ? 'bg-slate-100' : ''}
                                  flex list-none border-b border-slate-200
                                  cursor-pointer hover:bg-slate-100 last:border-b-0
                                `}
                                >
                                  <a
                                    className="flex p-2 grow"
                                    href={`/products?q=${suggestion.displayText}`}
                                    {...getItemProps({
                                      ref(node) {
                                        listRef.current[queryIndexOffset + index] = node;
                                      },
                                      onClick(e) {
                                        e.preventDefault();
                                        handleQuerySuggestionSelect(suggestion.displayText);
                                      },
                                    })}
                                  >
                                    <Highlighter
                                      highlightClassName="bg-transparent font-bold"
                                      className="w-full text-sm"
                                      searchWords={[query]}
                                      textToHighlight={suggestion.displayText}
                                    />
                                  </a>
                                  <Button
                                    type="tertiary"
                                    onClick={() => setNewQuery(suggestion.displayText)}
                                  >
                                    <ArrowLeftIcon className="rotate-45" />
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-sm text-slate-500 px-2">NA</div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm px-2 mb-2 uppercase font-semibold">
                            Attribute Suggestions
                          </div>
                          {attributeSuggestions.length ? (
                            <ul>
                              {attributeSuggestions.map((suggestion, index) => (
                                <li
                                  role="button"
                                  key={suggestion.name}
                                  className={`
                                  ${activeIndex === index + attributeIndexOffset ? 'bg-slate-100' : ''}
                                  list-none p-2 border-b border-slate-200
                                  cursor-pointer hover:bg-slate-100 last:border-b-0
                                `}
                                  {...getItemProps({
                                    ref(node) {
                                      listRef.current[index + attributeIndexOffset] = node;
                                    },
                                    onClick() {
                                      handleAttributeSuggestionSelect(suggestion.attributeType, suggestion.value);
                                    },
                                  })}
                                >
                                  <p className="opacity-50 text-xs uppercase">
                                    {suggestion.attributeType}
                                  </p>
                                  <Highlighter
                                    highlightClassName="bg-transparent font-bold"
                                    className="w-full text-sm"
                                    searchWords={[query]}
                                    textToHighlight={suggestion.name}
                                  />
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-sm text-slate-500 px-2">NA</div>
                          )}
                        </div>
                      </div>

                      <div className="px-2 sm:w-2/3">
                        <div className="text-sm px-2 mb-2 uppercase font-semibold">
                          Product Suggestions
                        </div>
                        {productSuggestions.length ? (
                          <div className="flex flex-wrap">
                            {productSuggestions.map((suggestion, index) => (
                              <a
                                role="button"
                                key={suggestion.pid}
                                href={`/products/${suggestion.pid}`}
                                {...getItemProps({
                                  ref(node) {
                                    // set the correct index, accounting for the query suggestions
                                    // that were already rendered, so when the user is using the
                                    // keyboard to navigate, the correct item is highlighted
                                    listRef.current[index + productIndexOffset] = node;
                                  },
                                  onClick() {
                                    handleProductSelect(suggestion.pid);
                                  },
                                })}
                                className="flex list-none w-1/3 px-2 pb-4"
                              >
                                <div className={`
                              ${activeIndex === index + productIndexOffset ? 'bg-slate-100' : ''}
                              flex flex-col gap-2 border border-slate-200 rounded-md cursor-pointer shadow-sm
                              `}
                                >
                                  <img
                                    className="rounded-t-md"
                                    src={suggestion.thumb_image}
                                    alt={suggestion.title}
                                  />
                                  <Highlighter
                                    highlightClassName="bg-transparent font-bold"
                                    className="w-full text-sm px-2 pt-1 grow"
                                    searchWords={[query]}
                                    textToHighlight={suggestion.title}
                                  />
                                  <Price
                                    className="text-sm px-2 opacity-50 pb-1"
                                    product={suggestion}
                                  />
                                </div>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm px-2">NA</div>
                        )}
                      </div>
                    </div>
                    <div
                      className={`${activeIndex === 0 ? 'bg-slate-100' : ''}
                        flex border-t border-slate-200 p-4 mt-2
                        cursor-pointer hover:bg-slate-100 items-center
                      `}
                      {...getItemProps({
                        ref(node) {
                          listRef.current[0] = node;
                        },
                      })}
                    >
                      <div className="text-sm grow">
                        Search for:{" "}
                        <span className="font-bold">{query}</span>
                      </div>
                      <ArrowRightIcon className="" />
                    </div>
                  </div>
                ) : null}
              </div>
            </FloatingFocusManager>
          )}
        </FloatingPortal>
      </div>
    </div>
  );
}

export function SearchBar() {
  return (
    <Suspense>
      <SearchBarComponent />
    </Suspense>
  );
}
