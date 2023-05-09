import { StyleSheet } from "react-native";

export const editWidth = 3;
export const phoneWidth = 0;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignContent: "space-around",
        justifyContent: "space-around",
        flexDirection: "row",
    },
    section: {
        flex: 1,
        padding: 10,
        flexDirection: "row",
    },
    phone: {
        backgroundColor: 'black',
        height: "60%",
        minWidth: 250,
        minHeight: 450,
        aspectRatio: 0.3,
        justifyContent: "center",
        alignItems: "center"
    },
    phoneContainer: {
        // iphone 8, 7, 6, SE
        overflow: "hidden",
        //width: "60%",
        height: "50%",
        minWidth: 200 + phoneWidth*2,
        minHeight: 400 + phoneWidth*2,
        aspectRatio: 0.56,
        margin: -phoneWidth,
        backgroundColor: "#fff",
        borderWidth: phoneWidth,
        borderColor: "black",
        
    },
    selector: {
        borderWidth: editWidth,
        borderColor: "blue",
    },
  });
  