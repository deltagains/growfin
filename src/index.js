import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { AuthProvider } from "./context/AuthContext";

import App from "./App";
import configureStore from "./config/configureStore";

import "./polyfills";
import "./assets/base.scss";
import * as serviceWorker from "./serviceWorker";

const store = configureStore();
const rootElement = document.getElementById("root");

// ✅ Ensure the root element exists before rendering
if (rootElement) {
  const root = createRoot(rootElement);

  const renderApp = (Component) => {
    root.render(
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>
            <Component />
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    );
  };

  renderApp(App);

  if (module.hot) {
    module.hot.accept("./App", () => {
      const NextApp = require("./App").default;
      renderApp(NextApp);
    });
  }

  serviceWorker.unregister();
} else {
  console.error(" Could not find root element to mount React app.");
}
