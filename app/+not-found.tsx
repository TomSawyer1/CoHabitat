import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { useNotFoundStyle } from "../hooks/useNotFoundStyle";

export default function NotFoundScreen() {
  const styles = useNotFoundStyle();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
