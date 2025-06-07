import { StyleSheet } from 'react-native';

export const useHomeStyle = () => {
  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-end",
    },
    mainContent: {
      flex: 1,
      paddingTop: 100,
      paddingBottom: 0,
      paddingHorizontal: 20,
    },
    barContainer: {
      position: "absolute",
      width: "100%",
      top: 0,
      left: 0,
      zIndex: 10,
      alignItems: "center",
    },
    bar: {
      width: "100%",
      height: 100,
      backgroundColor: "#000",
    },
    headerTitleContainer: {
      position: "absolute",
      top: 35,
      left: 0,
      width: "100%",
      zIndex: 20,
      alignItems: "center",
    },
    headerTitle: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "bold",
    },
  });

  return styles;
}; 