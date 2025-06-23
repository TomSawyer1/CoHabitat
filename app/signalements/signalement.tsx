import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
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
import { useSignalementStyle } from "../../hooks/useSignalementStyle";

const { width } = Dimensions.get("window");
const sidebarWidth = 250;

export default function Signalement() {
  const router = useRouter();
  const styles = useSignalementStyle();
  // Vous pouvez ajouter des états ici pour gérer les valeurs des inputs
  const [typeSignalement, setTypeSignalement] = useState("");
  const [lieu, setLieu] = useState("");
  const [dateHeure, setDateHeure] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  // Nous allons aussi gérer l'état de la sidebar ici comme dans home.tsx
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleSubmit = () => {
    // Logique pour soumettre le signalement
    console.log("Signalement soumis:", {
      typeSignalement,
      lieu,
      dateHeure,
      description,
      selectedImage,
      title,
    });
    // Rediriger ou afficher un message de succès
    // router.back(); // Exemple de redirection
    // Après soumission, on pourrait naviguer ou afficher un message
  };

  const pickImage = async () => {
    // Demande la permission d'accéder à la galerie de photos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Désolé, nous avons besoin des permissions de la galerie pour que cela fonctionne !",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
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
          <Header subtitle="Signalement" showBackButton={false} />

          {/* Contenu principal */}
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            {/* Titre et sous-titre de section */}
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Nouveau Signalement</Text>
              <Text style={styles.sectionSubtitle}>
                Veuillez décrire le problème ou l'incident.
              </Text>
            </View>

            {/* Inputs */}
            <View style={styles.inputsContainer}>
              {/* Input Titre */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Titre de l'incident</Text>
                <View style={styles.inputFieldContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Ex: Fuite d'eau, Problème de chauffage"
                    placeholderTextColor="#888"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
              </View>

              {/* Input Type de signalement */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Type de signalement</Text>
                <View style={styles.inputFieldContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Ex: Vandalisme, Problème technique"
                    placeholderTextColor="#888"
                    value={typeSignalement}
                    onChangeText={setTypeSignalement}
                  />
                </View>
              </View>

              {/* Input Lieu */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Lieu</Text>
                <View style={styles.inputFieldContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Ex: Bâtiment A, Appartement 3B"
                    placeholderTextColor="#888"
                    value={lieu}
                    onChangeText={setLieu}
                  />
                </View>
              </View>

              {/* Input Date et Heure */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date et Heure</Text>
                <View style={styles.inputFieldContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Ex: 20/10/2023 14:30"
                    placeholderTextColor="#888"
                    value={dateHeure}
                    onChangeText={setDateHeure}
                  />
                </View>
              </View>

              {/* Input Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <View
                  style={[
                    styles.inputFieldContainer,
                    styles.descriptionInputContainer,
                  ]}
                >
                  <TextInput
                    style={[styles.inputField, styles.descriptionInputField]}
                    placeholder="Décrivez le problème en détail"
                    placeholderTextColor="#888"
                    multiline
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>
              </View>

              {/* Section Ajout Photo */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Photo (optionnel)</Text>
                <TouchableOpacity
                  style={styles.imagePickerButton}
                  onPress={pickImage}
                >
                  <Text style={styles.imagePickerButtonText}>
                    {selectedImage ? "Changer la photo" : "Choisir une photo"}
                  </Text>
                </TouchableOpacity>
                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.selectedImage}
                    resizeMode="cover"
                  />
                )}
              </View>
            </View>

            {/* Boutons */}
            <View style={styles.buttonsContainerHorizontal}>
              {/* Secondaire */}
              <TouchableOpacity
                style={[
                  styles.buttonHorizontal,
                  styles.secondaryButtonHorizontal,
                ]}
                onPress={() => router.back()}
              >
                <Text style={styles.secondaryButtonHorizontalText}>
                  Annuler
                </Text>
              </TouchableOpacity>

              {/* Primaire */}
              <TouchableOpacity
                style={[
                  styles.buttonHorizontal,
                  styles.primaryButtonHorizontal,
                ]}
                onPress={handleSubmit}
              >
                <Text style={styles.primaryButtonHorizontalText}>
                  Soumettre
                </Text>
              </TouchableOpacity>
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
