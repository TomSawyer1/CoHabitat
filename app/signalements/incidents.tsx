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
import { useIncidentsListStyle } from "../hooks/useIncidentsListStyle";

// Données fictives pour les incidents
const incidentsData = {
  nonPrisEnCharge: [
    {
      id: "1",
      title: "Fuite d'eau dans la salle de bain",
      date: "15/03/2024",
      status: "Non pris en charge",
      image: null,
    },
    {
      id: "2",
      title: "Problème de chauffage",
      date: "14/03/2024",
      status: "Non pris en charge",
      image: null,
    },
  ],
  enCours: [
    {
      id: "3",
      title: "Porte d'entrée bloquée",
      date: "12/03/2024",
      status: "En cours de traitement",
      image: null,
    },
    {
      id: "4",
      title: "Éclairage défectueux",
      date: "10/03/2024",
      status: "En cours de traitement",
      image: null,
    },
  ],
  resolus: [
    {
      id: "5",
      title: "Fuite d'eau cuisine",
      date: "05/03/2024",
      status: "Résolu",
      image: null,
    },
    {
      id: "6",
      title: "Problème électrique",
      date: "01/03/2024",
      status: "Résolu",
      image: null,
    },
  ],
};

export default function Incidents() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const styles = useIncidentsListStyle();

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderIncidentsList = (incidents: typeof incidentsData.nonPrisEnCharge) => {
    if (incidents.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucun incident dans cette catégorie</Text>
        </View>
      );
    }

    return incidents.map((incident) => (
      <TouchableOpacity
        key={incident.id}
        style={styles.incidentItem}
        onPress={() =>
          router.push({
            pathname: "/gerer-incidents",
            params: {
              id: incident.id,
              title: incident.title,
              date: incident.date,
              status: incident.status,
              image: incident.image,
            },
          })
        }
      >
        <View style={styles.incidentImage} />
        <View style={styles.incidentInfo}>
          <Text style={styles.incidentTitle}>{incident.title}</Text>
          <Text style={styles.incidentDate}>{incident.date}</Text>
          <Text style={styles.incidentStatus}>{incident.status}</Text>
        </View>
      </TouchableOpacity>
    ));
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
          <Header subtitle="Liste des Incidents" showBackButton={false} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            {/* Section Incidents Non Pris en Charge */}
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("nonPrisEnCharge")}
            >
              <Text style={styles.sectionTitle}>Non Pris en Charge</Text>
              <Ionicons
                name={
                  expandedSection === "nonPrisEnCharge"
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="rgba(0,0,0,0.7)"
              />
            </TouchableOpacity>
            {expandedSection === "nonPrisEnCharge" && (
              <View style={styles.incidentsContainer}>
                {renderIncidentsList(incidentsData.nonPrisEnCharge)}
              </View>
            )}

            {/* Section Incidents En Cours */}
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("enCours")}
            >
              <Text style={styles.sectionTitle}>En Cours</Text>
              <Ionicons
                name={
                  expandedSection === "enCours"
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="rgba(0,0,0,0.7)"
              />
            </TouchableOpacity>
            {expandedSection === "enCours" && (
              <View style={styles.incidentsContainer}>
                {renderIncidentsList(incidentsData.enCours)}
              </View>
            )}

            {/* Section Incidents Résolus */}
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("resolus")}
            >
              <Text style={styles.sectionTitle}>Résolus</Text>
              <Ionicons
                name={
                  expandedSection === "resolus"
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="rgba(0,0,0,0.7)"
              />
            </TouchableOpacity>
            {expandedSection === "resolus" && (
              <View style={styles.incidentsContainer}>
                {renderIncidentsList(incidentsData.resolus)}
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