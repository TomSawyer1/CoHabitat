import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Header from "../components/Header";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useBatimentsStyle } from "../hooks/useBatimentsStyle";

// Données fictives pour les bâtiments
const buildingsData = [
  {
    id: 1,
    name: "Résidence Les Jardins",
    address: "123 Avenue des Fleurs, 75001 Paris",
    totalApartments: 24,
    occupiedApartments: 20,
    maintenanceStatus: "En bon état",
    lastInspection: "15/03/2024",
    incidents: 2,
  },
  {
    id: 2,
    name: "Immeuble Le Parc",
    address: "45 Rue du Parc, 75002 Paris",
    totalApartments: 16,
    occupiedApartments: 14,
    maintenanceStatus: "Rénovation en cours",
    lastInspection: "10/03/2024",
    incidents: 1,
  },
];

export default function Batiments() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const styles = useBatimentsStyle();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <TouchableWithoutFeedback
        onPress={() => setIsSidebarVisible(false)}
        disabled={!isSidebarVisible}
      >
        <View style={styles.contentContainer}>
          <Header subtitle="Mes Bâtiments" showBackButton={false} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Mes Bâtiments</Text>
              <Text style={styles.sectionSubtitle}>
                Gérez et surveillez vos bâtiments
              </Text>
            </View>

            {buildingsData.map((building) => (
              <View key={building.id} style={styles.buildingCard}>
                <View style={styles.buildingHeader}>
                  <Text style={styles.buildingName}>{building.name}</Text>
                  <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={20} color="#000" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.buildingAddress}>{building.address}</Text>

                <View style={styles.buildingInfo}>
                  <View style={styles.infoItem}>
                    <Ionicons name="home-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {building.occupiedApartments}/{building.totalApartments} appartements
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="construct-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{building.maintenanceStatus}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      Dernière inspection: {building.lastInspection}
                    </Text>
                  </View>
                </View>

                <View style={styles.buildingStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{building.incidents}</Text>
                    <Text style={styles.statLabel}>Incidents</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {Math.round((building.occupiedApartments / building.totalApartments) * 100)}%
                    </Text>
                    <Text style={styles.statLabel}>Taux d'occupation</Text>
                  </View>
                </View>

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => {
                      // Navigation vers les détails du bâtiment
                      console.log("Voir détails du bâtiment:", building.id);
                    }}
                  >
                    <Text style={styles.secondaryButtonText}>Voir détails</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => {
                      // Navigation vers la gestion du bâtiment
                      console.log("Gérer le bâtiment:", building.id);
                    }}
                  >
                    <Text style={styles.primaryButtonText}>Gérer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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