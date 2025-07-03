import { StyleSheet } from "react-native";

export const useMonGardienStyle = () => {
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
    avatarSection: {
      alignItems: "center",
      marginBottom: 20,
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "#e1e1e1",
      marginBottom: 10,
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    name: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#000",
    },
    role: {
      fontSize: 16,
      color: "#666",
      marginBottom: 15,
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
    contactButton: {
      backgroundColor: "#000",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
    },
    contactButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    buildingManagedItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    buildingManagedName: {
      fontSize: 16,
      fontWeight: "500",
      marginLeft: 10,
    },
  });

  return styles;
}; 