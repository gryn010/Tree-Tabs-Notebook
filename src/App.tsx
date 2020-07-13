import * as React from "react";
import "./styles.css";
import { useDispatch } from "react-redux";
import testData from "./data/TreeSample.json";
import Actions from "./actions"
//** Intention: the idea is create a virtualized tree


type NodeData = {
  title: string;
  url?: string;
  comment?: string;
  icon?: string;
};
type TreeDataModel = {
  data: NodeData;
  children: TreeDataModel[];
  expanded: boolean;
};
type LinearTreeRepresentation = {
  data: NodeData;
  depth: number;
  visible: boolean;
}[];

function ConvertDataModelToDepthList(
  input: TreeDataModel,
  depth?: number
): LinearTreeRepresentation {
  let out = [];
  let depthIndex = depth ? depth : 0;
  out.push({ data: input.data, depth: depthIndex, visible: input.expanded });
  // console.log(input.children.length)
  // if (input.expanded)
  input.children.forEach(n => {
    out.push(...ConvertDataModelToDepthList(n, depthIndex + 1));
  });

  return out;
}

// TODO: do a test suite that benchmarks the perf of usage of this treeview to see if it's worth the time spent on it.
export const TreeView : React.FunctionComponent <{ DataModel: TreeDataModel }> = (props) => {
    const linList = ConvertDataModelToDepthList(props.DataModel);
    console.log(linList);
    let items = linList
      // .filter(x => x.visible)
      .map(Node);
    return <ul>{items}</ul>;

}

// rowDom.ondragstart = DD_ondragstart;
// rowDom.ondragend = DD_ondragend;
// rowDom.ondragover = DD_ondragover;
// rowDom.ondragenter = DD_ondragenter;
// rowDom.ondrop = DD_ondrop;

const Node = (props: any) => {
  const dispatch = useDispatch();
  const styling = {
    display: "block",
    marginLeft: ((props.depth + 0) * 20).toString() + "px"
  };
  const itemID = props.id; // this need to be an identifying ID for the Node.
  const dragStartHandler = (event:any) => {
    const dt = event.dataTransfer;
    let modelData = props;
    delete modelData.depth;
    dt.setData("application/json", JSON.stringify(modelData));
    dt.effectAllowed = "copyMove";
    console.log(modelData);
  };
  const dragEnterHandler = (event:any) => {
    event.preventDefault();
  };
  const dragOverHandler = (event:any) => {
    event.preventDefault();
  };
  const dropHandler = (event:React.DragEvent)  => {
    const data = JSON.parse(event.dataTransfer.getData("application/json"));
    console.log("Drop Event");
    console.log(data);
    console.log(this)
    //dispatch(Actions.moveNode(props, data))
    dispatch({type: 'move_node', source: props, target: data})
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
}
// onClick={this.state.visible}

type AppConfig = any;
type AppState = any;

class App extends React.Component<AppConfig, AppState> {
  public constructor(props: AppConfig, context?: any) {
    super(props, context);
  }
  public render() {
    return (
      <div className="App">
        <TreeView DataModel={testData} />
      </div>
    );
  }
}

export default App;
