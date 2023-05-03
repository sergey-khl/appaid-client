import React, { FC } from "react";
import {TouchableOpacity} from "react-native";
import { v4 as uuidv4 } from "uuid";
import styles from '../styles/styles';

interface SelectorProp {
    uid: React.Key;
    selected: string;
    children: React.ReactNode;
    setSelected: ()=>void;
};

const Selector: FC<SelectorProp> = (props) => {
    return(
        <TouchableOpacity
          key={props.uid}
          style={[{position:'absolute'},
                    props.selected == props.uid ? styles.selector : {},
                    props.uid == 'root' ? {width: '100%', height: '100%'} : {}]}
          onPress={props.setSelected}
        >
            {props.children}
        </TouchableOpacity>
    );
}

export default Selector;