import { StyleSheet } from 'react-native';
import { EdgeInsets } from "react-native-safe-area-context";

export const useHomeStyle = (insets: EdgeInsets) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
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
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 20,
    },
  });

  return styles;
}; 