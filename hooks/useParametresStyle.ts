import { StyleSheet } from "react-native";

export const useParametresStyle = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    contentContainer: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      padding: 20,
    },
    sectionTitleContainer: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#000",
    },
    sectionSubtitle: {
      fontSize: 16,
      color: "#666",
      marginTop: 5,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    settingLabel: {
      fontSize: 16,
      color: "#000",
      flex: 1,
    },
    settingValue: {
      fontSize: 16,
      color: "#666",
      marginRight: 10,
    },
    toggleSwitch: {
      // Styles pour le switch si nécessaire
    },
  });

  return styles;
}; 