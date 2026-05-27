import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Header from "../../components/Header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { apiFetch } from "../../config/api";
import { useBatimentsStyle } from "../../hooks/useBatimentsStyle";

interface BuildingCard {
  id: number;
  name: string;
  address: string;
  floors: number;
  totalApartments: number;
  facilities: string[];
}

export default function Batiments() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [building, setBuilding] = useState<BuildingCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const styles = useBatimentsStyle();

  useEffect(() => {
    loadBuilding();
  }, []);

  const loadBuilding = async () => {
    try {
      setIsLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Alert.alert("Session expirée", "Veuillez vous reconnecter.", [
          { text: "OK", onPress: () => router.replace("/auth/login") },
        ]);
        return;
      }

      const response = await apiFetch(`/api/buildings/${userId}`);
      if (!response.ok) {
        Alert.alert("Erreur", "Impossible de charger les informations du bâtiment.");
        return;
      }

      const data = await response.json();
      if (data.success && data.building) {
        const b = data.building;
        setBuilding({
          id: b.id,
          name: b.name || "Bâtiment",
          address: b.address || "",
          floors: b.floors || 0,
          totalApartments: b.totalApartments || 0,
          facilities: Array.isArray(b.facilities) ? b.facilities : [],
        });
      }
    } catch (error) {
      console.error("[BATIMENTS] Erreur:", error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <TouchableWithoutFeedback
        onPress={() => setIsSidebarVisible(false)}
        disabled={!isSidebarVisible}
      >
        <View style={styles.contentContainer}>
          <Header subtitle="Mon Bâtiment" showBackButton={false} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Mon Bâtiment</Text>
              <Text style={styles.sectionSubtitle}>
                Informations de votre résidence assignée
              </Text>
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
            ) : !building ? (
              <Text style={{ textAlign: "center", color: "#666", marginTop: 24 }}>
                Aucun bâtiment assigné à votre compte.
              </Text>
            ) : (
              <View style={styles.buildingCard}>
                <View style={styles.buildingHeader}>
                  <Text style={styles.buildingName}>{building.name}</Text>
                </View>

                <Text style={styles.buildingAddress}>{building.address}</Text>

                <View style={styles.buildingInfo}>
                  <View style={styles.infoItem}>
                    <Ionicons name="layers-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{building.floors} étages</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="home-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {building.totalApartments} appartements
                    </Text>
                  </View>
                </View>

                {building.facilities.length > 0 && (
                  <View style={{ marginTop: 12 }}>
                    <Text style={{ fontWeight: "600", marginBottom: 8 }}>Équipements</Text>
                    {building.facilities.map((f, i) => (
                      <Text key={i} style={styles.infoText}>
                        • {f}
                      </Text>
                    ))}
                  </View>
                )}

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => router.push("/batiments/mon-batiment")}
                  >
                    <Text style={styles.primaryButtonText}>Voir tous les détails</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    </View>
  );
}
