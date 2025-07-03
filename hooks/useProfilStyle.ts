import { StyleSheet } from "react-native";

export const useProfilStyle = () => {
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
    avatarSection: {
      alignItems: "center",
      marginBottom: 30,
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
    userName: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#000",
    },
    userBuilding: {
      fontSize: 16,
      color: "#666",
      marginTop: 4,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#e1e1e1",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#000",
    },
    formContainer: {
      paddingVertical: 20,
    },
    inputContainer: {
      marginBottom: 15,
    },
    inputLabel: {
      fontSize: 16,
      marginBottom: 5,
      color: "#000",
    },
    input: {
      borderWidth: 1,
      borderColor: "#e1e1e1",
      borderRadius: 8,
      padding: 10,
      fontSize: 16,
      backgroundColor: "#f9f9f9",
    },
    saveButton: {
      backgroundColor: "#000",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
    },
    saveButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    incidentsContainer: {
      paddingVertical: 20,
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
    deleteButton: {
      backgroundColor: "#FF3B30",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 30,
      marginBottom: 20,
    },
    deleteButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });

  return styles;
}; 