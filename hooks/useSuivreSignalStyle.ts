import { StyleSheet } from "react-native";

export const useSuivreSignalStyle = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-end",
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingTop: 20,
      paddingHorizontal: 24,
      paddingBottom: 40 + 70,
    },
    avatarContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    avatarPlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#ddd",
      marginRight: 15,
    },
    avatarImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: "600",
      color: "#000",
      marginBottom: 4,
    },
    userRole: {
      fontSize: 14,
      color: "#666",
    },
    incidentTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#000",
      marginBottom: 20,
    },
    metricsSection: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#000",
      marginBottom: 15,
    },
    metricItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#e1e1e1",
    },
    metricTitle: {
      fontSize: 16,
      color: "#666",
    },
    metricData: {
      fontSize: 16,
      fontWeight: "500",
      color: "#000",
    },
    sectionContainer: {
      marginBottom: 30,
    },
    statusProgressContainer: {
      backgroundColor: "#f9f9f9",
      padding: 15,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#000",
      marginBottom: 10,
    },
    progressLabel: {
      fontSize: 14,
      color: "#666",
      marginBottom: 8,
    },
    progressBarPlaceholder: {
      height: 6,
      backgroundColor: "#e1e1e1",
      borderRadius: 3,
    },
    descriptionText: {
      fontSize: 16,
      color: "#000",
      lineHeight: 24,
    },
    updatesSection: {
      marginBottom: 30,
    },
    updatesTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#000",
      marginBottom: 15,
    },
    updateItem: {
      flexDirection: "row",
      marginBottom: 20,
    },
    updateImagePlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#ddd",
      marginRight: 10,
    },
    updateImageAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    updateContent: {
      flex: 1,
    },
    updateDate: {
      fontSize: 14,
      color: "#666",
      marginBottom: 4,
    },
    updateText: {
      fontSize: 16,
      color: "#000",
      marginBottom: 4,
    },
    updateSubtitle: {
      fontSize: 14,
      color: "#666",
    },
    commentInputContainer: {
      marginBottom: 15,
    },
    commentInputLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#000",
      marginBottom: 8,
    },
    commentTextFieldPlaceholder: {
      height: 100,
      backgroundColor: "#f9f9f9",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e1e1e1",
    },
    buttonFigma: {
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15,
    },
    primaryButtonFigma: {
      backgroundColor: "#000",
    },
    secondaryButtonFigma: {
      backgroundColor: "#f9f9f9",
      borderWidth: 1,
      borderColor: "#e1e1e1",
    },
    deleteButtonFigma: {
      backgroundColor: "#FF3B30",
    },
    primaryButtonTextFigma: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    secondaryButtonTextFigma: {
      color: "#000",
      fontSize: 16,
      fontWeight: "600",
    },
    deleteButtonTextFigma: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    buttonsContainerFigma: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 15,
    },
    sendButtonFigma: {
      marginBottom: 30,
    },
  });

  return styles;
}; 