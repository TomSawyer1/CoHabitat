import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { useNotFoundStyle } from "../hooks/useNotFoundStyle";

export default function NotFoundScreen() {
  const styles = useNotFoundStyle();

  return (
    <>
      <Stack.Screen options={{ title: "Oups !" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Cette page n&apos;existe pas.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Retour à l&apos;accueil</Text>
        </Link>
      </View>
    </>
  );
}
