import { combineReducers } from "redux";
import {} from "./actions";

export function tree_reducer(state, action) {
  console.log("tree reducer");
  console.log(action);
  return Object.assign({}, state, action);

  switch (action.type) {
    case "move":
      action.nodePaths.map(path => delete state[path]);
      return Object.assign({}, state);
    case "copy":
      return Object.assign({});
  }
}
