import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Header from "../../components/Header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { useSuivreSignalStyle } from "../../hooks/useSuivreSignalStyle";

const { width } = Dimensions.get("window");
const sidebarWidth = 250;

export default function SuivreSignal() {
  const router = useRouter();
  const styles = useSuivreSignalStyle();
  const params = useLocalSearchParams();
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(false);

  // Récupérer les données de l'incident depuis les paramètres
  const incident = {
    id: params.id,
    title: params.title,
    date: params.date,
    status: params.status,
    description: "Description détaillée de l'incident...",
    lieu: "Bâtiment A, Appartement 3B",
    type: "Problème technique",
    image: params.image as string | undefined,
  };

  // Données statiques pour l'exemple (basées sur le Figma)
  const userData = {
    avatar: "", // Placeholder for avatar URL
    name: "John Doe",
    role: "Déclarant",
  };

  const metricsData = [
    {
      title: "Type",
      data: incident.type,
      change: "", // No change shown in Figma metric example
    },
    {
      title: "Lieu",
      data: incident.lieu,
      change: "", // No change shown in Figma metric example
    },
    {
      title: "Date",
      data: incident.date,
      change: "", // No change shown in Figma metric example
    },
    {
      title: "Statut",
      data: incident.status,
      change: "", // No change shown in Figma metric example
    },
  ];

  const updatesData = [
    {
      date: "20/10/2023 15:00",
      text: "Statut mis à jour : En cours de traitement.",
      subtitle: "par Admin",
    },
    {
      date: "20/10/2023 16:30",
      text: "Un technicien a été dépêché sur place.",
      subtitle: "par Système",
    },
  ];

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
          <Header subtitle="Suivre un incident" showBackButton={false} />

          {/* Contenu principal */}
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            {/* Section Avatar (basé sur le Figma) */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userData.name}</Text>
                <Text style={styles.userRole}>{userData.role}</Text>
              </View>
            </View>

            {/* Titre de l'incident */}
            <Text style={styles.incidentTitle}>{incident.title}</Text>

            {/* Section Métriques (basé sur le Figma) */}
            <View style={styles.metricsSection}>
              <Text style={styles.sectionTitle}>Détails de l'incident</Text>
              {metricsData.map((metric, index) => (
                <View key={index} style={styles.metricItem}>
                  <Text style={styles.metricTitle}>{metric.title}</Text>
                  <Text style={styles.metricData}>{metric.data}</Text>
                  {/* Pas de 'change' dans le design Figma pour cette section */}
                </View>
              ))}
            </View>

            {/* Section Statut et Progression (comme avant, légèrement stylisé) */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Statut de l'incident</Text>
              <View style={styles.statusProgressContainer}>
                <Text style={styles.statusText}>{incident.status}</Text>
                <Text style={styles.progressLabel}>
                  Progrès de votre demande
                </Text>
                {/* Placeholder pour la barre de progression */}
                <View style={styles.progressBarPlaceholder}></View>
              </View>
            </View>

            {/* Section Description */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{incident.description}</Text>
            </View>

            {/* Section Mises à jour et Commentaires (basé sur le Figma) */}
            <View style={styles.updatesSection}>
              <Text style={styles.updatesTitle}>
                Mises à jour et Commentaires
              </Text>
              {updatesData.map((update, index) => (
                <View key={index} style={styles.updateItem}>
                  <View style={styles.updateImagePlaceholder} />
                  {/* Placeholder pour icône/image */}
                  <View style={styles.updateContent}>
                    <Text style={styles.updateDate}>{update.date}</Text>
                    <Text style={styles.updateText}>{update.text}</Text>
                    <Text style={styles.updateSubtitle}>{update.subtitle}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Champ de texte pour ajouter un commentaire (basé sur le Figma) */}
            <View style={styles.commentInputContainer}>
              <Text style={styles.commentInputLabel}>
                Ajouter un commentaire
              </Text>
              {/* Utiliser un TextInput ici */}
              <View style={styles.commentTextFieldPlaceholder}></View>
              {/* Placeholder pour TextInput */}
            </View>
            <TouchableOpacity
              style={
                [
                  styles.buttonFigma,
                  styles.primaryButtonFigma,
                  styles.sendButtonFigma,
                ] /* Ajusté pour être un bouton plein */
              }
              onPress={() => {
                // Logique pour envoyer le commentaire
                console.log("Envoyer commentaire");
              }}
            >
              <Text style={styles.primaryButtonTextFigma}>Envoyer</Text>
            </TouchableOpacity>

            {/* Boutons d'action principaux (basés sur le Figma) */}
            <View style={styles.buttonsContainerFigma}>
              {" "}
              {/* Conteneur pour Annuler et Contacter */}
              <TouchableOpacity
                style={[styles.buttonFigma, styles.secondaryButtonFigma]}
                onPress={() => {
                  // Logique pour annuler l'incident
                  console.log("Annuler l'incident");
                }}
              >
                <Text style={styles.secondaryButtonTextFigma}>
                  {"Annuler l'incident"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonFigma, styles.primaryButtonFigma]}
                onPress={() => {
                  // Logique pour contacter le gardien
                  console.log("Contacter le gardien");
                }}
              >
                <Text style={styles.primaryButtonTextFigma}>
                  {"Contacter le gardien"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bouton Supprimer (basé sur le Figma) */}
            <TouchableOpacity
              style={[styles.buttonFigma, styles.deleteButtonFigma]}
              onPress={() => {
                // Logique pour supprimer l'incident
                console.log("Supprimer l'incident");
              }}
            >
              <Text style={styles.deleteButtonTextFigma}>Supprimer</Text>
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
