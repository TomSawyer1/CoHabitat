import { StyleSheet } from "react-native";

export const useGuardianRegisterStyle = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    headerRect: {
      width: "100%",
      height: 100,
      backgroundColor: "#000",
      justifyContent: "center",
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      position: "absolute",
      left: 24,
    },
    headerTitle: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "bold",
    },
    headerSubtitle: {
      color: "#fff",
      fontSize: 16,
      marginTop: 4,
    },
    inputsContainer: {
      padding: 24,
      gap: 24,
    },
    inputFieldContainer: {
      gap: 8,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#000",
    },
    inputField: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#0000001A",
      paddingHorizontal: 16,
      height: 48,
      backgroundColor: "#f9fafb",
    },
    input: {
      flex: 1,
      color: "#000",
      fontSize: 16,
    },
    inputInfo: {
      fontSize: 13,
      color: "#00000080",
      marginTop: 6,
    },
    buttonsContainer: {
      marginTop: 32,
      gap: 16,
    },
    button: {
      width: "100%",
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    secondaryButton: {
      borderWidth: 1,
      borderColor: "#000",
      backgroundColor: "#fff",
    },
    secondaryButtonText: {
      color: "#000",
      fontWeight: "600",
      fontSize: 16,
    },
    primaryButton: {
      backgroundColor: "#000",
    },
    primaryButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
    eyeIcon: {
      padding: 4,
    },
  });

  return styles;
}; 