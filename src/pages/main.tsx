import React, { FC, useState, createElement, useEffect, useRef } from "react";
import * as ReactDOM from 'react-dom'
import * as Components from "react-native";
import Emulator from "../components/emulator";
import GenComponent from "../components/gen-component";
import TreeLeaf from "../components/tree-leaf";
import TreeNode from "../components/tree-node";
import ComponentTree from "../components/component-tree";
import Selector from "../components/selector";
import Editor from "../components/editor";
import { checkUntouchable, overlapElement } from "../utils/utils";
import styles, { editWidth } from '../styles/styles';

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
  const [compRefs, setCompRefs] = useState({});
  const [compStyles, setCompStyles] = useState({});
  const [selected, setSelected] = useState('root');

  const testRef = useRef(null);

  useEffect(() => {
    try { 
      updateEmulator(componentJson);
    } catch (e) {
      console.log(e)
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
          compStyles[compID] = {...window.getComputedStyle(ReactDOM.findDOMNode(compRefs[compID]))};
          setCompStyles({ ...compStyles });
        }}
        style={{
          width: "100%",
          height: "100%"
        }}
        key={compID}
        ref={node=>compRefs[compID] = node}
      >
        {comp}
      </View>
    );
    const componentTree = createElement(
      TreeNode,
      { name: "tree", key: compID },
      accordion
    );

    const guiComponent = (
      compStyles[compID]!= undefined &&
      <Selector key={compID} uid={compID} selected={selected} compStyles={compStyles} setSelected={()=>setSelected(compID)}>
        {editMode}
      </Selector>
    );

    // console.log(guiComponent);
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
    console.log(jsonComponent)
    const compID = jsonComponent.uid;
    // TODO: fix bahemothon
    if (!jsonComponent.hasOwnProperty('children') || jsonComponent.children.length == 0) {
      const parentComponent: React.ReactElement = (
          createElement(Components[jsonComponent.type], {
            ...jsonComponent.props,
            style: compStyles[compID] != undefined ? {
              ...jsonComponent.props.style,
              ...{
                width: compStyles[compID].width,
                height: compStyles[compID].height,
                left: compStyles[compID].x,
                top: compStyles[compID].y,
                position: 'absolute',
                flex: undefined,
              },
            } : {...jsonComponent.props.style},
            key: compID,
            ref: node => compRefs[compID] = node,
            onLayout:(e) => {
              compStyles[compID] = Object.assign({}, window.getComputedStyle(ReactDOM.findDOMNode(compRefs[compID])));
              setCompStyles({ ...compStyles });
            }
          })
      );
      const parentTree: React.ReactElement = createElement(TreeLeaf, {
        name: jsonComponent.type,
        key: compID,
      });

      const parentGui: React.ReactElement = (
        compStyles[compID]!= undefined &&
        <Selector key={compID} compStyles={compStyles} uid={compID} selected={selected} setSelected={()=>setSelected(compID)}>
              {createElement(Components[jsonComponent.type], {
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
                pointerEvents:'box-none'
              })
          }
        </Selector>
      );
      return [parentComponent, parentTree, parentGui];
    } else if (typeof jsonComponent.children == "string") {
      const parentComponent: React.ReactElement = (
        createElement(
          Components[jsonComponent.type],
          {
            ...jsonComponent.props,
            style: compStyles[compID] != undefined ? {
              ...jsonComponent.props.style,
              ...{
                width: compStyles[compID].width,
                height: compStyles[compID].height,
                position: 'absolute',
                left: compStyles[compID].x,
                top: compStyles[compID].y,
                flex: undefined,
              },
            } : {...jsonComponent.props.style},
            key: compID,
            ref: node => compRefs[compID] = node,
            onLayout:(e) => {
              compStyles[compID] = Object.assign({}, window.getComputedStyle(ReactDOM.findDOMNode(compRefs[compID])));
              setCompStyles({ ...compStyles });
            }
          },
          jsonComponent.children
        )
      );
      const parentTree: React.ReactElement = createElement(TreeLeaf, {
        name: jsonComponent.type,
        key: compID,
      });

      const parentGui: React.ReactElement = (
        compStyles[compID]!= undefined &&
        <Selector compStyles={compStyles} key={compID} uid={compID} selected={selected} setSelected={()=>setSelected(compID)}>
              {createElement(Components[jsonComponent.type], {
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
                pointerEvents:'box-none',
              },
              jsonComponent.children)
          }
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
      createElement(
        Components[jsonComponent.type],
        {
          ...jsonComponent.props,
          key: compID,
          style: compStyles[compID] != undefined ? {
            ...jsonComponent.props.style,
            ...{
              width: compStyles[compID].width,
              height: compStyles[compID].height,
              position: 'absolute',
              left: compStyles[compID].x,
              top: compStyles[compID].y,
              flex: undefined,
            },
          } : {...jsonComponent.props.style},
          ref:(node) => compRefs[compID] = node,
          onLayout:(e) => {
            compStyles[compID] = Object.assign({}, window.getComputedStyle(ReactDOM.findDOMNode(compRefs[compID])));
            setCompStyles({ ...compStyles });
          }
        },
        childrenComponent
      )
    );

    let parentTree = createElement(
      TreeNode,
      { name: jsonComponent.type, key: compID },
      childrenTree
    );

    // might have to do some flex: undefined

    // TODO: extend for any element
    let parentGui = (
      compStyles[compID]!= undefined &&
      <Selector compStyles={compStyles} key={compID} uid={compID} selected={selected} setSelected={()=>{setSelected(compID)}}>
            {createElement(View,
              {
              ...jsonComponent.props,
              style: {
                ...jsonComponent.props.style,
                ...{
                  width: compStyles[compID].width,
                  height: compStyles[compID].height,
                  top: 0,
                  left: 0,
                  flex: undefined,
                },
              },
              pointerEvents:'box-none', 
              key: compID
            },
            childrenGui)
        }
      </Selector>
    );

    return [parentComponent, parentTree, parentGui];
  };

  const updateCompStyles = (width: number, height: number, left: number, top: number) => {
    compStyles[selected].width = width;
    compStyles[selected].height = height;
    compStyles[selected].x = left;
    compStyles[selected].y = top;
    setCompStyles(compStyles);
    console.log(compStyles);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <ComponentTree>{tree}</ComponentTree>
      </View>
      <View style={styles.section}>
        <GenComponent getComponent={getComponent}></GenComponent>
      </View>
      <View style={styles.section}>
        <Editor selected={selected} compStyles={compStyles} updateStyles={updateCompStyles}></Editor>
        <View style={styles.phone}>
          <View style={styles.phoneContainer}>
            <Emulator>{gui}</Emulator>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.phone}>
          <View style={styles.phoneContainer}>
            <Emulator>{component}</Emulator>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

