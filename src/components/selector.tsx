import React, { FC } from "react";
import {TouchableOpacity} from "react-native";
import styles from '../styles/styles';

interface SelectorProps {
    uid: React.Key;
    selected: string;
    children: React.ReactNode;
    setSelected: ()=>void;
};

const Selector: FC<SelectorProps> = (props) => {
    return(
        <TouchableOpacity
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