import React, {FC, useState, createElement } from 'react';
import * as Components from 'react-native';
import Emulator from '../components/emulator'
import GenComponent from '../components/gen-component';
import { v4 as uuidv4 } from 'uuid';
import purify from 'dompurify';

export default function Main() {
  const View = Components['View'];
  const SafeAreaView = Components['SafeAreaView'];
  const [component, setComponent] = useState(createElement(View, null));

  const getComponent = () => {
    const newComponent = `{
      "jsx": {
      "type": "TouchableOpacity",
      "props": {
      "activeOpacity": 0.8,
      "onPress": "handleFacebookLogin",
      "style": {
      "backgroundColor": "#3b5998",
      "borderRadius": 10,
      "paddingVertical": 10,
      "paddingHorizontal": 20,
      "flexDirection": "row",
      "alignItems": "center",
      "justifyContent": "center",
      "shadowColor": "#000",
      "shadowOffset": {
      "width": 0,
      "height": 1
      },
      "shadowOpacity": 0.3,
      "shadowRadius": 3,
      "elevation": 5
      }
      },
      "children": [
      {
      "type": "Text",
      "props": {
      "style": {
      "color": "#fff",
      "fontSize": 18,
      "fontWeight": "bold",
      "marginRight": 10
      }
      },
      "children": "Connect with Facebook"
      }
      ]
      }
      }`;
    
    updateEmulator(newComponent);
    return newComponent
  }
  const updateEmulator = (component) => {
    const comp = JSON.parse(component); 
    const reactComponent = createElement(View, {style:{justifyContent:"center", alignItems: 'center', height: '100%', width: '100%'}, key: uuidv4()}, parseComponent(comp.jsx));
    setComponent(reactComponent);
  }

  const parseComponent = (jsonComponent) => {
    
    if (jsonComponent.children.length == 0) {
      return createElement(Components[jsonComponent.type], {...jsonComponent.props, key: uuidv4()});
    } else if (typeof jsonComponent.children == "string") {
      return createElement(Components[jsonComponent.type], {...jsonComponent.props, key: uuidv4()}, jsonComponent.children);;
    }

    let childs:React.ReactElement[] = [];

    jsonComponent.children.sort().forEach(child => {
      childs.push(parseComponent(child));
    });
    return createElement(Components[jsonComponent.type], jsonComponent.props, childs);
  }

 

  return (
    <SafeAreaView style={styles.container}>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
