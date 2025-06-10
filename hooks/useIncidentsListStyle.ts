import { StyleSheet } from "react-native";

export const useIncidentsListStyle = () => {
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
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#e1e1e1",
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#000",
    },
    incidentsContainer: {
      paddingVertical: 10,
    },
    incidentItem: {
      flexDirection: "row",
      backgroundColor: "#f9f9f9",
      borderRadius: 8,
      padding: 15,
      marginBottom: 10,
    },
    incidentImage: {
      width: 60,
      height: 60,
      backgroundColor: "#e1e1e1",
      borderRadius: 8,
      marginRight: 15,
    },
    incidentInfo: {
      flex: 1,
    },
    incidentTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 5,
      color: "#000",
    },
    incidentDate: {
      fontSize: 14,
      color: "#666",
      marginBottom: 5,
    },
    incidentStatus: {
      fontSize: 14,
      color: "#007AFF",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    emptyStateText: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
    },
  });

  return styles;
}; 