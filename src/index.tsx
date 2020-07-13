import * as React from "react";
import { render } from "react-dom";

import App from "./App";
import { createStore } from "redux";
import { tree_reducer } from "./reducers";
import { Provider } from "react-redux";

const store = createStore(tree_reducer);
const rootElement = document.getElementById("root");
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
