import { StyleSheet } from 'react-native';

export const sidebarWidth = 250;

export const useSidebarStyle = () => {
  const styles = StyleSheet.create({
    sidebar: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: sidebarWidth,
      backgroundColor: "#000",
      paddingTop: 50,
      paddingHorizontal: 20,
      zIndex: 50,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    appTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 30,
      color: "#fff",
    },
    menuContainer: {
      // Styles pour le conteneur des éléments de menu
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15,
    },
    menuItemText: {
      fontSize: 18,
      marginLeft: 15,
      color: "#fff",
    },
  });

  return styles;
}; 