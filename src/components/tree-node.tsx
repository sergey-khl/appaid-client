import React, { useState } from 'react';
//import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ListItem, Icon } from '@rneui/themed';
import { AntDesign  } from '@expo/vector-icons';


const TreeNode = (props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <ListItem.Accordion
      content={
        <>
          <ListItem.Content>
            <ListItem.Title>{props.name}</ListItem.Title>
          </ListItem.Content>
          
        </>
      }
      icon={<AntDesign name="caretdown" size={12} color="black" />}
      isExpanded={expanded}
      onPress={() => {
        setExpanded(!expanded);
      }}
      bottomDivider
      
    >
    {props.children}
    </ListItem.Accordion>
  );
};


export default TreeNode;