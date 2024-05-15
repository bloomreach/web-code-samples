# Bloomreach Web Code Samples

This repository holds code samples that demonstrate how to implement the various features offered by the Bloomreach product

## Examples

- [Search](./examples/search/README.md)
- [Autosuggest](./examples/autosuggest/README.md)
- [Recommendations](./examples/recommendations/README.md)
- [Facets](./examples/facets/README.md)
- [Categories](./examples/categories/README.md)
- [Dynamic grouping](./examples/dynamic-grouping/README.md)
- [Relevance by segment](./examples/relevance-by-segment/README.md)
- [Visual search](./examples/visual-search/README.md)

## Guidelines for writing a code sample

- The code should be optimized to be run in an online code editor, launched with one click from the repository and be able to interactively edit code and run it
- The code should be generic, so you can plug in configuration of any account and they should work.
- The code sample should run with a sample input on load and should not require any user interaction or setup to run it. For example, if it’s a search input, add a default query text in the input, if it is visual search, setup a sample image on load and have some sample images in the sample code directory. This might not be possible in all cases, but try to minimize user setup to run the code sample
- The code sample should be concise. Balance code readability with robust code. The intention of the code sample is to educate about the feature and demonstrate it's usage and not to write production grade code.
- Do not make a code sample that is too complex or has too many dependencies. Keep in mind long term maintenance of a code sample, as the underlying APIs and the libraries are updated over time.
- If a code sample stops working, it should be removed.

## Contributing

Contributions are welcome. Please read the guidelines above and open a pull request and one of our team members will help get it reviewed and merged
