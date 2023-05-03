import React, { FC, useState, createElement, useEffect, useRef } from "react";
import * as Components from "react-native";
import Emulator from "../components/emulator";
import GenComponent from "../components/gen-component";
import TreeLeaf from "../components/tree-leaf";
import TreeNode from "../components/tree-node";
import ComponentTree from "../components/component-tree";
import { v4 as uuidv4 } from "uuid";
import { checkUntouchable, overlapElement } from "../utils/utils";

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


  useEffect(() => {
    try {
      console.log(compStyles)
      updateEmulator(componentJson);
    } catch {
      console.log('no usable json');
    }
  }, [compStyles, componentJson]);


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
    const compID = 'root';
    const [comp, accordion, editMode] = parseComponent(component.jsx, compID);
    //const comp = <TouchableOpacity style={{"backgroundColor": "black", width: 50, height: 50}} onPress={()=>{console.log('fdsasdf')}}></TouchableOpacity>
    //const reactComponent = createComponent('View', {style:{justifyContent:"center", alignSelf: 'center', height: '100%', width: '100%'}, key: uuidv4()}, comp);
    const reactComponent = (
      <View
        onLayout={(e) => {
          compStyles[compID] = e.nativeEvent.layout
          console.log(e);
          setCompStyles({...compStyles});
        }}
        style= {{
          justifyContent: "center",
          alignSelf: "center",
          height: "100%",
          width: "100%",
        }}
        key={compID}>
        {comp}
      </View>
    );
    const componentTree = createElement(
      TreeNode,
      { name: "tree", key: uuidv4() },
      accordion
    );
    const guiComponent = (
      <View
        style= {{
          justifyContent: "center",
          alignSelf: "center",
          height: "100%",
          width: "100%",
        }}
        key={compID}>
        {editMode}
      </View>
    );

    console.log(reactComponent);
    setComponent(reactComponent);
    setTree(componentTree);
    setGui(guiComponent);
  };

  // DFS alphabetically on json to get the react component
  // TODO: ignore onPress, onHover, etc ...
  const parseComponent = (
    jsonComponent: any | any[], parentID: string
  ): [React.ReactElement, React.ReactElement, React.ReactElement] => {
    const compID = jsonComponent.uid;
    // TODO: fix bahemothon
    if (jsonComponent.children.length == 0) {
      const parentComponent: React.ReactElement = (
        <View
          key={compID}
          >
            {createElement(
              Components[jsonComponent.type],
              { ...jsonComponent.props, key: compID, onLayout: (e) => {
                compStyles[compID] = e.nativeEvent.layout
                console.log(e);
                
                setCompStyles({...compStyles});
              }} 
            )}
        </View>
      );
      const parentTree: React.ReactElement = createElement(TreeLeaf, {
        name: jsonComponent.type,
        key: uuidv4(),
      });
      const parentGui: React.ReactElement = (
        <View
          key={compID}>
            {compStyles[compID] != undefined && <>
  
              {createElement(
                Components[jsonComponent.type],
                { ...jsonComponent.props, style:{...jsonComponent.props.style, ...{width:compStyles[compID].width, height: compStyles[compID].height, flex: undefined}}, key: compID, disabled: true })}
              <TouchableOpacity
                style={{borderWidth: 2,
                      position: 'absolute', 
                      width:compStyles[compID].width, 
                      height: compStyles[compID].height}}>
  
              </TouchableOpacity>
            </>}
          </View>
      );
      return [parentComponent, parentTree, parentGui];
    } else if (typeof jsonComponent.children == "string") {
      const parentComponent: React.ReactElement = (
        <View
          key={compID}>
            {createElement(
              Components[jsonComponent.type],
              { ...jsonComponent.props, key: compID, onLayout: (e) => {
                compStyles[compID] = e.nativeEvent.layout
                console.log(e);
                
                setCompStyles({...compStyles});
              }},
              jsonComponent.children
            )}
        </View>
      );
      const parentTree: React.ReactElement = createElement(TreeLeaf, {
        name: jsonComponent.type,
        key: uuidv4(),
      });
      const parentGui: React.ReactElement = (
        <View
          key={compID}>
            {compStyles[compID] != undefined && <>
  
              {createElement(
                Components[jsonComponent.type],
                { ...jsonComponent.props, style:{...jsonComponent.props.style, ...{width:compStyles[compID].width, height: compStyles[compID].height, flex: undefined}}, key: compID, disabled: true },
                jsonComponent.children
              )}
              <TouchableOpacity
                style={{borderWidth: 2,
                      position: 'absolute', 
                      width:compStyles[compID].width, 
                      height: compStyles[compID].height}}>
  
              </TouchableOpacity>
            </>}
          </View>
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

    // if (Components[jsonComponent.type] == TouchableOpacity) {
    //   parentComponent = (
    //     <TouchableOpacity
    //       {...jsonComponent.props}
    //       key={compID}
    //       onPress={checkUntouchable}
    //     >
    //       {childrenComponent}
    //     </TouchableOpacity>
    //   );
    // } else {
    parentComponent = (
      <View
        key={compID}>
          {createElement(
            Components[jsonComponent.type],
            { ...jsonComponent.props, key: compID, onLayout: (e) => {
              compStyles[compID] = e.nativeEvent.layout
              setCompStyles({...compStyles});
            }},
            childrenComponent
          )}
        </View>
    );
    //}

    let parentTree = createElement(
      TreeNode,
      { name: jsonComponent.type, key: uuidv4() },
      childrenTree
    );

    // might have to do some flex: undefined
    let parentGui = (
      <View
        key={compID}>
          {compStyles[compID] != undefined && <>

            {createElement(
              Components[jsonComponent.type],
              { ...jsonComponent.props, style:{...jsonComponent.props.style, ...{width:compStyles[compID].width, height: compStyles[compID].height, flex: undefined}}, key: compID, disabled: true },
              childrenGui
            )}
            <TouchableOpacity
              style={{borderWidth: 2,
                    position: 'absolute', 
                    width:compStyles[compID].width, 
                    height: compStyles[compID].height}}>

            </TouchableOpacity>
          </>}
        </View>
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
