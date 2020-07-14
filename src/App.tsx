import * as React from "react";
import "./styles.css";
import { useDispatch, useSelector, connect } from "react-redux";
import Actions from "./actions"
//** Intention: the idea is create a virtualized tree


// quick hack for now, this mutate the array. 
function addNodeDepth(arr_, root){
  let arr = Object.assign({}, arr_);
  function updateNodeDepths(arr, node_id, depth = 0) {
    if (!arr[node_id].visible) arr[node_id].visible = true;
    arr[node_id].depth = depth;
    arr[node_id].children.map(id => updateNodeDepths(arr, id, depth + 1));
  }
  updateNodeDepths(arr, root);
  return arr;
}

function sortNodes(arr, root){
  let nodes = [];
  nodes.push(arr[root])
  if(arr[root].children.length > 0)
  arr[root].children.map(id => {nodes.push(... sortNodes(arr,id))})  
  return nodes;
}
// TODO: do a test suite that benchmarks the perf of usage of this treeview to see if it's worth the time spent on it.
export const TreeView: React.FunctionComponent<any> = (props) => {
  console.log('TreeView render triggered')
  const rootNode = props.rootNode;

  const nodesWithDepth = addNodeDepth(props.nodes, rootNode); 
  // .filter(x => x.visible)
  let items = sortNodes(nodesWithDepth, rootNode).map(Node);
  return <ul><>{items}</></ul>;

}
export const RTreeView = connect(
  (state: any) => ({
    nodes: state.nodes,
    rootNode: state.rootNode
  }))(TreeView);

const Node = (props: any) => {
  const dispatch = useDispatch();
  const styling = {
    display: "block",
    marginLeft: ((props.depth + 0) * 20).toString() + "px"
  };
  const itemID = props.ID; // this need to be an identifying ID for the Node.
  const dragStartHandler = (event: any) => {
    const dt = event.dataTransfer;
    let modelData = props;
    delete modelData.depth;
    dt.setData("application/json", JSON.stringify(modelData));
    dt.effectAllowed = "copyMove";
    console.log(modelData);
  };
  const dragEnterHandler = (event: any) => {
    event.preventDefault();
  };
  const dragOverHandler = (event: any) => {
    event.preventDefault();
  };
  const dropHandler = (event: React.DragEvent) => {
    const data = JSON.parse(event.dataTransfer.getData("application/json"));
    //dispatch(Actions.moveNode(props, data))
    dispatch({ type: 'move_node', source: data.ID, target: props.ID })
    event.preventDefault();
  };

  return (
    <li
      className="nodeItem"
      style={styling}
      draggable={true}
      key={itemID}
      onDragStart={dragStartHandler}
      onDragEnter={dragEnterHandler}
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
    >
      <input type="checkbox" value={props.visible.toString()} />
      <a href={props.data.url}>{props.data.title}</a>
    </li>
  );
};
// const CNode = connect((state:any, p:any) => ({data:state.nodes[p.ID].data}))(Node);

type AppConfig = any;
type AppState = any;

class App extends React.Component<AppConfig, AppState> {
  public constructor(props: AppConfig, context?: any) {
    super(props, context);
  }
  public render() {
    return (
      <div className="App">
        {/* <TreeView DataModel={null} /> */}
        <RTreeView />
      </div>
    );
  }
}

export default App;
