import { StyleSheet } from 'react-native';

export const useLoginStyle = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingTop: 120,
      paddingHorizontal: 24,
      paddingBottom: 100,
    },
    sectionTitle: {
      color: "#000",
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 32,
    },
    inputsContainer: {
      marginBottom: 48,
      gap: 24,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
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
    inputInfo: {
      fontSize: 13,
      color: "#00000080",
      marginTop: 6,
    },
    buttonsContainer: {
      marginTop: 56,
      marginBottom: 16,
      gap: 16,
    },
    button: {
      width: "100%",
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButton: {
      backgroundColor: "#000",
    },
    primaryButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
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
    secondaryButtonBlack: {
      backgroundColor: "#000",
    },
    secondaryButtonBlackText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
    eyeIcon: {
      paddingLeft: 10,
    },
  });

  return styles;
}; 