import { StyleSheet } from 'react-native';
import { EdgeInsets } from "react-native-safe-area-context";

export const useHomeStyle = (insets: EdgeInsets) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
    },
    contentContainer: {
      flex: 1,
    },
    mainContent: {
      flex: 1,
      paddingTop: 16,
      paddingBottom: 100,
      paddingHorizontal: 20,
    },

    // === Dashboard ===
    welcomeCard: {
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    },
    welcomeHello: {
      color: "#fff",
      fontSize: 14,
      opacity: 0.85,
    },
    welcomeName: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "700",
      marginTop: 2,
    },
    welcomeBuilding: {
      color: "#fff",
      fontSize: 13,
      opacity: 0.85,
      marginTop: 8,
    },

    statsRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 14,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statValue: {
      fontSize: 22,
      fontWeight: "700",
      color: "#000",
    },
    statLabel: {
      fontSize: 11,
      color: "#666",
      marginTop: 4,
      textAlign: "center",
    },

    actionsTitle: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
      textShadowColor: "rgba(0,0,0,0.6)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    actionCard: {
      width: "48%",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 90,
    },
    actionIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    actionLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: "#000",
      textAlign: "center",
    },
  });

  return styles;
};
