# Bloomreach - Visual search example

This example demonstrates how to setup Bloomreach's visual search feature. See `config.ts` file to configure it to run for your account and catalog

## How to use

Download the example or clone the repo

Install it and run:

```bash
npm ci
npm run dev
```

or:

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/devbox/github/bloomreach/web-code-samples/tree/main/examples/visual-search)

## Troubleshooting

### Command does not support workspaces.

If you see this error when you run `npm run dev`
```
npm error code ENOWORKSPACES
npm error This command does not support workspaces.
```

run `npx next telemetry disable` to fix it
