import React, { FC, useState, useEffect } from "react";
import { TouchableOpacity, View, TextInput, Text } from "react-native";

interface EditorProps {
  selected: string;
  compStyles: any;
  updateStyles: (width: number, height: number, left: number, top: number) => void;
}

const Editor: FC<EditorProps> = (props) => {
  const [width, setWidth] = useState<number>(
    props.compStyles[props.selected]
      ? props.compStyles[props.selected].width
      : 0
  );
  const [height, setHeight] = useState<number>(
    props.compStyles[props.selected]
      ? props.compStyles[props.selected].height
      : 0
  );
  const [left, setLeft] = useState<number>(
    props.compStyles[props.selected]
      ? props.compStyles[props.selected].x
      : 0
  );
  const [top, setTop] = useState<number>(
    props.compStyles[props.selected]
      ? props.compStyles[props.selected].y
      : 0
  );
   const changeWidth = (w) => {
    if (/^[0-9]+([.][0-9]*)?$/.test(w)) {
      setWidth(parseFloat(w));
    }
  };
  const changeHeight = (h) => {
    if (/^[0-9]+([.][0-9]*)?$/.test(h)) {
      setHeight(parseFloat(h));
    }
  };
  const changeLeft = (l) => {
    if (/^[0-9]+([.][0-9]*)?$/.test(l)) {
      setLeft(parseFloat(l));
    }
  };
  const changeTop = (t) => {
    if (/^[0-9]+([.][0-9]*)?$/.test(t)) {
      setTop(parseFloat(t));
    }
  };

  useEffect(() => {
    setWidth(
      props.compStyles[props.selected]
        ? props.compStyles[props.selected].width
        : 0
    );
    setHeight(
      props.compStyles[props.selected]
        ? props.compStyles[props.selected].height
        : 0
    );
    setLeft(
      props.compStyles[props.selected]
        ? props.compStyles[props.selected].x
        : 0
    );
    setTop(
      props.compStyles[props.selected]
        ? props.compStyles[props.selected].y
        : 0
    );
  }, [props.selected, props.compStyles]);

  useEffect(() => {
    if (props.compStyles[props.selected] != undefined) {
      props.updateStyles(width, height, left, top);
    }
  }, [width, height, left, top]);

  return (
    props.compStyles[props.selected] != undefined && (
      <View>
        <View>
          <Text>Width:</Text>
          <TextInput
            selectTextOnFocus
            style={{}}
            keyboardType="numeric"
            onChangeText={changeWidth}
            value={width.toString()}
          />
        </View>
        <View>
          <Text>Height:</Text>
          <TextInput
            selectTextOnFocus
            style={{}}
            keyboardType="numeric"
            onChangeText={changeHeight}
            value={height.toString()}
          />
        </View>
        <View>
          <Text>Left:</Text>
          <TextInput
            selectTextOnFocus
            style={{}}
            keyboardType="numeric"
            onChangeText={changeLeft}
            value={left.toString()}
          />
        </View>
        <View>
          <Text>Top:</Text>
          <TextInput
            selectTextOnFocus
            style={{}}
            keyboardType="numeric"
            onChangeText={changeTop}
            value={top.toString()}
          />
        </View>
      </View>
    )
  );
};

export default Editor;
