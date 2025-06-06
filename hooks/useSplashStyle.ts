import { StyleSheet } from 'react-native';

export const useSplashStyle = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      color: "#fff",
      fontSize: 36,
      fontWeight: "bold",
    },
  });

  return styles;
}; 