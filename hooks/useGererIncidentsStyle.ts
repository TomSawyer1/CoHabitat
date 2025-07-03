import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const useGererIncidentsStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F5",
    },
    contentContainer: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: 100,
    },
    avatarContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#FFF",
      marginBottom: 10,
    },
    avatarPlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#E0E0E0",
      marginRight: 15,
    },
    avatarImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
    },
    userInfo: {
      justifyContent: "center",
    },
    userName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    userRole: {
      fontSize: 14,
      color: "#666",
    },
    incidentTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#333",
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: "#FFF",
      marginBottom: 10,
    },
    metricsSection: {
      backgroundColor: "#FFF",
      padding: 20,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 15,
    },
    metricItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    metricTitle: {
      fontSize: 16,
      color: "#666",
    },
    metricData: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    sectionContainer: {
      backgroundColor: "#FFF",
      padding: 20,
      marginBottom: 10,
    },
    statusProgressContainer: {
      marginTop: 10,
    },
    statusText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#007AFF",
      marginBottom: 10,
    },
    progressLabel: {
      fontSize: 14,
      color: "#666",
      marginBottom: 5,
    },
    progressBarPlaceholder: {
      height: 10,
      backgroundColor: "#E0E0E0",
      borderRadius: 5,
    },
    descriptionText: {
      fontSize: 16,
      color: "#333",
      lineHeight: 24,
    },
    updatesSection: {
      backgroundColor: "#FFF",
      padding: 20,
      marginBottom: 10,
    },
    updatesTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 15,
    },
    updateItem: {
      flexDirection: "row",
      marginBottom: 15,
    },
    updateImagePlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#E0E0E0",
      marginRight: 10,
    },
    updateContent: {
      flex: 1,
    },
    updateDate: {
      fontSize: 12,
      color: "#999",
      marginBottom: 2,
    },
    updateText: {
      fontSize: 16,
      color: "#333",
      marginBottom: 2,
    },
    updateSubtitle: {
      fontSize: 14,
      color: "#666",
    },
    commentInputContainer: {
      backgroundColor: "#FFF",
      padding: 20,
      marginBottom: 10,
    },
    commentInputLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 10,
    },
    commentTextFieldPlaceholder: {
      height: 80,
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 8,
      padding: 10,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 10,
    },
    pickerStyle: {
      height: 50,
      width: "100%",
    },
    imagePlaceholder: {
      width: '100%',
      height: 200,
      backgroundColor: "#E0E0E0",
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    imagePreview: {
      width: '100%',
      height: '100%',
    },
    buttonFigma: {
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      width: width - 40, // Ajusté pour s'adapter à la largeur de l'écran avec padding
      alignSelf: "center",
    },
    primaryButtonFigma: {
      backgroundColor: "#007AFF",
      marginBottom: 10,
    },
    secondaryButtonFigma: {
      backgroundColor: "#E0E0E0",
    },
    sendButtonFigma: {
      marginBottom: 20,
    },
    primaryButtonTextFigma: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    secondaryButtonTextFigma: {
      color: "#333333",
      fontSize: 16,
      fontWeight: "bold",
    },
    buttonsContainerFigma: {
      backgroundColor: "#FFF",
      padding: 20,
      marginBottom: 10,
    },
    deleteButtonFigma: {
      backgroundColor: "#FF3B30",
      marginBottom: 20,
    },
    deleteButtonTextFigma: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
}; 