import { StyleSheet } from "react-native";

const css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    width:'100%',
    alignItems:'center'
  },

  map: {
    height: '95%',
    backgroundColor: 'white',
    zIndex: 0,
    paddingTop:2
  },

  search: {
    height:'5%',
    zIndex: 1
  },
});

export { css };
