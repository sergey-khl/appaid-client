import React, {FC, useState} from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

interface GenComponentProp {
  getComponent: () => string;
};

const GenComponent: FC<GenComponentProp> = ({getComponent}) => {
  

  return (
    <Pressable style={styles.genComponent} onPress={getComponent} >
      <Text style={{color: 'white'}}>Generate Component</Text>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  genComponent: {
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    elevation: 3,
    backgroundColor: 'blue',
  },
})

export default GenComponent;
