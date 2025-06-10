import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Header from "../components/Header";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useMonBatimentStyle } from "../hooks/useMonBatimentStyle";

// Données fictives pour le bâtiment du locataire
const buildingData = {
  name: "Résidence Les Jardins",
  address: "123 Avenue des Fleurs, 75001 Paris",
  buildingInfo: {
    floors: 8,
    totalApartments: 24,
    yearBuilt: 2010,
    lastRenovation: "2022",
  },
  guardian: {
    name: "Pierre Martin",
    phone: "06 12 34 56 78",
    email: "pierre.martin@cohabitat.fr",
    schedule: "Lun-Ven: 8h-18h, Sam: 9h-12h",
  },
  facilities: [
    "Ascenseur",
    "Parking souterrain",
    "Local à vélos",
    "Interphone",
    "Digicode",
  ],
  emergency: {
    guardian: "06 12 34 56 78",
    security: "01 23 45 67 89",
  },
};

export default function MonBatiment() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const styles = useMonBatimentStyle();

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
                Informations et contacts utiles
              </Text>
            </View>

            <View style={styles.buildingCard}>
              <Text style={styles.buildingName}>{buildingData.name}</Text>
              <Text style={styles.buildingAddress}>{buildingData.address}</Text>

              {/* Informations générales */}
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Informations générales</Text>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="business-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Nombre d'étages</Text>
                    <Text style={styles.infoValue}>{buildingData.buildingInfo.floors}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="home-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Nombre d'appartements</Text>
                    <Text style={styles.infoValue}>{buildingData.buildingInfo.totalApartments}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="calendar-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Année de construction</Text>
                    <Text style={styles.infoValue}>{buildingData.buildingInfo.yearBuilt}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="construct-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Dernière rénovation</Text>
                    <Text style={styles.infoValue}>{buildingData.buildingInfo.lastRenovation}</Text>
                  </View>
                </View>
              </View>

              {/* Équipements */}
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Équipements</Text>
                {buildingData.facilities.map((facility, index) => (
                  <View key={index} style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <Ionicons name="checkmark-circle-outline" size={24} color="#666" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoValue}>{facility}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Gardien */}
              <View style={styles.contactSection}>
                <Text style={styles.contactTitle}>Gardien</Text>
                <View style={styles.contactItem}>
                  <Ionicons name="person-outline" size={20} color="#666" />
                  <Text style={styles.contactText}>{buildingData.guardian.name}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="call-outline" size={20} color="#666" />
                  <Text style={styles.contactText}>{buildingData.guardian.phone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="mail-outline" size={20} color="#666" />
                  <Text style={styles.contactText}>{buildingData.guardian.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={styles.contactText}>{buildingData.guardian.schedule}</Text>
                </View>
              </View>

              {/* Urgences */}
              <View style={styles.emergencySection}>
                <Text style={styles.emergencyTitle}>En cas d'urgence</Text>
                <Text style={styles.emergencyText}>Gardien de service :</Text>
                <Text style={styles.emergencyNumber}>{buildingData.emergency.guardian}</Text>
                <Text style={styles.emergencyText}>Sécurité :</Text>
                <Text style={styles.emergencyNumber}>{buildingData.emergency.security}</Text>
              </View>
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