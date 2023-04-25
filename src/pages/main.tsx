import React, {FC, useState, createElement } from 'react';
import * as Components from 'react-native';
import Emulator from '../components/emulator'
import GenComponent from '../components/gen-component';
import TreeLeaf from '../components/tree-leaf';
import TreeNode from '../components/tree-node';
import ComponentTree from '../components/component-tree';
import { v4 as uuidv4 } from 'uuid';


export default function Main() {
  const View = Components['View'];
  const SafeAreaView = Components['SafeAreaView'];
  const [component, setComponent] = useState(createElement(View, null));
  const [tree, setTree] = useState(createElement(TreeNode, {name: 'tree'}, null));

  // call server to get gpt output, if any
  // TODO: add type to json component
  const getComponent = (): any => {
    return fetch('http://127.0.0.1:5000/components', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(json => {
        //console.log(json)
        updateEmulator(json);
      })
      .catch(error => {
        console.error(error);
    });
  }

  // use gpt output to create and render component
  const updateEmulator = (component: any): void => {
    //console.log(component)
    const [comp, accordion] = parseComponent(component.jsx);
    const reactComponent = createElement(View, {style:{justifyContent:"center", alignSelf: 'center', height: '100%', width: '100%'}, key: uuidv4()}, comp);
    const componentTree = createElement(TreeNode, {name: "tree",key: uuidv4()}, accordion);

    setComponent(reactComponent);
    setTree(componentTree);
  }

  // DFS alphabetically on json to get the react component
  // TODO: ignore onPress, onHover, etc ...
  const parseComponent = (jsonComponent: any): [React.ReactElement, React.ReactElement] => {
    
    if (jsonComponent.children.length == 0) {
      return [createElement(Components[jsonComponent.type], {...jsonComponent.props, key: uuidv4()}), createElement(TreeLeaf, {name: jsonComponent.type,key: uuidv4()})];
    } else if (typeof jsonComponent.children == "string") {
      return [createElement(Components[jsonComponent.type], {...jsonComponent.props, key: uuidv4()}, jsonComponent.children), createElement(TreeLeaf, {name: jsonComponent.type,key: uuidv4()})];
    }

    let childrenComponent:React.ReactElement[] = [];
    let childrenTree:React.ReactElement[] = [];

    jsonComponent.children.sort().forEach(child => {
      const [compChild, treeChild] = parseComponent(child)
      childrenComponent.push(compChild);
      childrenTree.push(treeChild);
    });
    return [createElement(Components[jsonComponent.type], {...jsonComponent.props, key: uuidv4()}, childrenComponent), createElement(TreeNode, {name: jsonComponent.type, key: uuidv4()}, childrenTree)];
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
        <View style={styles.phoneContainer}>
            <Emulator>{component}</Emulator>
        </View>
      </View>
      
    </SafeAreaView>
  );
}

const styles = Components['StyleSheet'].create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: 'space-around',
    justifyContent: 'space-around',
    flexDirection: 'row',
    zIndex: 1,
  },
  section: {
    flex: 1
  },
  phoneContainer: {
    // iphone 8, 7, 6, SE
    overflow: 'hidden',
    width: '50%',
    aspectRatio: 0.56,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'black',
    
  },
});
