import React, { useState } from 'react';
//import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

  
const ComponentTree = (props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {props.children}
    </>
  );
};


export default ComponentTree;