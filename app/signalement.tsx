import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Header from "../components/Header";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const { width } = Dimensions.get("window");
const sidebarWidth = 250;

export default function Signalement() {
  const router = useRouter();
  // Vous pouvez ajouter des états ici pour gérer les valeurs des inputs
  const [typeSignalement, setTypeSignalement] = useState("");
  const [lieu, setLieu] = useState("");
  const [dateHeure, setDateHeure] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
                  <Ionicons name="camera" size={24} color="#000" />
                  <Text style={styles.imagePickerButtonText}>
                    Choisir une photo
                  </Text>
                </TouchableOpacity>
                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.selectedImage}
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
    paddingBottom: 40 + 70,
  },
  sectionTitleContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sectionSubtitle: {
    color: "#00000080",
    fontSize: 16,
    opacity: 0.8,
  },
  inputsContainer: {
    marginBottom: 40,
    gap: 20,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  inputFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0000001A",
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: "#f9fafb",
  },
  inputField: {
    flex: 1,
    color: "#000",
    fontSize: 16,
  },
  descriptionInputContainer: {
    height: 120,
  },
  descriptionInputField: {
    height: "100%",
    paddingVertical: 16,
  },
  imagePickerButton: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imagePickerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: "cover",
  },
  buttonsContainerHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  buttonHorizontal: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonHorizontal: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  secondaryButtonHorizontalText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  primaryButtonHorizontal: {
    backgroundColor: "#000",
  },
  primaryButtonHorizontalText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
