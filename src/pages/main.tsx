import React, {FC, useState} from 'react';
import {AccessibilityInfo, ActivityIndicator, Alert, Animated, AppRegistry, AppState, Appearance, BackHandler, Button, Clipboard, DeviceEventEmitter, Dimensions, DrawerLayoutAndroid, Easing, FlatList, I18nManager, Image, ImageBackground, InputAccessoryView, InteractionManager, Keyboard, KeyboardAvoidingView, LayoutAnimation, Linking, LogBox, Modal, NativeEventEmitter, NativeModules, PanResponder, PermissionsAndroid, PixelRatio, Platform, Pressable, RefreshControl, SafeAreaView, ScrollView, SectionList, Settings, Share, StatusBar, StyleSheet, Switch, Systrace, Text, TextInput, ToastAndroid, Touchable, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, UIManager, Vibration, View, VirtualizedList, YellowBox, findNodeHandle, processColor, useColorScheme, useWindowDimensions} from 'react-native';
import Emulator from '../components/emulator'
import GenComponent from '../components/gen-component';
import purify from 'dompurify';

export default function Main() {
  const [component, setComponent] = useState('');

  const getComponent = () => {
    const newComponent = "";
    setComponent(newComponent);
    updateEmulator();
    return newComponent
  }
  const updateEmulator = () => {
    console.log(Alert);

  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <GenComponent getComponent={getComponent}></GenComponent>
      </View>
      <View style={styles.section}>
        <View style={styles.phoneContainer}>
            <Emulator></Emulator>
        </View>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
