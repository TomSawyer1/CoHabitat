import { StyleSheet } from "react-native";

export const useBatimentsStyle = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    contentContainer: {
      flex: 1,
      paddingTop: 50,
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
    buildingCard: {
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
    buildingHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    buildingName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#000",
    },
    buildingAddress: {
      fontSize: 14,
      color: "#666",
      marginBottom: 10,
    },
    buildingInfo: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 10,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 20,
      marginBottom: 5,
    },
    infoText: {
      fontSize: 14,
      color: "#666",
      marginLeft: 5,
    },
    buildingStats: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: "#eee",
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#000",
    },
    statLabel: {
      fontSize: 12,
      color: "#666",
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 15,
    },
    button: {
      flex: 1,
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    primaryButton: {
      backgroundColor: "#000",
    },
    secondaryButton: {
      backgroundColor: "#f5f5f5",
    },
    primaryButtonText: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "bold",
    },
    secondaryButtonText: {
      color: "#000",
      textAlign: "center",
      fontWeight: "bold",
    },
  });

  return styles;
}; 