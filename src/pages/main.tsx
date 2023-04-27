import React, { FC, useState, createElement } from "react";
import * as Components from "react-native";
import Emulator from "../components/emulator";
import GenComponent from "../components/gen-component";
import TreeLeaf from "../components/tree-leaf";
import TreeNode from "../components/tree-node";
import ComponentTree from "../components/component-tree";
import { v4 as uuidv4 } from "uuid";
import { checkUntouchable } from "../utils/utils";

export default function Main() {
  const View = Components["View"];
  const SafeAreaView = Components["SafeAreaView"];
  const TouchableOpacity = Components["TouchableOpacity"];
  const [gui, setGui] = useState(<></>);
  const [component, setComponent] = useState(<></>);
  const [tree, setTree] = useState(
    createElement(TreeNode, { name: "tree" }, null)
  );

  // call server to get gpt output, if any
  // TODO: add type to json component
  const getComponent = (): any => {
    return fetch("http://127.0.0.1:5000/components", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        //console.log(json)
        updateEmulator(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // use gpt output to create and render component
  const updateEmulator = (component: any): void => {
    //console.log(component)
    const [comp, accordion, editMode] = parseComponent(component.jsx);
    //const comp = <TouchableOpacity style={{"backgroundColor": "black", width: 50, height: 50}} onPress={()=>{console.log('fdsasdf')}}></TouchableOpacity>
    //const reactComponent = createComponent('View', {style:{justifyContent:"center", alignSelf: 'center', height: '100%', width: '100%'}, key: uuidv4()}, comp);
    const reactComponent = createElement(
      View,
      {
        style: {
          justifyContent: "center",
          alignSelf: "center",
          height: "100%",
          width: "100%",
        },
        key: uuidv4(),
      },
      comp
    );
    const componentTree = createElement(
      TreeNode,
      { name: "tree", key: uuidv4() },
      accordion
    );
    const guiComponent = createElement(
      View,
      {
        style: {
          justifyContent: "center",
          alignSelf: "center",
          height: "100%",
          width: "100%",
        },
        key: uuidv4(),
      },
      editMode
    );

    console.log(guiComponent);
    setComponent(reactComponent);
    setTree(componentTree);
    setGui(guiComponent);
  };

  // DFS alphabetically on json to get the react component
  // TODO: ignore onPress, onHover, etc ...
  const parseComponent = (
    jsonComponent: any | any[]
  ): [React.ReactElement, React.ReactElement, React.ReactElement] => {
    // TODO: fix bahemothon
    if (jsonComponent.children.length == 0) {
      const parentComponent: React.ReactElement = createElement(
        Components[jsonComponent.type],
        { ...jsonComponent.props, key: uuidv4() }
      );
      const parentTree: React.ReactElement = createElement(TreeLeaf, {
        name: jsonComponent.type,
        key: uuidv4(),
      });
      const parentGui: React.ReactElement = (
        createElement(
          Components[jsonComponent.type],
          { ...jsonComponent.props, key: uuidv4() },
          <TouchableOpacity style={{
            flex: 1,
            borderWidth: 3,
            //backgroundColor: "rgba(52, 52, 52, 0)",
          }}
          key={uuidv4()}
          onPress={checkUntouchable}>
          </TouchableOpacity>
        )
      );
      return [parentComponent, parentTree, parentGui];
    } else if (typeof jsonComponent.children == "string") {
      const parentComponent: React.ReactElement = createElement(
        Components[jsonComponent.type],
        { ...jsonComponent.props, key: uuidv4() },
        jsonComponent.children
      );
      const parentTree: React.ReactElement = createElement(TreeLeaf, {
        name: jsonComponent.type,
        key: uuidv4(),
      });
      const parentGui: React.ReactElement = (
        createElement(
          Components[jsonComponent.type],
          { ...jsonComponent.props, key: uuidv4() },
          <TouchableOpacity style={{
            flex: 1,

            borderWidth: 3,
            //backgroundColor: "rgba(52, 52, 52, 0)",
          }}
          key={uuidv4()}
          onPress={checkUntouchable}>
            {jsonComponent.children}
          </TouchableOpacity>
        )
      );
      return [parentComponent, parentTree, parentGui];
    }

    let childrenComponent: React.ReactElement[] = [];
    let childrenTree: React.ReactElement[] = [];
    let childrenGui: React.ReactElement[] = [];
    const onPresss = (e) => {
      console.log("e");
    };

    jsonComponent.children.sort().forEach((child) => {
      const [compChild, treeChild, guiChild] = parseComponent(child);
      childrenComponent.push(compChild);
      childrenTree.push(treeChild);
      childrenGui.push(guiChild);
    });
    let parentComponent: React.ReactElement;

    if (Components[jsonComponent.type] == TouchableOpacity) {
      parentComponent = (
        <TouchableOpacity
          {...jsonComponent.props}
          key={uuidv4()}
          onPress={checkUntouchable}
        >
          {childrenComponent}
        </TouchableOpacity>
      );
      //parentComponent = createComponent('TouchableOpacity', {style:{view: 1, borderWidth: 3}, onPress:{checkUntouchable}, key: uuidv4()}, childrenComponent)
    } else {
      parentComponent = createElement(
        Components[jsonComponent.type],
        { ...jsonComponent.props, key: uuidv4() },
        childrenComponent
      );
      //parentComponent = createComponent(jsonComponent.type, {style:{view: 1, borderWidth: 3}, key: uuidv4()}, childrenComponent)
    }

    let parentTree = createElement(
      TreeNode,
      { name: jsonComponent.type, key: uuidv4() },
      childrenTree
    );

    //let parentGui = createComponent('TouchableOpacity', {style:{view: 1, borderWidth: 3}, key: uuidv4()}, childrenGui)
    let parentGui = (
      createElement(
        Components[jsonComponent.type],
        { ...jsonComponent.props, key: uuidv4() },
        <TouchableOpacity style={{
          flex: 1,
          borderWidth: 3,
          //backgroundColor: "rgba(52, 52, 52, 0)",
        }}
        key={uuidv4()}
        onPress={checkUntouchable}>
          {childrenGui}
        </TouchableOpacity>
      )
    );

    return [parentComponent, parentTree, parentGui];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <ComponentTree>{tree}</ComponentTree>
      </View>
      <View style={styles.section}>
        <GenComponent getComponent={getComponent}></GenComponent>
      </View>
      <View style={styles.section}>
        <View style={styles.phoneContainer}>
          <Emulator>{gui}</Emulator>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.phoneContainer}>
          <Emulator>{component}</Emulator>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = Components["StyleSheet"].create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: "space-around",
    justifyContent: "space-around",
    flexDirection: "row",
    zIndex: 1,
  },
  section: {
    flex: 1,
  },
  phoneContainer: {
    // iphone 8, 7, 6, SE
    overflow: "hidden",
    width: "50%",
    aspectRatio: 0.56,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "black",
  },
  selector: {
    flex: 1,
    borderColor: "green",
    borderWidth: 3,
  },
});
