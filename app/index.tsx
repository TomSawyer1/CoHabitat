import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import Splash from "./auth/splash";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/accueil");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return <Splash />;
} 