import React, { FC, useState, useEffect } from "react";
import { TouchableOpacity, View, TextInput, Text } from "react-native";

interface EditorProps {
  selected: string;
  compStyles: any;
  updateStyles: (width: number, height: number) => void;
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
  }, [props.selected, props.compStyles]);

  useEffect(() => {
    if (props.compStyles[props.selected] != undefined) {
      props.updateStyles(width, height);
    }
  }, [width, height]);
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
      </View>
    )
  );
};

export default Editor;
