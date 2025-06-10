import { StyleSheet } from "react-native";

export const useMonBatimentStyle = () => {
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
    buildingCard: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buildingName: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#000",
      marginBottom: 10,
    },
    buildingAddress: {
      fontSize: 16,
      color: "#666",
      marginBottom: 20,
    },
    infoSection: {
      marginBottom: 20,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#000",
      marginBottom: 15,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    infoIcon: {
      width: 40,
      alignItems: "center",
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 14,
      color: "#666",
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 16,
      color: "#000",
      fontWeight: "500",
    },
    contactSection: {
      backgroundColor: "#f8f8f8",
      borderRadius: 10,
      padding: 15,
      marginTop: 10,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#000",
      marginBottom: 10,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    contactText: {
      fontSize: 14,
      color: "#666",
      marginLeft: 10,
    },
    emergencySection: {
      marginTop: 20,
      padding: 15,
      backgroundColor: "#fff3f3",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ffcdd2",
    },
    emergencyTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#d32f2f",
      marginBottom: 10,
    },
    emergencyText: {
      fontSize: 14,
      color: "#666",
      marginBottom: 5,
    },
    emergencyNumber: {
      fontSize: 16,
      fontWeight: "600",
      color: "#d32f2f",
    },
  });

  return styles;
}; 