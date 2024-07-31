# Bloomreach - Pixel instrumentation example

This example demonstrates how to instrument pixel across a simple storefront.

- See `src/config.js` file to configure it to run for your account and catalog
- See `src/hooks/useAnalytics.js` file to see how the pixel events are formatted
- Search for the term `trackEvent` to see how the pixel events are instrumented across the sourcecode
- Note: On codesandbox, because of how the preview is rendered in the iframe, the pixel script is not able to set the `_br_uid_2` cookie on the right domain, so you will not see the cookie sent in the pixel events. For the cookie to be set and sent in the pixel events, open the codesandbox preview in a new tab or run the example locally

## How to use

Download the example or clone the repo

Install it and run:

```bash
npm ci
npm run dev
```

or:

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/devbox/github/bloomreach/web-code-samples/tree/main/examples/pixel)
