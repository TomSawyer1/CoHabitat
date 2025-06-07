import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Header from "../components/Header";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useProfilStyle } from "../hooks/useProfilStyle";

// Fake data
const userData = {
  nom: "Dupont",
  prenom: "Jean",
  email: "jean.dupont@example.com",
  telephone: "06 12 34 56 78",
  adresse: "123 Rue de la Paix, Paris",
};

const incidentsData = [
  {
    id: "1",
    title: "Fuite d'eau",
    date: "12/03/2024",
    status: "En cours de traitement",
    image: null,
  },
  {
    id: "2",
    title: "Problème électrique",
    date: "10/03/2024",
    status: "Résolu",
    image: null,
  },
  {
    id: "3",
    title: "Porte d'entrée bloquée",
    date: "08/03/2024",
    status: "En attente",
    image: null,
  },
];

export default function Profil() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [formData, setFormData] = useState(userData);
  const styles = useProfilStyle();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Données sauvegardées:", formData);
    // Ajouter la logique de sauvegarde ici
  };

  const handleDelete = () => {
    console.log("Supprimer le compte");
    // Ajouter la logique de suppression ici
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
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
          {/* Header */}
          <Header subtitle="Mon Profil" showBackButton={false} />

          {/* Contenu principal - Profil */}
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            {/* Section Avatar et Nom */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarPlaceholder} />
              <Text
                style={styles.userName}
              >{`${formData.prenom} ${formData.nom}`}</Text>
            </View>

            {/* Section Informations Personnelles */}
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("informations")}
            >
              <Text style={styles.sectionTitle}>Informations Personnelles</Text>
              <Ionicons
                name={
                  expandedSection === "informations"
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="rgba(0,0,0,0.7)"
              />
            </TouchableOpacity>
            {expandedSection === "informations" && (
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nom</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.nom}
                    onChangeText={(value) => handleInputChange("nom", value)}
                    placeholder="Entrez votre nom"
                    placeholderTextColor="rgba(0,0,0,0.5)"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Prénom</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.prenom}
                    onChangeText={(value) => handleInputChange("prenom", value)}
                    placeholder="Entrez votre prénom"
                    placeholderTextColor="rgba(0,0,0,0.5)"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    placeholder="Entrez votre email"
                    placeholderTextColor="rgba(0,0,0,0.5)"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Téléphone</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.telephone}
                    onChangeText={(value) =>
                      handleInputChange("telephone", value)
                    }
                    placeholder="Entrez votre numéro de téléphone"
                    placeholderTextColor="rgba(0,0,0,0.5)"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Adresse</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.adresse}
                    onChangeText={(value) =>
                      handleInputChange("adresse", value)
                    }
                    placeholder="Entrez votre adresse"
                    placeholderTextColor="rgba(0,0,0,0.5)"
                  />
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Sauvegarder</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Section Vos Incidents */}
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("incidents")}
            >
              <Text style={styles.sectionTitle}>Vos Incidents</Text>
              <Ionicons
                name={
                  expandedSection === "incidents"
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="rgba(0,0,0,0.7)"
              />
            </TouchableOpacity>
            {expandedSection === "incidents" && (
              <View style={styles.incidentsContainer}>
                {incidentsData.map((incident) => (
                  <TouchableOpacity
                    key={incident.id}
                    style={styles.incidentItem}
                    onPress={() =>
                      router.push({
                        pathname: "/suivresignal",
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
                      <Text style={styles.incidentStatus}>
                        {incident.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Bouton Supprimer */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Supprimer mon compte</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Navbar */}
          <Navbar
            isSidebarVisible={isSidebarVisible}
            setIsSidebarVisible={setIsSidebarVisible}
            router={router}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* Sidebar */}
      <Sidebar
        isSidebarVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </View>
  );
}
