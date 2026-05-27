import { useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignalementsIndex() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      const role = await AsyncStorage.getItem("userRole");
      // Gardien : on l'envoie vers la liste / gestion
      if (role === "guardian") {
        router.replace("/signalements/incidents");
        return;
      }
      // Locataire (ou inconnu) : création d'un signalement
      router.replace("/signalements/signalement");
    };
    redirect();
  }, []);

  return null; // Ne rien afficher pendant la redirection
} 