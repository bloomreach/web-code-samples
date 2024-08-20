import _ from 'lodash';
import { Suspense, useEffect, useRef, useState } from 'react';
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
import { LoaderIcon, SearchIcon } from '@bloomreach/react-banana-ui';
import JsonView from '@uiw/react-json-view';
import useAnalytics from '../hooks/useAnalytics';
import useAutosuggestApi from '../hooks/useAutosuggestApi';
import { CONFIG } from '../constants';

function SearchBarComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { trackEvent } = useAnalytics();
  const [options, setOptions] = useState({});
  const [query, setQuery] = useState('');
  const { loading, error, data } = useAutosuggestApi(CONFIG, options);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const listRef = useRef([]);

  // Aggregate the results in the items, to support keyboard navigation across query and product
  // results lists
  const results = data?.suggestionGroups?.[0];
  const querySuggestions = _.take(results?.querySuggestions, 6);
  const productSuggestions = _.take(results?.searchSuggestions, 6);

  const items = [...querySuggestions, ...productSuggestions];

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    setOptions({ q: query });
  }, [query]);

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
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const {
    getReferenceProps,
    getFloatingProps,
    getItemProps,
  } = useInteractions([role, dismiss, listNav]);

  // Handle user typing in the search input
  function onChange(event) {
    const { value } = event.target;
    setQuery(value);

    if (value) {
      setOpen(true);
      setActiveIndex(0);
    } else {
      setOpen(false);
    }
  }

  // Handle when a query term is selected (using keyboard)/clicked
  const handleQuerySelect = (term) => {
    trackEvent({
      event: 'event_suggest',
      userQuery: query,
      query: term,
    });
    setOpen(false);
    router.push(`/products?q=${term}`);
  };

  // Handle when a product is selected (using keyboard)/clicked
  const handleProductSelect = (pid) => {
    setOpen(false);
    router.push(`/products/${pid}`);
  };

  // Handle when user hits `Enter` in the search input
  // If something is selected in the search results, use that to determine next action
  // If nothing is selected, then do a search using the term entered in the search input
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex != null && items[activeIndex]) {
      const item = items[activeIndex];
      if (activeIndex < querySuggestions.length) {
        handleQuerySelect(item.displayText);
      } else {
        handleProductSelect(item.pid);
      }
      setActiveIndex(null);
      return;
    }

    if (!query) {
      return;
    }

    trackEvent({
      event: 'event_search',
      query,
    });
    setOpen(false);
    router.push(`/products?q=${query}`);
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <div>
        <form className="flex gap-2 border rounded items-center px-3" onSubmit={handleSubmit} ref={refs.setReference}>
          {loading ? <LoaderIcon className="animate-spin" /> : <SearchIcon />}
          <input
            className="w-full p-2 rounded focus:outline-0"
            placeholder="Search for chair, sofa, bed, pillow"
            {...getReferenceProps({
              onChange,
              onFocus() {
                setOpen(!!query);
              },
              value: query,
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
                className="bg-white border rounded-b shadow-md"
                {...getFloatingProps({
                  ref: refs.setFloating,
                  style: {
                    ...floatingStyles,
                    background: '#fff',
                    overflowY: 'auto',
                  },
                })}
              >
                {error && <JsonView value={error} />}
                {
                  data && (() => {
                    return (
                      <div className="flex gap-8 mt-4 rounded">
                        <div className="w-full px-2">
                          <div className="text-sm my-2 uppercase font-bold">
                            Query Suggestions
                          </div>
                          {querySuggestions.length ? (
                            <ul>
                              {querySuggestions.map((suggestion, index) => (
                                <li
                                  key={suggestion.displayText}
                                  className={`
                                    ${activeIndex === index ? 'bg-slate-100' : ''}
                                    list-none p-2 border-b border-slate-200
                                    cursor-pointer hover:bg-slate-100 last:border-b-0
                                  `}
                                  {...getItemProps({
                                    ref(node) {
                                      listRef.current[index] = node;
                                    },
                                    onClick() {
                                      handleQuerySelect(suggestion.displayText);
                                    },
                                  })}
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
                              {productSuggestions.map((suggestion, index) => (
                                <li
                                  key={suggestion.pid}
                                  {...getItemProps({
                                    ref(node) {
                                      // set the correct index, accounting for the query suggestions
                                      // that were already rendered, so when the user is using the
                                      // keyboard to navigate, the correct item is highlighted
                                      listRef.current[index + querySuggestions.length] = node;
                                    },
                                    onClick() {
                                      handleProductSelect(suggestion.pid);
                                    },
                                  })}
                                  className={`
                                  ${activeIndex === index + querySuggestions.length ? 'bg-slate-100' : ''}
                                  list-none px-2 py-1 rounded overflow-hidden
                                  shadow-sm border-b border-slate-200 last:border-b-0`}
                                >
                                  <div className="flex gap-2 items-center cursor-pointer">
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
                                  </div>
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
