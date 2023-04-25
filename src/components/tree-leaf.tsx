import React, { useState } from 'react';
//import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ListItem, Icon } from '@rneui/themed';


const TreeLeaf = (props) => {

  return (
    <ListItem key={props.index} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{props.name}</ListItem.Title>
        
      </ListItem.Content>
    </ListItem>
  );
};


export default TreeLeaf;