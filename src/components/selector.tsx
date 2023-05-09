import React, { FC } from "react";
import {TouchableOpacity} from "react-native";
import styles, { editWidth } from '../styles/styles';
import { getNumber } from "../utils/utils";

interface SelectorProps {
    uid: React.Key;
    selected: string;
    children: React.ReactNode;
    compStyles: any;
    setSelected: ()=>void;
};

const Selector: FC<SelectorProps> = (props) => {

    

    const getStyles = () => {
        const width = getNumber(props.compStyles[props.uid].width);
        const height = getNumber(props.compStyles[props.uid].height);
        const left = getNumber(props.compStyles[props.uid].x);
        const top = getNumber(props.compStyles[props.uid].y);
        const marginTop = getNumber(props.compStyles[props.uid].marginTop);
        const marginBottom = getNumber(props.compStyles[props.uid].marginBottom);
        const marginLeft = getNumber(props.compStyles[props.uid].marginLeft);
        const marginRight = getNumber(props.compStyles[props.uid].marginRight);

        if (props.selected == props.uid) {
            return {...styles.selector, 
                width: width + 2*editWidth, 
                height: height + 2*editWidth, 
                left: left, 
                top: top, 
                marginTop: marginTop - editWidth, 
                marginBottom: marginBottom-editWidth, 
                marginLeft: marginLeft-editWidth, 
                marginRight: marginRight-editWidth}
        } else {
            return {width: width, 
                height: height, 
                left: left , 
                top: top, 
                marginTop: marginTop,
                marginBottom: marginBottom,
                marginLeft: marginLeft, 
                marginRight: marginRight}
        }
    }
    
    return(
        <TouchableOpacity
            style={props.uid == 'root' ? {width: '100%', height: '100%'} : 
                [{position:'relative'}, getStyles()]}
          onPress={props.setSelected}
        >
            {props.children}
        </TouchableOpacity>
    );
}

export default Selector;