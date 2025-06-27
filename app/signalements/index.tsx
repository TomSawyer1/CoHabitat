import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function SignalementsIndex() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger automatiquement vers la page de signalement
    router.replace("/signalements/signalement");
  }, []);

  return null; // Ne rien afficher pendant la redirection
} 