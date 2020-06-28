// this is the WIP on using REDUX for storing and upating the state and tree datamodel of the app.

import * as React from "react";
import "./styles.css";
import { connect } from "react-redux";
import testData from "/test/TreeSample.json";

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

// rowDom.ondragstart = DD_ondragstart;
// rowDom.ondragenter = DD_ondragenter;

// rowDom.ondragover = DD_ondragover;
// rowDom.ondragend = DD_ondragend;
// rowDom.ondrop = DD_ondrop;

const Node = props => {
  const styling = {
    display: "block",
    marginLeft: ((props.depth + 0) * 20).toString() + "px"
  };
  const s2 = {
    borderWidth: "1px",
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: "3px"
  };
  return (
    <li
      style={styling}
      draggable={true}
      onDragStart={ev => {
        // console.log(ev);
        console.log("Drag Start Event");
      }}
      onDrop={ev => {
        console.log("Drop Event");
        console.log(ev.dataTransfer);
        // props.update({
        //   type: "move",
        //   parent: props,
        //   child: ev.dataTransfer
        // });
      }}
      onDragOver={ev => {
        ev.preventDefault();
      }}
    >
      <input type="checkbox" value={props.visible.toString()} />
      <a href={props.data.url} style={s2}>
        {props.data.title}
      </a>
    </li>
  );
};
// onClick={this.state.visible}
const mapStateToProps = state => ({
  visible: state.visible,
  data: state.data
});

const mapDispatchToProps = dispatch => ({ update: x => dispatch(x) });
const ConnnectedNode = connect(
  mapStateToProps,
  mapDispatchToProps
)(Node);

// TODO: do a test suite that benchmarks the perf of usage of this treeview to see if it's worth the time spent on it.
@connect(
  state => ({}),
  mapDispatchToProps
)
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
