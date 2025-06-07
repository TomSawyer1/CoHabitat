import { StyleSheet } from "react-native";

export const useSignalementStyle = () => {
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
      paddingTop: 20,
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    sectionTitleContainer: {
      marginBottom: 30,
    },
    sectionTitle: {
      color: "#000",
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 12,
    },
    sectionSubtitle: {
      color: "#00000080",
      fontSize: 16,
    },
    inputsContainer: {
      marginBottom: 30,
      gap: 20,
    },
    inputGroup: {
      gap: 6,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#000",
    },
    inputFieldContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#0000001A",
      paddingHorizontal: 16,
      height: 48,
      backgroundColor: "#f9fafb",
    },
    inputField: {
      flex: 1,
      color: "#000",
      fontSize: 16,
    },
    descriptionInputContainer: {
      height: 120,
      paddingVertical: 12,
    },
    descriptionInputField: {
      height: "100%",
    },
    imagePickerButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#0000001A",
      backgroundColor: "#f9fafb",
    },
    imagePickerButtonText: {
      color: "#000",
      fontSize: 16,
    },
    selectedImage: {
      width: "100%",
      height: 200,
      borderRadius: 12,
      marginTop: 12,
    },
    buttonsContainerHorizontal: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
      marginTop: 30,
    },
    buttonHorizontal: {
      flex: 1,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      maxWidth: 200,
    },
    secondaryButtonHorizontal: {
      backgroundColor: "#f9fafb",
      borderWidth: 1,
      borderColor: "#0000001A",
    },
    primaryButtonHorizontal: {
      backgroundColor: "#000",
    },
    secondaryButtonHorizontalText: {
      color: "#000",
      fontSize: 16,
      fontWeight: "600",
    },
    primaryButtonHorizontalText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });

  return styles;
}; 