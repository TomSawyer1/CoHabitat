import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

export const useIncidentsListStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingTop: spacing.lg,
      paddingHorizontal: spacing.screenPaddingH,
      paddingBottom: spacing.screenPaddingBottom,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      marginBottom: 10,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.text,
    },
    incidentsContainer: {
      paddingVertical: 10,
    },
    incidentItem: {
      flexDirection: "row",
      backgroundColor: colors.surfaceMuted,
      borderRadius: spacing.radiusSm,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 15,
      marginBottom: 10,
    },
    incidentImage: {
      width: 60,
      height: 60,
      backgroundColor: colors.imagePlaceholder,
      borderRadius: spacing.radiusSm,
      marginRight: 15,
    },
    incidentInfo: {
      flex: 1,
    },
    incidentTitle: {
      ...typography.bodySemibold,
      marginBottom: 5,
      color: colors.text,
    },
    incidentDate: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: 5,
    },
    incidentStatus: {
      ...typography.caption,
      fontWeight: "600",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.lg,
    },
    emptyStateText: {
      ...typography.body,
      color: colors.textMuted,
      textAlign: "center",
    },
    refreshButton: {
      backgroundColor: colors.primary,
      padding: spacing.sm,
      borderRadius: spacing.radiusSm,
      marginTop: spacing.lg,
      alignItems: "center",
    },
    refreshButtonText: {
      color: colors.primaryContrast,
      ...typography.button,
    },
  });
};
