import { StyleSheet } from 'react-native';

export const useHeaderStyle = () => {
  const styles = StyleSheet.create({
    headerRect: {
      width: "100%",
      height: 120,
      backgroundColor: "#161616",
      paddingHorizontal: 24,
      justifyContent: "center",
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      left: 0,
      padding: 4,
      zIndex: 1,
      marginRight: 16,
    },
    headerTextContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      color: "#fff",
      fontSize: 28,
      fontWeight: "bold",
    },
    headerSubtitle: {
      color: "#fff",
      fontSize: 16,
      opacity: 0.8,
    },
  });

  return styles;
}; 