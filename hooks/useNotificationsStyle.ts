import { StyleSheet } from 'react-native';

export const useNotificationsStyle = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-end",
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingTop: 20,
      paddingHorizontal: 24,
      paddingBottom: 40 + 70,
    },
    sectionTitleContainer: {
      marginBottom: 20,
    },
    sectionTitle: {
      color: "#000",
      fontSize: 24,
      fontWeight: "bold",
    },
    notificationsList: {
      gap: 10,
    },
    notificationItem: {
      backgroundColor: "#f9f9f9",
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#eee",
    },
    notificationText: {
      fontSize: 16,
      color: "#333",
    },
  });

  return styles;
}; 