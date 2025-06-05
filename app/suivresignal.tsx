import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Header from "../components/Header";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const { width } = Dimensions.get("window");
const sidebarWidth = 250;

export default function SuivreSignal() {
  const router = useRouter();
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
    paddingTop: 0, // Ajusté pour tenir compte du header dans le ScrollView
    paddingHorizontal: 0, // Retiré ici, géré par les conteneurs de section
    paddingBottom: 40 + 70 + 60, // Garde de l'espace pour la navbar
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24, // Espacement vertical basé sur le Figma
    paddingHorizontal: 24, // Espacement horizontal basé sur le Figma
    marginBottom: 30, // Réduit légèrement l'espacement après l'avatar
    borderBottomWidth: 1, // Ajouté pour la ligne séparatrice visible dans le Figma
    borderBottomColor: "rgba(0,0,0,0.1)", // Couleur de la ligne séparatrice
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20, // Cercle
    backgroundColor: "rgba(0,0,0,0.1)", // Placeholder grisé
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20, // Ajusté selon Figma
    fontWeight: "bold",
    color: "#000",
  },
  userRole: {
    fontSize: 14,
    color: "rgba(0,0,0,0.5)",
  },
  incidentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30, // Réduit légèrement l'espacement après le titre
    paddingHorizontal: 24, // Ajusté selon l'espacement général dans le Figma
  },
  headerSection: {
    marginBottom: 20,
    paddingHorizontal: 24, // Ajusté selon l'espacement général dans le Figma
    // Vérifier si un paddingVertical est nécessaire ici ou dans le contenu
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  statusContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  status: {
    fontSize: 14,
    color: "#000",
  },
  imageContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  incidentImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    marginBottom: 0,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  detailLabel: {
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#000",
    opacity: 0.8,
  },
  // Styles pour la nouvelle section Mises à jour et Commentaires
  updatesSection: {
    marginTop: 30, // Espacement avant les mises à jour
    marginBottom: 30, // Espacement après les mises à jour
    paddingHorizontal: 24, // Ajouté pour aligner avec les autres sections
  },
  updatesTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20, // Augmenté l'espacement après le titre
  },
  updateItem: {
    flexDirection: "row",
    paddingVertical: 16, // Augmenté l'espacement vertical
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    alignItems: "flex-start",
    gap: 16, // Augmenté l'espacement entre l'icône et le contenu
  },
  updateImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8, // Augmenté le rayon pour un look plus moderne
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  updateContent: {
    flex: 1,
    gap: 8, // Ajouté un espacement entre les éléments de texte
  },
  updateDate: {
    fontSize: 14,
    color: "rgba(0,0,0,0.5)",
    marginBottom: 4,
  },
  updateText: {
    fontSize: 16,
    color: "#000",
    lineHeight: 22, // Ajouté pour améliorer la lisibilité
    marginBottom: 4,
  },
  updateSubtitle: {
    fontSize: 14,
    color: "rgba(0,0,0,0.5)",
    fontStyle: "italic", // Ajouté pour distinguer le sous-titre
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  secondaryButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#000",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ff0000",
    height: 42,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Nouveaux styles basés sur la structure de liste du Figma
  sectionContainer: {
    marginBottom: 40, // Espacement après la description et le statut
    paddingHorizontal: 24, // Ajusté selon l'espacement général dans le Figma
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600", // Poids de police ajusté selon Figma
    color: "#000", // Couleur du texte
    marginBottom: 16, // Espacement sous le titre de section basé sur Figma
    // Padding horizontal géré par le conteneur de section
  },
  declarantText: {
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 24, // Ajusté selon l'espacement général dans le Figma
  },
  statusProgressContainer: {
    paddingHorizontal: 0, // Retiré, géré par le conteneur
  },
  statusText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  progressBarPlaceholder: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  detailsContent: {
    paddingHorizontal: 24,
  },
  // Nouveau style pour le texte de progrès
  progressLabel: {
    fontSize: 14,
    color: "#666", // Couleur légèrement grisée
    marginBottom: 5, // Petit espace en dessous
  },
  // Styles pour la section Métriques (basé sur le Figma)
  metricsSection: {
    marginBottom: 40, // Espacement après les métriques
    paddingHorizontal: 24, // Ajusté selon l'espacement général dans le Figma
  },
  metricItem: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 6,
    padding: 16, // Ajusté pour l'espacement interne selon le Figma
    marginBottom: 8, // Espacement entre les éléments métriques selon le Figma (8px entre les 'row')
    paddingHorizontal: 24, // Ajusté selon l'espacement général dans le Figma
  },
  metricTitle: {
    fontSize: 14,
    color: "rgba(0,0,0,0.5)", // Couleur du titre de métrique
    marginBottom: 4, // Petit espacement sous le titre de métrique
    // Pas de padding horizontal spécifique ici, géré par le conteneur item
  },
  metricData: {
    fontSize: 18,
    fontWeight: "600", // Poids de police ajusté
    color: "#000",
    // Pas de padding ou margin spécifique ici
  },
  // Styles pour le champ de commentaire
  commentInputContainer: {
    marginTop: 32, // Augmenté l'espacement du haut
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  commentInputLabel: {
    fontSize: 18, // Augmenté la taille de la police
    fontWeight: "600",
    color: "#000",
    marginBottom: 16, // Augmenté l'espacement sous le label
  },
  commentTextFieldPlaceholder: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 12, // Augmenté le rayon pour un look plus moderne
    minHeight: 120, // Augmenté la hauteur minimale
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  // Styles pour les boutons ajustés (basé sur le Figma)
  buttonsContainerFigma: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8, // Espacement réduit selon le Figma
    marginTop: 30, // Espacement après le bouton Envoyer
    marginBottom: 24, // Espacement avant le bouton Supprimer
    paddingHorizontal: 24, // Ajusté selon l'espacement général dans le Figma
  },
  buttonFigma: {
    flex: 1, // Permet aux boutons de prendre l'espace disponible
    height: 42,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // Ajouté pour le padding interne du bouton
  },
  secondaryButtonFigma: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  secondaryButtonTextFigma: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  primaryButtonFigma: {
    backgroundColor: "#000",
  },
  primaryButtonTextFigma: {
    color: "#fff",
    fontWeight: "700", // Augmenté le poids de la police
    fontSize: 16,
    letterSpacing: 0.5, // Ajouté un espacement entre les lettres
  },
  deleteButtonFigma: {
    backgroundColor: "#ff0000", // Couleur rouge
    marginTop: 24, // Espacement après Annuler/Contacter
    alignSelf: "stretch", // Prend toute la largeur
    marginHorizontal: 24, // Assure le même espacement horizontal que les sections
  },
  deleteButtonTextFigma: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  sendButtonFigma: {
    marginTop: 20, // Augmenté l'espacement du haut
    marginBottom: 32, // Augmenté l'espacement du bas
    width: 180, // Augmenté la largeur du bouton
    alignSelf: "flex-end",
    paddingHorizontal: 24, // Augmenté le padding horizontal
    height: 48, // Augmenté la hauteur du bouton
    borderRadius: 12, // Augmenté le rayon pour correspondre au champ de texte
    marginRight: 24, // Ajouté une marge à droite pour l'alignement
  },
  descriptionText: {
    fontSize: 16,
    color: "#000",
    // Ajoutez d'autres styles si nécessaire pour correspondre au Figma
  },
});
