import { StyleSheet } from 'react-native';

export const useAccueilStyle = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    ellipseContainer: {
      position: "absolute",
      width: "100%",
      top: -18,
      left: 0,
      zIndex: 0,
      alignItems: "center",
    },
    ellipse: {
      width: "100%",
      height: 185,
      backgroundColor: "#000",
      borderBottomLeftRadius: 200,
      borderBottomRightRadius: 200,
    },
    headerTitleContainer: {
      position: "absolute",
      top: 110,
      left: 0,
      width: "100%",
      zIndex: 20,
      alignItems: "center",
    },
    headerTitle: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "bold",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingBottom: 100,
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
  });

  return styles;
}; 