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

interface BuildingData {
  id: number;
  nom: string;
  adresse: string;
  nombre_etage: number;
  nombre_appartement: number;
  annee_construction: number;
  derniere_renovation: string; // Ou number si c'est une année
  // Ajouter d'autres propriétés si l'API les retourne, comme facilities, emergency
}

interface GuardianData {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  // Ajouter d'autres propriétés si l'API les retourne, comme schedule
}

export default function MonBatiment() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const styles = useMonBatimentStyle();

  const [buildingData, setBuildingData] = useState<BuildingData | null>({
    id: 1,
    nom: "Résidence Le Parc",
    adresse: "456 Avenue du Lac",
    nombre_etage: 3,
    nombre_appartement: 15,
    annee_construction: 1995,
    derniere_renovation: "2018",
  });
  const [guardianData, setGuardianData] = useState<GuardianData | null>({
    id: 101,
    nom: "Spencer",
    prenom: "Thomas",
    telephone: "0624716167",
    email: "ts@cohabitat.com",
  });
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Chargement des informations du bâtiment...</Text>
      </View>
    );
  }

  if (!buildingData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Aucune donnée de bâtiment disponible.</Text>
      </View>
    );
  }

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
              <Text style={styles.buildingName}>{buildingData.nom}</Text>
              <Text style={styles.buildingAddress}>{buildingData.adresse}</Text>

              {/* Informations générales */}
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Informations générales</Text>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="business-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Nombre d'étages</Text>
                    <Text style={styles.infoValue}>{buildingData.nombre_etage}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="home-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Nombre d'appartements</Text>
                    <Text style={styles.infoValue}>{buildingData.nombre_appartement}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="calendar-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Année de construction</Text>
                    <Text style={styles.infoValue}>{buildingData.annee_construction}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="construct-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Dernière rénovation</Text>
                    <Text style={styles.infoValue}>{buildingData.derniere_renovation}</Text>
                  </View>
                </View>
              </View>

              {/* Équipements (si disponible dans les données de l'API) */}
              {/* J'ai commenté cette section car les données de l'API n'incluent pas 'facilities' directement.
                  Si votre API renvoie les équipements, vous pouvez décommenter et adapter. */}
              {/* <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Équipements</Text>
                {buildingData.facilities && buildingData.facilities.map((facility, index) => (
                  <View key={index} style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <Ionicons name="checkmark-circle-outline" size={24} color="#666" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoValue}>{facility}</Text>
                    </View>
                  </View>
                ))}
              </View> */}

              {/* Gardien */}
              {guardianData && (
                <View style={styles.contactSection}>
                  <Text style={styles.contactTitle}>Gardien</Text>
                  <View style={styles.contactItem}>
                    <Ionicons name="person-outline" size={20} color="#666" />
                    <Text style={styles.contactText}>{guardianData.nom} {guardianData.prenom}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Ionicons name="call-outline" size={20} color="#666" />
                    <Text style={styles.contactText}>{guardianData.telephone}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Ionicons name="mail-outline" size={20} color="#666" />
                    <Text style={styles.contactText}>{guardianData.email}</Text>
                  </View>
                  {/* Si l'API retourne l'horaire, décommentez ceci */}
                  {/* <View style={styles.contactItem}>
                    <Ionicons name="time-outline" size={20} color="#666" />
                    <Text style={styles.contactText}>{guardianData.schedule}</Text>
                  </View> */}
                </View>
              )}

              {/* Urgences (si disponible dans les données de l'API) */}
              {/* <View style={styles.emergencySection}>
                <Text style={styles.emergencyTitle}>En cas d'urgence</Text>
                <Text style={styles.emergencyText}>Gardien de service :</Text>
                <Text style={styles.emergencyNumber}>{buildingData.emergency.guardian}</Text>
                <Text style={styles.emergencyText}>Sécurité :</Text>
                <Text style={styles.emergencyNumber}>{buildingData.emergency.security}</Text>
              </View> */}
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