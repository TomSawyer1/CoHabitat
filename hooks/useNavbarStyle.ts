import { StyleSheet } from 'react-native';

export const useNavbarStyle = () => {
  const styles = StyleSheet.create({
    navbarContainer: {
      flexDirection: "column",
      justifyContent: "flex-end",
      backgroundColor: "#000",
    },
    menuItemsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      height: 70,
    },
    menuItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      position: "relative",
    },
    activeCircle: {
      position: "absolute",
      width: 50,
      height: 50,
      borderRadius: 25,
    },
  });

  return styles;
}; 