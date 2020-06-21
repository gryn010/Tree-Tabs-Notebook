import * as React from "react";
import "./styles.css";
import testData from "/TreeSample.json";

/** Intention: the idea is create a virtualized tree
 *
 */

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
export class TreeView extends React.Component<
  { DataModel: TreeDataModel },
  any
> {
  public render() {
    const linList = ConvertDataModelToDepthList(this.props.DataModel);
    console.log(linList);
    let items = linList
      // .filter(x => x.visible)
      .map(Node);
    return <ul>{items}</ul>;
  }
}

// rowDom.ondragstart = DD_ondragstart;
// rowDom.ondragend = DD_ondragend;
// rowDom.ondragover = DD_ondragover;
// rowDom.ondragenter = DD_ondragenter;
// rowDom.ondrop = DD_ondrop;

function Node(x) {
  const styling = {
    display: "block",
    marginLeft: ((x.depth + 0) * 20).toString() + "px"
  };
  const s2 = {
    borderWidth: "1px",
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: "3px"
  };
  const itemID = x.id;
  return (
    <li
      style={styling}
      draggable={true}
      key={itemID}
      onDragStart={event => {
        console.log(event);
        const dt = event.dataTransfer;
        const modelData = itemID;
        dt.setData("application/json", JSON.stringify(modelData));
      }}
    >
      <input type="checkbox" value={x.visible.toString()} />
      <a href={x.data.url} style={s2}>
        {x.data.title}
      </a>
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
