import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { useSplashStyle } from "../hooks/useSplashStyle";

export default function Splash() {
  const styles = useSplashStyle();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>CoHabitat</Text>
    </View>
  );
}
