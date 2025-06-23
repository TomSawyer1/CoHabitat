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
import { useMonGardienStyle } from "../hooks/useMonGardienStyle";

// Données fictives pour le gardien
const gardianData = {
  name: "Spencer Thomas",
  role: "Gardien de l'immeuble",
  phone: "06 24 71 61 67",
  email: "ts@cohabitat.com",
  officeHours: "Lun-Ven: 9h-12h et 14h-17h",
  buildingsManaged: [
    
    { id: 2, name: "Résidence Le Parc" },
  ],
};

export default function MonGardien() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const styles = useMonGardienStyle();

  const handleContactGardian = () => {
    // Logique pour contacter le gardien (e.g., ouvrir l'application de téléphone ou d'email)
    console.log("Contacter le gardien");
    // Exemple: Linking.openURL(`tel:${gardianData.phone}`);
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
          <Header subtitle="Mon Gardien" showBackButton={false} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Mon Gardien</Text>
              <Text style={styles.sectionSubtitle}>
                Informations de contact et responsabilités
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.avatarSection}>
                <View style={styles.avatarPlaceholder} />
                <Text style={styles.name}>{gardianData.name}</Text>
                <Text style={styles.role}>{gardianData.role}</Text>
              </View>

              {/* Informations de contact */}
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Informations de contact</Text>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="call-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Téléphone</Text>
                    <Text style={styles.infoValue}>{gardianData.phone}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="mail-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{gardianData.email}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="time-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Heures de bureau</Text>
                    <Text style={styles.infoValue}>{gardianData.officeHours}</Text>
                  </View>
                </View>
              </View>

              {/* Bâtiments gérés */}
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Bâtiments gérés</Text>
                {gardianData.buildingsManaged.map((building) => (
                  <View key={building.id} style={styles.buildingManagedItem}>
                    <Ionicons name="business-outline" size={20} color="#666" />
                    <Text style={styles.buildingManagedName}>{building.name}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleContactGardian}
              >
                <Text style={styles.contactButtonText}>Contacter le Gardien</Text>
              </TouchableOpacity>
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
    </View>
  );
} 