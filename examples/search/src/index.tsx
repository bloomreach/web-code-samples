import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { LimitlessUIProvider, Theme } from "@bloomreach/limitless-ui-react";

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <LimitlessUIProvider>
      <Theme>
        <App />
      </Theme>
    </LimitlessUIProvider>
  </StrictMode>,
);
