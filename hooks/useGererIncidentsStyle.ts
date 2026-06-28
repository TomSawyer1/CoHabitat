import { Dimensions, StyleSheet } from "react-native";
import { colors, field, spacing, typography } from "../theme";

const { width } = Dimensions.get("window");

export const useGererIncidentsStyle = () => {
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
      paddingBottom: 0,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: spacing.radius,
      borderWidth: field.borderWidth,
      borderColor: colors.border,
      padding: spacing.lg,
      marginBottom: spacing.md,
    },

    avatarContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    avatarPlaceholder: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.imagePlaceholder,
      marginRight: spacing.md,
    },
    avatarImage: {
      width: 56,
      height: 56,
      borderRadius: 28,
      marginRight: spacing.md,
      overflow: 'hidden',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      ...typography.bodySemibold,
      color: colors.text,
    },
    userRole: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 2,
    },

    incidentTitle: {
      ...typography.h2,
      color: colors.text,
      marginBottom: spacing.md,
    },

    metricsSection: {
      marginBottom: spacing.lg,
    },

    sectionTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.md,
    },

    metricItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    metricTitle: {
      ...typography.body,
      color: colors.textMuted,
    },
    metricData: {
      ...typography.bodySemibold,
      color: colors.text,
    },

    sectionContainer: {
      marginBottom: spacing.lg,
    },

    statusProgressContainer: {
      backgroundColor: colors.surfaceMuted,
      padding: spacing.md,
      borderRadius: spacing.radius,
      borderWidth: field.borderWidth,
      borderColor: colors.border,
    },
    statusText: {
      ...typography.bodySemibold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    progressLabel: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },
    progressBarPlaceholder: {
      height: 6,
      backgroundColor: colors.borderLight,
      borderRadius: 3,
    },
    descriptionText: {
      ...typography.body,
      color: colors.text,
      lineHeight: 24,
    },

    updatesSection: {
      marginBottom: spacing.lg,
    },
    updatesTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.md,
    },
    updateItem: {
      flexDirection: "row",
      marginBottom: spacing.md,
    },
    updateImagePlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.imagePlaceholder,
      marginRight: spacing.sm,
    },
    updateContent: {
      flex: 1,
    },
    updateDate: {
      ...typography.small,
      color: colors.textMuted,
      marginBottom: 2,
    },
    updateText: {
      ...typography.body,
      color: colors.text,
      marginBottom: 2,
    },
    updateSubtitle: {
      ...typography.caption,
      color: colors.textMuted,
    },

    commentInputContainer: {
      marginBottom: spacing.md,
    },
    commentInputLabel: {
      ...typography.bodySemibold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    commentTextFieldPlaceholder: {
      minHeight: 100,
      backgroundColor: colors.surfaceMuted,
      borderRadius: spacing.radius,
      borderWidth: field.borderWidth,
      borderColor: colors.border,
      padding: spacing.md,
      fontSize: typography.body.fontSize,
      color: colors.text,
      textAlignVertical: "top",
    },
    pickerContainer: {
      borderWidth: field.borderWidth,
      borderColor: colors.border,
      borderRadius: spacing.radius,
      overflow: "hidden",
      marginBottom: spacing.md,
      backgroundColor: colors.surfaceMuted,
    },
    pickerStyle: {
      height: spacing.inputHeight,
      width: "100%",
    },
    imagePlaceholder: {
      width: "100%",
      height: 200,
      backgroundColor: colors.imagePlaceholder,
      borderRadius: spacing.radius,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    imagePreview: {
      width: "100%",
      height: "100%",
    },

    buttonFigma: {
      height: spacing.inputHeight,
      borderRadius: spacing.radius,
      alignItems: "center",
      justifyContent: "center",
      width: width - spacing.screenPaddingH * 2,
      alignSelf: "center",
    },
    primaryButtonFigma: {
      backgroundColor: colors.primary,
      marginBottom: spacing.md,
    },
    secondaryButtonFigma: {
      backgroundColor: colors.surfaceMuted,
      borderWidth: field.borderWidth,
      borderColor: colors.border,
    },
    sendButtonFigma: {
      marginBottom: spacing.xl,
    },
    primaryButtonTextFigma: {
      color: colors.primaryContrast,
      ...typography.button,
    },
    secondaryButtonTextFigma: {
      color: colors.text,
      ...typography.button,
    },
    buttonsContainerFigma: {
      flexDirection: "row",
      gap: spacing.sm,
      marginTop: spacing.md,
      marginBottom: 0,
    },
    secondaryButtonMuted: {
      backgroundColor: colors.textMuted,
    },
    deleteButtonFigma: {
      backgroundColor: colors.danger,
      marginBottom: spacing.xl,
    },
    deleteButtonTextFigma: {
      color: colors.dangerContrast,
      ...typography.button,
    },
  });
};
