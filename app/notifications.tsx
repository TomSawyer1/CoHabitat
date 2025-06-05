import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Header from "../components/Header"; // Import du composant Header
import Navbar from "../components/navbar"; // Import de la Navbar
import Sidebar from "../components/sidebar"; // Import de la Sidebar

export default function Notifications() {
  // Nom du composant changé
  const router = useRouter();

  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // État pour la visibilité de la sidebar

  // Exemple de données de notifications (à remplacer par de vraies données)
  const notifications = [
    { id: 1, text: "Nouvelle maintenance prévue le 25/10." },
    { id: 2, text: "Réunion des résidents demain à 18h." },
    { id: 3, text: "Votre signalement #123 a été mis à jour." },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      {/* TouchableWithoutFeedback pour fermer la sidebar au clic extérieur */}
      <TouchableWithoutFeedback
        onPress={() => setIsSidebarVisible(false)}
        disabled={!isSidebarVisible}
      >
        <View style={styles.contentContainer}>
          {/* Header */}
          <Header subtitle="Notifications" showBackButton={false} />

          {/* Contenu principal - Liste de notifications */}
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            {/* Titre de section */}
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Vos Notifications</Text>
            </View>

            {/* Liste des notifications */}
            <View style={styles.notificationsList}>
              {notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                  <Text style={styles.notificationText}>
                    {notification.text}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Ajout de la Navbar en bas */}
          <Navbar
            isSidebarVisible={isSidebarVisible}
            setIsSidebarVisible={setIsSidebarVisible}
            router={router}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* La Sidebar */}
      <Sidebar
        isSidebarVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 40 + 70, // Augmenter le paddingBottom pour laisser de l'espace à la navbar
  },
  sectionTitleContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
  },
  // Nouveaux styles pour la liste de notifications
  notificationsList: {
    // Gap ou margin entre les éléments si nécessaire
    gap: 10,
  },
  notificationItem: {
    backgroundColor: "#f9f9f9", // Couleur de fond pour chaque notification
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  notificationText: {
    fontSize: 16,
    color: "#333",
  },
});
