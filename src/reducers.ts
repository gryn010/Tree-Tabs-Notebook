import { combineReducers } from "redux";
import {} from "./actions";

export function tree_reducer(state, action) {
  const findNodeParent = (id) => Object.values(state.nodes).filter((n:any) => n.children.includes(id))[0]['ID'];
  switch (action.type) {
    case "move_node":
      let newState = Object.assign({},state);
      const parentId = findNodeParent(action.source);
      newState.nodes[parentId].children = newState.nodes[parentId].children.filter(n => n != action.source); 
      newState.nodes[action.target].children.push(action.source);
      return newState;
    case "copy_node":
      return Object.assign({});
    default:
      return state;
  }
}
