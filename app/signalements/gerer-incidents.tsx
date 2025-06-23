import { Picker } from "@react-native-picker/picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Header from "../../components/Header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { useGererIncidentsStyle } from "../../hooks/useGererIncidentsStyle";

const { width } = Dimensions.get("window");

// Données fictives pour les incidents
const mockIncident = {
  id: "1",
  title: "Fuite d'eau dans la salle de bain",
  date: "15/03/2024",
  status: "En attente",
  description: "Fuite d'eau importante sous le lavabo de la salle de bain. L'eau s'écoule sur le sol.",
  location: "Appartement 3B - Étage 2",
  type: "Problème technique",
  image: "https://via.placeholder.com/300", // Exemple d'image
  assignedTo: "", // Nouvelle propriété pour l'affectation
};

export default function GererIncidents() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [incidentStatus, setIncidentStatus] = useState("En attente"); // Nouvel état pour le statut
  const [assignedTo, setAssignedTo] = useState(""); // Nouvel état pour l'affectation
  const styles = useGererIncidentsStyle();

  const loadIncident = useCallback(() => {
    if (params.id) {
      setSelectedIncident(mockIncident);
      setIncidentStatus(mockIncident.status);
      setAssignedTo(mockIncident.assignedTo);
    }
  }, [params.id]);

  useEffect(() => {
    loadIncident();
  }, [loadIncident]);

  const handleSendComment = useCallback(() => {
    console.log("Envoyer commentaire:", comment);
    // Logique pour envoyer le commentaire
    setComment("");
  }, [comment]);

  const handleUpdateIncident = useCallback(() => {
    console.log("Mettre à jour l'incident avec statut:", incidentStatus, "et affectation:", assignedTo);
    // Logique pour mettre à jour l'incident (statut, commentaire, affectation)
  }, [incidentStatus, assignedTo, comment]);

  const handleCancel = useCallback(() => {
    console.log("Annuler l'incident");
    // Logique pour annuler l'incident
  }, []);

  const handleContactGuardian = useCallback(() => {
    console.log("Contacter le gardien");
    // Logique pour contacter le gardien
  }, []);

  const handleDelete = useCallback(() => {
    console.log("Supprimer l'incident");
    // Logique pour supprimer l'incident
  }, []);

  const handleCommentChange = useCallback((text: string) => {
    setComment(text);
  }, []);

  // Données statiques pour l'exemple (basées sur le Figma de SuivreSignal)
  const userData = {
    avatar: "", // Placeholder for avatar URL
    name: "John Doe",
    role: "Déclarant",
  };

  const metricsData = selectedIncident ? [
    {
      title: "Type",
      data: selectedIncident.type,
    },
    {
      title: "Lieu",
      data: selectedIncident.location,
    },
    {
      title: "Date",
      data: selectedIncident.date,
    },
    {
      title: "Statut",
      data: incidentStatus,
    },
  ] : [];

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

  if (!selectedIncident) {
    return null;
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
          <Header subtitle="Gérer l'incident" showBackButton={false} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            {/* Section Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userData.name}</Text>
                <Text style={styles.userRole}>{userData.role}</Text>
              </View>
            </View>

            {/* Titre de l'incident */}
            <Text style={styles.incidentTitle}>{selectedIncident.title}</Text>

            {/* Section Métriques */}
            <View style={styles.metricsSection}>
              <Text style={styles.sectionTitle}>Détails de l'incident</Text>
              {metricsData.map((metric, index) => (
                <View key={index} style={styles.metricItem}>
                  <Text style={styles.metricTitle}>{metric.title}</Text>
                  <Text style={styles.metricData}>{metric.data}</Text>
                </View>
              ))}
            </View>

            {/* Section Description */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{selectedIncident.description}</Text>
            </View>

            {/* Section Photo */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Photo</Text>
              <View style={styles.imagePlaceholder}>
                {selectedIncident.image && (
                  <Image
                    source={{ uri: selectedIncident.image }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                )}
              </View>
            </View>

            {/* Section Statut (modifiable) */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Statut de l'incident</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={incidentStatus}
                  onValueChange={(itemValue) => setIncidentStatus(itemValue)}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="En attente" value="En attente" />
                  <Picker.Item label="En cours" value="En cours" />
                  <Picker.Item label="Résolu" value="Résolu" />
                </Picker>
              </View>
            </View>

            {/* Section Affecter à (modifiable) */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Affecter à</Text>
              <TextInput
                style={styles.commentTextFieldPlaceholder}
                placeholder="Ex: Plombier, Électricien..."
                value={assignedTo}
                onChangeText={setAssignedTo}
              />
            </View>

            {/* Champ de texte pour ajouter un commentaire */}
            <View style={styles.commentInputContainer}>
              <Text style={styles.commentInputLabel}>
                Ajouter un commentaire
              </Text>
              <TextInput
                style={styles.commentTextFieldPlaceholder}
                multiline
                placeholder="Ajouter un commentaire..."
                value={comment}
                onChangeText={handleCommentChange}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.buttonFigma,
                styles.primaryButtonFigma,
                styles.sendButtonFigma,
              ]}
              onPress={handleSendComment}
            >
              <Text style={styles.primaryButtonTextFigma}>Envoyer</Text>
            </TouchableOpacity>

            {/* Section Mises à jour et Commentaires (historique) */}
            <View style={styles.updatesSection}>
              <Text style={styles.updatesTitle}>
                Mises à jour et Commentaires
              </Text>
              {updatesData.map((update, index) => (
                <View key={index} style={styles.updateItem}>
                  <View style={styles.updateImagePlaceholder} />
                  <View style={styles.updateContent}>
                    <Text style={styles.updateDate}>{update.date}</Text>
                    <Text style={styles.updateText}>{update.text}</Text>
                    <Text style={styles.updateSubtitle}>{update.subtitle}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Boutons d'action principaux */}
            <View style={styles.buttonsContainerFigma}>
              <TouchableOpacity
                style={[styles.buttonFigma, styles.primaryButtonFigma]}
                onPress={handleUpdateIncident}
              >
                <Text style={styles.primaryButtonTextFigma}>Mettre à jour l'incident</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonFigma, styles.primaryButtonFigma]}
                onPress={handleContactGuardian}
              >
                <Text style={styles.primaryButtonTextFigma}>Contacter le locataire</Text>
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