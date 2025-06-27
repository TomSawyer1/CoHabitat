import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
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
import { API_BASE_URL } from "../../config";
import { useSignalementStyle } from "../../hooks/useSignalementStyle";

const { width } = Dimensions.get("window");
const sidebarWidth = 250;

export default function Signalement() {
  const router = useRouter();
  const styles = useSignalementStyle();
  
  // États du formulaire
  const [typeSignalement, setTypeSignalement] = useState("");
  const [etage, setEtage] = useState("");
  const [numeroPorte, setNumeroPorte] = useState("");
  const [dateHeure, setDateHeure] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [batiment, setBatiment] = useState("");
  
  // États pour l'UI et les données utilisateur
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userBuildingId, setUserBuildingId] = useState<number | null>(null);
  const [userBuildingName, setUserBuildingName] = useState<string | null>(null);

  // Charger les données utilisateur au démarrage
  useEffect(() => {
    loadUserData();
    setDefaultDateTime();
  }, []);

  const loadUserData = async () => {
    try {
      const [token, id, buildingId, buildingName] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('userBuildingId'),
        AsyncStorage.getItem('userBuildingName')
      ]);
      
      console.log('📱 [SIGNALEMENT] Données utilisateur:', { token: !!token, id, buildingId, buildingName });
      
      if (token && id) {
        setUserToken(token);
        setUserId(parseInt(id));
        if (buildingId) {
          setUserBuildingId(parseInt(buildingId));
        }
        if (buildingName) {
          setUserBuildingName(buildingName);
          setBatiment(buildingName); // Auto-remplir le champ bâtiment
        }
      } else {
        Alert.alert(
          'Erreur',
          'Vous devez être connecté pour signaler un incident.',
          [{ text: 'OK', onPress: () => router.push('/auth/login') }]
        );
      }
    } catch (error) {
      console.error('❌ [SIGNALEMENT] Erreur chargement données:', error);
      Alert.alert('Erreur', 'Impossible de charger vos informations.');
    }
  };

  const setDefaultDateTime = () => {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setDateHeure(formattedDate);
  };

  const handleSubmit = async () => {
    // Validation des champs obligatoires
    if (!title.trim()) {
      Alert.alert('Erreur', 'Le titre est obligatoire.');
      return;
    }
    if (!typeSignalement.trim()) {
      Alert.alert('Erreur', 'Le type de signalement est obligatoire.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Erreur', 'La description est obligatoire.');
      return;
    }
    if (!userToken || !userId || !userBuildingId) {
      Alert.alert('Erreur', 'Informations utilisateur manquantes. Veuillez vous reconnecter.');
      return;
    }

    setIsLoading(true);

    try {
      // Créer FormData pour l'envoi avec image
      const formData = new FormData();
      formData.append('type', title.trim());
      formData.append('description', description.trim());
      formData.append('date', dateHeure);
      formData.append('idUtilisateur', userId.toString());
      formData.append('idBatiment', userBuildingId.toString());
      if (etage.trim()) {
        formData.append('etage', etage.trim());
      }
      if (numeroPorte.trim()) {
        formData.append('numero_porte', numeroPorte.trim());
      }

      // Ajouter l'image si elle existe
      if (selectedImage) {
        const imageUri = selectedImage;
        const filename = imageUri.split('/').pop();
        const fileType = filename?.split('.').pop();
        
        formData.append('image', {
          uri: imageUri,
          type: `image/${fileType}`,
          name: filename || 'incident.jpg',
        } as any);
      }

      console.log('🚀 [SIGNALEMENT] Envoi en cours...');

      const response = await fetch(`${API_BASE_URL}/api/incidents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      console.log('📨 [SIGNALEMENT] Réponse:', result);

      if (response.ok && result.success) {
        Alert.alert(
          'Succès !',
          'Votre signalement a été envoyé avec succès. Le gardien sera notifié.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Réinitialiser le formulaire
                setTitle('');
                setTypeSignalement('');
                setEtage('');
                setNumeroPorte('');
                setDescription('');
                setSelectedImage(null);
                setDefaultDateTime();
                
                // Rediriger vers la page home
                router.push('/accueil/home');
              },
            },
          ]
        );
      } else {
        throw new Error(result.message || 'Erreur lors de l\'envoi du signalement');
      }
    } catch (error: any) {
      console.error('❌ [SIGNALEMENT] Erreur:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Impossible d\'envoyer le signalement. Vérifiez votre connexion.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    Alert.alert(
      "Ajouter une photo",
      "Comment souhaitez-vous ajouter une photo ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "📷 Prendre une photo",
          onPress: takePhoto
        },
        {
          text: "🖼️ Galerie",
          onPress: pickFromGallery
        }
      ]
    );
  };

  const takePhoto = async () => {
    // Demande la permission d'utiliser l'appareil photo
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin d'accéder à votre appareil photo pour prendre une photo."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    console.log('📷 [SIGNALEMENT] Photo prise:', result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    // Demande la permission d'accéder à la galerie de photos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin d'accéder à votre galerie pour ajouter une photo à votre signalement."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Optimiser la qualité pour l'upload
    });

    console.log('🖼️ [SIGNALEMENT] Image sélectionnée:', result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Types de signalement prédéfinis
  const signalementTypes = [
    "Problème de plomberie",
    "Problème électrique",
    "Problème de chauffage",
    "Vandalisme",
    "Bruit excessif",
    "Problème d'ascenseur",
    "Éclairage défaillant",
    "Problème de sécurité",
    "Autre"
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
                Décrivez le problème rencontré dans votre résidence.
              </Text>
            </View>

            {/* Inputs */}
            <View style={styles.inputsContainer}>
              {/* Input Titre */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Titre de l'incident *</Text>
                <View style={styles.inputFieldContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Ex: Fuite d'eau dans la salle de bain"
                    placeholderTextColor="#888"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
              </View>

              {/* Input Type de signalement */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Type de signalement *</Text>
                <View style={styles.inputFieldContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Choisissez ou tapez le type d'incident"
                    placeholderTextColor="#888"
                    value={typeSignalement}
                    onChangeText={setTypeSignalement}
                  />
                </View>
                {/* Suggestion rapide */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                  {signalementTypes.slice(0, 3).map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        backgroundColor: '#e0e0e0',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 16,
                        marginRight: 8,
                        marginBottom: 4,
                      }}
                      onPress={() => setTypeSignalement(type)}
                    >
                      <Text style={{ fontSize: 12, color: '#333' }}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Input Étage */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Étage (optionnel)</Text>
                <View style={styles.inputFieldContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Ex: RDC, 1, 2, 3..."
                    placeholderTextColor="#888"
                    value={etage}
                    onChangeText={setEtage}
                  />
                </View>
              </View>

              {/* Input Numéro de porte */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Numéro de porte (optionnel)</Text>
                <View style={styles.inputFieldContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Ex: 101, 23A, 5..."
                    placeholderTextColor="#888"
                    value={numeroPorte}
                    onChangeText={setNumeroPorte}
                    keyboardType="default"
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

              {/* Champ Bâtiment (auto-rempli) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bâtiment</Text>
                <View style={styles.inputFieldContainer}>
                  <TextInput
                    style={[styles.inputField, { backgroundColor: '#f5f5f5' }]}
                    placeholder="Bâtiment non défini"
                    placeholderTextColor="#888"
                    value={batiment}
                    editable={false}
                  />
                </View>
              </View>

              {/* Input Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description détaillée *</Text>
                <View
                  style={[
                    styles.inputFieldContainer,
                    styles.descriptionInputContainer,
                  ]}
                >
                  <TextInput
                    style={[styles.inputField, styles.descriptionInputField]}
                    placeholder="Décrivez le problème en détail : que s'est-il passé ? Quand ? Quelles sont les conséquences ?"
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
                    {selectedImage ? "Changer la photo" : "📷 Ajouter une photo (Appareil ou Galerie)"}
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
                disabled={isLoading}
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
                  isLoading && { opacity: 0.6 }
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.primaryButtonHorizontalText}>
                    Envoyer le signalement
                  </Text>
                )}
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
