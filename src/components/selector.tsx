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
                [{position:'relative'}, props.selected == props.uid ? 
                {...styles.selector, width: props.compStyles[props.uid].width, height: props.compStyles[props.uid].height, left: props.compStyles[props.uid].x - editWidth, top: props.compStyles[props.uid].y-editWidth, marginTop: props.compStyles[props.uid].marginTop - editWidth, marginBottom: props.compStyles[props.uid].marginBottom-editWidth, marginLeft: props.compStyles[props.uid].marginLeft-editWidth, marginRight: props.compStyles[props.uid].marginRight-editWidth} : 
                {width: props.compStyles[props.uid].width, height: props.compStyles[props.uid].height, left: props.compStyles[props.uid].x , top: props.compStyles[props.uid].y, marginTop: props.compStyles[props.uid].marginTop, marginBottom: props.compStyles[props.uid].marginBottom, marginLeft: props.compStyles[props.uid].marginLeft, marginRight: props.compStyles[props.uid].marginRight}]}
          onPress={props.setSelected}
        >
            {props.children}
        </TouchableOpacity>
    );
}

export default Selector;