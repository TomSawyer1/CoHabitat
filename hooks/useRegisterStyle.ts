import { StyleSheet } from "react-native";

export const useRegisterStyle = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    headerRect: {
      width: "100%",
      height: 120,
      backgroundColor: "#161616",
      justifyContent: "center",
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      position: "absolute",
      left: 24,
      top: 50,
      padding: 4,
      zIndex: 1,
    },
    headerContent: {
      flex: 1,
      alignItems: "center",
      marginTop: 20,
    },
    headerTitle: {
      color: "#fff",
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 6,
    },
    headerSubtitle: {
      color: "#fff",
      fontSize: 16,
      opacity: 0.8,
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
    pickerContainer: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#0000001A",
      backgroundColor: "#f9fafb",
      overflow: 'hidden',
    },
    picker: {
      width: '100%',
      height: 48,
      color: '#000',
    },
    inputField: {
      flex: 1,
      color: "#000",
      fontSize: 16,
    },
    inputInfo: {
      fontSize: 13,
      color: "#00000080",
      marginTop: 2,
    },
    eyeIcon: {
      padding: 4,
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