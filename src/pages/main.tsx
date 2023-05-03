import React, { FC, useState, createElement, useEffect, useRef } from "react";
import * as Components from "react-native";
import Emulator from "../components/emulator";
import GenComponent from "../components/gen-component";
import TreeLeaf from "../components/tree-leaf";
import TreeNode from "../components/tree-node";
import ComponentTree from "../components/component-tree";
import Selector from "../components/selector";
import { v4 as uuidv4 } from "uuid";
import { checkUntouchable, overlapElement } from "../utils/utils";
import styles from '../styles/styles';

export default function Main() {
  const View = Components["View"];
  const SafeAreaView = Components["SafeAreaView"];
  const TouchableOpacity = Components["TouchableOpacity"];
  const [componentJson, setComponentJson] = useState({});
  const [gui, setGui] = useState(<></>);
  const [component, setComponent] = useState(<></>);
  const [tree, setTree] = useState(
    createElement(TreeNode, { name: "tree" }, null)
  );
  const [compStyles, setCompStyles] = useState({});
  const [selected, setSelected] = useState('root')

  useEffect(() => {
    try {
      console.log(compStyles);
      updateEmulator(componentJson);
    } catch {
      console.log("no usable json");
    }
  }, [compStyles, componentJson, selected]);


  // call server to get gpt output, if any
  // TODO: add type to json component
  const getComponent = (): any => {
    return fetch("http://127.0.0.1:5000/components", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        setComponentJson(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // use gpt output to create and render component
  const updateEmulator = (component: any): void => {
    // gotta change prob to make more general
    const compID = "root";
    const [comp, accordion, editMode] = parseComponent(component.jsx, compID);
    //const comp = <TouchableOpacity style={{"backgroundColor": "black", width: 50, height: 50}} onPress={()=>{console.log('fdsasdf')}}></TouchableOpacity>
    //const reactComponent = createComponent('View', {style:{justifyContent:"center", alignSelf: 'center', height: '100%', width: '100%'}, key: uuidv4()}, comp);
    const reactComponent = (
      <View
        onLayout={(e) => {
          compStyles[compID] = e.nativeEvent.layout;
          console.log(e);
          setCompStyles({ ...compStyles });
        }}
        style={{
          flex:1,
        }}
        key={compID}
      >
        {comp}
      </View>
    );
    const componentTree = createElement(
      TreeNode,
      { name: "tree", key: uuidv4() },
      accordion
    );

    const guiComponent = (
      <Selector uid={compID} selected={selected} setSelected={()=>setSelected(compID)}>
        {editMode}
      </Selector>
    );

    console.log(reactComponent);
    setComponent(reactComponent);
    setTree(componentTree);
    setGui(guiComponent);
  };

  // DFS alphabetically on json to get the react component
  // TODO: ignore onPress, onHover, etc ...
  const parseComponent = (
    jsonComponent: any | any[],
    parentID: string
  ): [React.ReactElement, React.ReactElement, React.ReactElement] => {
    const compID = jsonComponent.uid;
    // TODO: fix bahemothon
    if (jsonComponent.children.length == 0) {
      const parentComponent: React.ReactElement = (
        <View
          key={compID}
          style={{
            position: "absolute",
          }}
        >
          {createElement(Components[jsonComponent.type], {
            ...jsonComponent.props,
            key: compID,
            onLayout: (e) => {
              compStyles[compID] = e.nativeEvent.layout;

              setCompStyles({ ...compStyles });
            },
          })}
        </View>
      );
      const parentTree: React.ReactElement = createElement(TreeLeaf, {
        name: jsonComponent.type,
        key: compID,
      });

      const parentGui: React.ReactElement = (
        <Selector uid={compID} selected={selected} setSelected={()=>setSelected(compID)}>
          {compStyles[compID] != undefined && (
              createElement(Components[jsonComponent.type], {
                ...jsonComponent.props,
                style: {
                  ...jsonComponent.props.style,
                  ...{
                    width: compStyles[compID].width,
                    height: compStyles[compID].height,
                    flex: undefined,
                  },
                },
                key: compID,
              })
          )}
        </Selector>
      );
      return [parentComponent, parentTree, parentGui];
    } else if (typeof jsonComponent.children == "string") {
      const parentComponent: React.ReactElement = (
        <View
          key={compID}
          style={{
            position: "absolute",
          }}>
          {createElement(
            Components[jsonComponent.type],
            {
              ...jsonComponent.props,
              key: compID,
              onLayout: (e) => {
                compStyles[compID] = e.nativeEvent.layout;

                setCompStyles({ ...compStyles });
              },
            },
            jsonComponent.children
          )}
        </View>
      );
      const parentTree: React.ReactElement = createElement(TreeLeaf, {
        name: jsonComponent.type,
        key: compID,
      });

      const parentGui: React.ReactElement = (
        <Selector uid={compID} selected={selected} setSelected={()=>setSelected(compID)}>
          {compStyles[compID] != undefined && (
              createElement(Components[jsonComponent.type], {
                ...jsonComponent.props,
                style: {
                  ...jsonComponent.props.style,
                  ...{
                    width: compStyles[compID].width,
                    height: compStyles[compID].height,
                    flex: undefined,
                  },
                },
                key: compID,
              },
              jsonComponent.children)
          )}
        </Selector>
      );

      return [parentComponent, parentTree, parentGui];
    }

    let childrenComponent: React.ReactElement[] = [];
    let childrenTree: React.ReactElement[] = [];
    let childrenGui: React.ReactElement[] = [];

    jsonComponent.children.sort().forEach((child) => {
      const [compChild, treeChild, guiChild] = parseComponent(child, compID);
      childrenComponent.push(compChild);
      childrenTree.push(treeChild);
      childrenGui.push(guiChild);
    });
    let parentComponent: React.ReactElement;

    parentComponent = (
      <View key={compID} style={{position: 'absolute'}}>
        {createElement(
          Components[jsonComponent.type],
          {
            ...jsonComponent.props,
            key: compID,
            onLayout: (e) => {
              compStyles[compID] = e.nativeEvent.layout;
              setCompStyles({ ...compStyles });
            },
          },
          childrenComponent
        )}
      </View>
    );

    let parentTree = createElement(
      TreeNode,
      { name: jsonComponent.type, key: compID },
      childrenTree
    );

    // might have to do some flex: undefined
    let parentGui = (
      <Selector uid={compID} selected={selected} setSelected={()=>{console.log(compID);setSelected(compID)}}>
        {compStyles[compID] != undefined && (
          // TODO: extend for any element
            createElement(View, {
              ...jsonComponent.props,
              style: {
                ...jsonComponent.props.style,
                ...{
                  width: compStyles[compID].width,
                  height: compStyles[compID].height,
                  flex: undefined,
                },
              },
              key: compID,
            },
            childrenGui)
        )}
      </Selector>
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

