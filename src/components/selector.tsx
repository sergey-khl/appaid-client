import React, { FC } from "react";
import {TouchableOpacity} from "react-native";
import styles, { editWidth } from '../styles/styles';

interface SelectorProps {
    uid: React.Key;
    selected: string;
    children: React.ReactNode;
    compStyles: any;
    setSelected: ()=>void;
};

const Selector: FC<SelectorProps> = (props) => {
    return(
        <TouchableOpacity
            style={props.uid == 'root' ? {width: '100%', height: '100%'} : 
                [{position:'absolute'}, props.selected == props.uid ? 
                {...styles.selector, width: props.compStyles[props.uid].width + 2*editWidth, height: props.compStyles[props.uid].height + 2*editWidth, left: props.compStyles[props.uid].x - editWidth, top: props.compStyles[props.uid].y - editWidth} : 
                {width: props.compStyles[props.uid].width, height: props.compStyles[props.uid].height, left: props.compStyles[props.uid].x , top: props.compStyles[props.uid].y}]}
          onPress={props.setSelected}
        >
            {props.children}
        </TouchableOpacity>
    );
}

export default Selector;