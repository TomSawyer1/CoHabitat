import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    ImageBackground,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../components/Header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { apiFetch } from "../../config/api";
import { useHomeStyle } from "../../hooks/useHomeStyle";
import { incidentStatusColors } from "../../theme";

const backgroundImage = require("../../assets/images/immeuble.jpg");

interface Stats {
  nouveau: number;
  en_cours: number;
  resolu: number;
  total: number;
}

export default function Home() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [buildingName, setBuildingName] = useState<string>("");
  const [stats, setStats] = useState<Stats>({ nouveau: 0, en_cours: 0, resolu: 0, total: 0 });
  const [statsError, setStatsError] = useState(false);

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useHomeStyle(insets);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [name, role, building, userId] = await Promise.all([
        AsyncStorage.getItem("userName"),
        AsyncStorage.getItem("userRole"),
        AsyncStorage.getItem("userBuildingName"),
        AsyncStorage.getItem("userId"),
      ]);

      if (name) setUserName(name);
      if (role) setUserRole(role);
      if (building) setBuildingName(building);

      // Charger les incidents pour calculer des stats légères côté client
      // (un endpoint /stats existe mais n'est pas filtré par bâtiment côté gardien
      //  de façon utile ici ; on agrège depuis la liste).
      if (!userId || !role) return;

      const url = role === "guardian" ? `/api/incidents` : `/api/incidents/user/${userId}`;
      const res = await apiFetch(url);
      if (!res.ok) {
        setStatsError(true);
        return;
      }
      const data = await res.json();
      const list: { status: string }[] = data?.incidents ?? [];

      setStatsError(false);
      setStats({
        nouveau: list.filter((i) => i.status === "nouveau").length,
        en_cours: list.filter((i) => i.status === "en_cours").length,
        resolu: list.filter((i) => i.status === "resolu").length,
        total: list.length,
      });
    } catch (error) {
      if (__DEV__) console.error("[HOME] Erreur chargement données:", error);
      setStatsError(true);
    }
  };

  const handlePressOutsideSidebar = () => {
    if (isSidebarVisible) {
      setIsSidebarVisible(false);
    }
  };

  const isGuardian = userRole === "guardian";

  type IconName = keyof typeof Ionicons.glyphMap;

  const actions = [
    {
      key: "incidents",
      label: isGuardian ? "Incidents" : "Mes incidents",
      icon: "list-outline" as IconName,
      color: "#65ddb7",
      onPress: () => router.push("/signalements/incidents"),
    },
    {
      key: "signaler",
      label: isGuardian ? "Gérer" : "Signaler",
      icon: (isGuardian ? "warning-outline" : "create-outline") as IconName,
      color: "#f54888",
      onPress: () =>
        isGuardian
          ? router.push("/signalements/gerer-incidents")
          : router.push("/signalements/signalement"),
    },
    {
      key: "batiment",
      label: "Mon bâtiment",
      icon: "business-outline" as IconName,
      color: "#ff8c00",
      onPress: () => router.push("/batiments/mon-batiment"),
    },
    {
      key: "gardien",
      label: isGuardian ? "Mon profil" : "Mon gardien",
      icon: (isGuardian ? "person-outline" : "shield-outline") as IconName,
      color: "#e0b115",
      onPress: () =>
        isGuardian
          ? router.push("/profil/profil")
          : router.push("/batiments/mon-gardien"),
    },
  ];

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <TouchableWithoutFeedback
        onPress={handlePressOutsideSidebar}
        disabled={!isSidebarVisible}
      >
        <View style={styles.contentContainer}>
          <Header subtitle="Accueil" showBackButton={false} transparentBackground={true} />

          <ScrollView
            style={styles.mainContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeHello}>Bonjour</Text>
              <Text style={styles.welcomeName}>{userName || "Bienvenue"}</Text>
              {!!buildingName && (
                <Text style={styles.welcomeBuilding}>
                  <Ionicons name="business" size={12} color="#fff" /> {buildingName}
                </Text>
              )}
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: incidentStatusColors.nouveau }]}>{stats.nouveau}</Text>
                <Text style={styles.statLabel}>Nouveaux</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: incidentStatusColors.en_cours }]}>{stats.en_cours}</Text>
                <Text style={styles.statLabel}>En cours</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: incidentStatusColors.resolu }]}>{stats.resolu}</Text>
                <Text style={styles.statLabel}>Résolus</Text>
              </View>
            </View>

            {statsError && (
              <TouchableOpacity onPress={loadUserData}>
                <Text style={{ color: "#f54888", textAlign: "center", marginTop: 8, fontSize: 13 }}>
                  Impossible de charger les statistiques. Appuyez pour réessayer.
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles.actionsTitle}>Accès rapides</Text>
            <View style={styles.actionsGrid}>
              {actions.map((a) => (
                <TouchableOpacity
                  key={a.key}
                  style={styles.actionCard}
                  onPress={a.onPress}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIconWrap, { backgroundColor: a.color }]}>
                    <Ionicons name={a.icon} size={22} color="#fff" />
                  </View>
                  <Text style={styles.actionLabel}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Navbar
            isSidebarVisible={isSidebarVisible}
            setIsSidebarVisible={setIsSidebarVisible}
            router={router}
          />
        </View>
      </TouchableWithoutFeedback>

      <Sidebar
        isSidebarVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </ImageBackground>
  );
}
