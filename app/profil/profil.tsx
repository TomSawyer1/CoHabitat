import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
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

// Données fictives (seront remplacées par les données de l'API)
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
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    batiment_nom: "", // Pour afficher le nom du bâtiment
  });
  const styles = useProfilStyle();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          router.replace('/login'); // Rediriger si pas de token
          return;
        }

        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await fetch(`http://10.0.2.2:3000/auth/locataire/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFormData({
            nom: data.nom || "",
            prenom: data.prenom || "",
            email: data.email || "",
            telephone: data.telephone || "",
            batiment_nom: data.batiment_nom || "",
          });
        } else {
          console.error("Erreur lors de la récupération du profil:", data.message);
          alert(data.message || "Erreur lors de la récupération du profil.");
          // Optionnel: Déconnecter l'utilisateur si le token est invalide
          // await AsyncStorage.removeItem('userToken');
          // router.replace('/login');
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        alert("Impossible de charger le profil. Veuillez réessayer plus tard.");
        router.replace('/login'); // Rediriger en cas d'erreur majeure (ex: réseau)
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        alert("Non autorisé. Veuillez vous reconnecter.");
        router.replace('/login');
        return;
      }
      
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await fetch(`http://10.0.2.2:3000/auth/locataire/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          // L'adresse n'est pas dans votre schéma de base de données pour les locataires
          // Si vous voulez la mettre à jour, vous devrez l'ajouter au backend et au schéma DB.
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profil mis à jour avec succès !");
      } else {
        alert(data.message || "Erreur lors de la mise à jour du profil.");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Impossible de sauvegarder le profil. Veuillez réessayer plus tard.");
    }
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
              {formData.batiment_nom && (
                <Text style={styles.userBuilding}>{formData.batiment_nom}</Text>
              )}
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

                {/* L'adresse n'est pas dans le schéma de la table locataire, donc nous la retirons pour l'instant */}
                {/*
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
                */}

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

      <Sidebar
        isSidebarVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </View>
  );
}
