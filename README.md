# Bloomreach Web Code Samples

This repository holds code samples that demonstrate how to implement the various features offered by the Bloomreach product

## Examples

### Discovery

| Name                                                              | Tech stack                                    | Preview                                                                                                                                                                                                                                                                                                                                                 |
|-------------------------------------------------------------------|-----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Search & Search Usecases](./examples/search/README.md)           | TypeScript, Tailwind CSS, Limitless UI, React | [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/bloomreach/web-code-samples/tree/main/examples/search)                                                                                                                                                                         |
| [Autosuggest](./examples/autosuggest/README.md)                   | TypeScript, Tailwind CSS, React               | [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/bloomreach/web-code-samples/tree/main/examples/autosuggest)                                                                                                                                                                    |
| [Recommendations](./examples/recommendations/README.md)           | JavaScript, Tailwind CSS, React               | [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/bloomreach/web-code-samples/tree/main/examples/recommendations)                                                                                                                                                                |
| [Facets](./examples/facets/README.md)                             | JavaScript, Tailwind CSS, React               | [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/bloomreach/web-code-samples/tree/main/examples/facets)                                                                                                                                                                         |
| [Categories](./examples/categories/README.md)                     | JavaScript, Tailwind CSS, React               | [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/bloomreach/web-code-samples/tree/main/examples/categories)                                                                                                                                                                     |
| [Dynamic grouping](./examples/dynamic-grouping/README.md)         | JavaScript, Tailwind CSS, React               | [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/bloomreach/web-code-samples/tree/main/examples/dynamic-grouping)                                                                                                                                                               |
| [Relevance by segment](./examples/relevance-by-segment/README.md) | JavaScript, Tailwind CSS, React               | [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/bloomreach/web-code-samples/tree/main/examples/relevance-by-segment)                                                                                                                                                           |
| [Visual search](./examples/visual-search/README.md)               | JavaScript, Tailwind CSS, Next.js, React      | [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/bloomreach/web-code-samples/tree/main/examples/visual-search)                                                                                                                                                                  |
| [Multi-language](./examples/multi-language/README.md)             | JavaScript, Tailwind CSS, React               | [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/bloomreach/web-code-samples/tree/main/examples/multi-language)                                                                                                                                                                 |
| [Pixel instrumentation](./examples/pixel/README.md)               | JavaScript, Tailwind CSS, Next.js, React      | [![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/bloomreach/web-code-samples/tree/main/examples/pixel) [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/bloomreach/web-code-samples/tree/main/examples/pixel) |

## Guidelines for writing a code sample

- The code should be optimized to be run in an online code editor, launched with one click from the repository and be able to interactively edit code and run it
- The code should be generic, so you can plug in configuration of any account and they should work.
- The code sample should run with a sample input on load and should not require any user interaction or setup to run it. For example, if it’s a search input, add a default query text in the input, if it is visual search, setup a sample image on load and have some sample images in the sample code directory. This might not be possible in all cases, but try to minimize user setup to run the code sample
- The code sample should be concise. Balance code readability with robustness. The intention of the code samples is to educate about product features, demonstrate it's usage, enable rapid prototyping and not to write production grade code.
- Do not make a code sample that is too complex or has too many dependencies. Keep in mind long term maintenance of a code sample, as the underlying APIs and the libraries are updated over time.
- If a code sample stops working, it should be removed.

## Related resources

- [Bloomreach SDK](https://documentation.bloomreach.com/discovery/docs/discovery-sdks)
- [Limitless Commerce UI Kit](https://bloomreach.github.io/limitless-ui-react)
- [Sample Catalogs](https://github.com/bloomreach/sample-catalogs)

## Contributing

Contributions are welcome. Please read the guidelines above and open a pull request and one of our team members will help get it reviewed and merged
