import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignContent: "space-around",
        justifyContent: "space-around",
        flexDirection: "row",
        zIndex: 1,
    },
    section: {
        flex: 1,
        flexDirection: "row",
    },
    phoneContainer: {
        // iphone 8, 7, 6, SE
        overflow: "hidden",
        width: "60%",
        aspectRatio: 0.5,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "black",
    },
    selector: {
        borderWidth: 1, 
        borderColor: "blue",
    },
  });
  