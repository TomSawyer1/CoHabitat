import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Splash from "./auth/splash";

export default function Index() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      router.replace("/accueil");
    }, 2000); // 2 secondes
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <Splash />;
  }
  return null;
} 