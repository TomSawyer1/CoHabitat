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

    // --- En-tête du formulaire ---
    formHeader: {
      marginBottom: 24,
    },
    formHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    sectionTitle: {
      color: "#111",
      fontSize: 26,
      fontWeight: "700",
      marginBottom: 6,
    },
    sectionSubtitle: {
      color: "#6b7280",
      fontSize: 14,
      lineHeight: 20,
    },
    clearButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#fca5a5",
      backgroundColor: "#fff5f5",
    },
    clearButtonText: {
      color: "#ef4444",
      fontSize: 12,
      fontWeight: "600",
    },

    // --- Badge bâtiment ---
    buildingBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      marginTop: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      backgroundColor: "#f0f9ff",
      borderWidth: 1,
      borderColor: "#bae6fd",
    },
    buildingBadgeText: {
      color: "#0369a1",
      fontSize: 13,
      fontWeight: "500",
    },

    // --- Champs du formulaire ---
    inputsContainer: {
      gap: 18,
      marginBottom: 28,
    },
    inputGroup: {
      gap: 6,
    },
    inputRowGroup: {
      flexDirection: "row",
      gap: 12,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "#374151",
    },
    requiredStar: {
      color: "#ef4444",
    },
    inputFieldContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      paddingHorizontal: 14,
      height: 48,
      backgroundColor: "#f9fafb",
    },
    inputField: {
      flex: 1,
      color: "#111",
      fontSize: 15,
    },
    disabledField: {
      backgroundColor: "#f3f4f6",
      color: "#9ca3af",
    },

    // --- Sélecteur de type ---
    typeSelector: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      paddingHorizontal: 14,
      height: 48,
      backgroundColor: "#f9fafb",
    },
    typeSelectorText: {
      fontSize: 15,
      flex: 1,
    },
    typeSelectorPlaceholder: {
      color: "#9ca3af",
    },
    typeSelectorValue: {
      color: "#111",
    },
    typeDropdown: {
      backgroundColor: "#fff",
      borderRadius: 10,
      marginTop: 6,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
      overflow: "hidden",
    },
    typeDropdownItem: {
      paddingHorizontal: 16,
      paddingVertical: 13,
    },
    typeDropdownItemText: {
      fontSize: 15,
      color: "#111",
    },
    typeDropdownSeparator: {
      height: 1,
      backgroundColor: "#f3f4f6",
      marginHorizontal: 12,
    },
    typeDropdownCancel: {
      paddingVertical: 12,
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: "#f3f4f6",
    },
    typeDropdownCancelText: {
      color: "#ef4444",
      fontSize: 14,
      fontWeight: "600",
    },

    // --- Description ---
    descriptionInputContainer: {
      height: 110,
      alignItems: "flex-start",
      paddingVertical: 12,
    },
    descriptionInputField: {
      height: "100%",
      textAlignVertical: "top",
    },

    // --- Photo ---
    imagePickerButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      height: 48,
      borderRadius: 10,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: "#d1d5db",
      backgroundColor: "#fafafa",
    },
    imagePickerButtonText: {
      color: "#6b7280",
      fontSize: 14,
      fontWeight: "500",
    },
    selectedImage: {
      width: "100%",
      height: 180,
      borderRadius: 10,
      marginTop: 10,
    },

    // --- Boutons d'action ---
    buttonsContainerHorizontal: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
    },
    buttonHorizontal: {
      flex: 1,
      height: 50,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    secondaryButtonHorizontal: {
      backgroundColor: "#f9fafb",
      borderWidth: 1,
      borderColor: "#e5e7eb",
    },
    primaryButtonHorizontal: {
      backgroundColor: "#111",
    },
    secondaryButtonHorizontalText: {
      color: "#374151",
      fontSize: 15,
      fontWeight: "600",
    },
    primaryButtonHorizontalText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "600",
    },
  });

  return styles;
};
