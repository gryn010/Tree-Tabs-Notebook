import * as React from "react";
import { render } from "react-dom";

import App from "./App";
import { createStore } from "redux";
import { tree_reducer } from "./reducers";
import { Provider } from "react-redux";

const store = createStore(
  tree_reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());
const rootElement = document.getElementById("root");
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
