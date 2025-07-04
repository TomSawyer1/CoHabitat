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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
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
  const [showTypeList, setShowTypeList] = useState(false);

  // Charger les données utilisateur au démarrage
  useEffect(() => {
    loadUserData();
    setDefaultDateTime();
    loadDraftData();
  }, []);

  // Sauvegarder automatiquement en brouillon
  useEffect(() => {
    if (title || description || etage || numeroPorte) {
      saveDraftData();
    }
  }, [title, description, etage, numeroPorte]);

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

  // Charger les données de brouillon
  const loadDraftData = async () => {
    try {
      const draftData = await AsyncStorage.getItem('signalement_draft');
      if (draftData) {
        const draft = JSON.parse(draftData);
        console.log('📄 [SIGNALEMENT] Brouillon chargé:', draft);
        
        if (draft.title) setTitle(draft.title);
        if (draft.description) setDescription(draft.description);
        if (draft.etage) setEtage(draft.etage);
        if (draft.numeroPorte) setNumeroPorte(draft.numeroPorte);
        if (draft.typeSignalement) setTypeSignalement(draft.typeSignalement);
      }
    } catch (error) {
      console.error('❌ [SIGNALEMENT] Erreur chargement brouillon:', error);
    }
  };

  // Sauvegarder les données en brouillon
  const saveDraftData = async () => {
    try {
      const draftData = {
        title: title.trim(),
        description: description.trim(),
        etage: etage.trim(),
        numeroPorte: numeroPorte.trim(),
        typeSignalement: typeSignalement.trim(),
        lastSaved: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('signalement_draft', JSON.stringify(draftData));
      console.log('💾 [SIGNALEMENT] Brouillon sauvegardé');
    } catch (error) {
      console.error('❌ [SIGNALEMENT] Erreur sauvegarde brouillon:', error);
    }
  };

  const handleSubmit = async () => {
    console.log('🚀 [SIGNALEMENT] Début de l\'envoi du signalement');
    
    // Validation renforcée des champs obligatoires
    const errors: string[] = [];
    
    if (!title.trim()) {
      errors.push('Le titre est obligatoire');
    }
    
    if (!typeSignalement.trim()) {
      errors.push('Le type de signalement est obligatoire');
    }
    
    if (!description.trim()) {
      errors.push('La description est obligatoire');
    }
    
    if (!batiment.trim()) {
      errors.push('Le bâtiment doit être spécifié');
    }
    
    if (!dateHeure.trim()) {
      errors.push('La date et l\'heure sont obligatoires');
    }
    
    // Validation de la longueur des champs
    if (title.trim().length < 5) {
      errors.push('Le titre doit contenir au moins 5 caractères');
    }
    
    if (description.trim().length < 10) {
      errors.push('La description doit contenir au moins 10 caractères');
    }
    
    // Afficher les erreurs de validation
    if (errors.length > 0) {
      Alert.alert(
        'Erreurs de validation',
        errors.join('\n'),
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    
    // Vérification des données utilisateur
    if (!userToken || !userId || !userBuildingId) {
      Alert.alert(
        'Erreur d\'authentification',
        'Vos informations de connexion sont manquantes. Veuillez vous reconnecter.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se reconnecter', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }

    // Confirmation avant envoi
    Alert.alert(
      'Confirmer l\'envoi',
      'Êtes-vous sûr de vouloir envoyer ce signalement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Envoyer', style: 'default', onPress: performSubmit }
      ]
    );
  };

  const performSubmit = async () => {
    setIsLoading(true);
    console.log('📤 [SIGNALEMENT] Préparation de l\'envoi...');

    try {
      // Créer FormData avec toutes les données
      const formData = new FormData();
      formData.append('type', typeSignalement.trim() || title.trim());
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('date', dateHeure.trim());
      formData.append('idUtilisateur', userId!.toString());
      formData.append('idBatiment', userBuildingId!.toString());
      
      // Ajouter les champs optionnels s'ils sont remplis
      if (etage.trim()) {
        formData.append('etage', etage.trim());
      }
      if (numeroPorte.trim()) {
        formData.append('numero_porte', numeroPorte.trim());
      }

      // Ajouter l'image si elle existe
      if (selectedImage) {
        const imageUri = selectedImage;
        const filename = imageUri.split('/').pop() || 'incident.jpg';
        const fileType = filename.split('.').pop() || 'jpg';
        
        console.log('📷 [SIGNALEMENT] Ajout de l\'image:', { filename, fileType });
        
        formData.append('image', {
          uri: imageUri,
          type: `image/${fileType}`,
          name: filename,
        } as any);
      }

      console.log('🌐 [SIGNALEMENT] Envoi vers:', `${API_BASE_URL}/api/incidents`);
      console.log('🔑 [SIGNALEMENT] Token:', userToken ? 'Présent' : 'Absent');

      const response = await fetch(`${API_BASE_URL}/api/incidents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      console.log('📨 [SIGNALEMENT] Statut de la réponse:', response.status);
      
      let result;
      try {
        result = await response.json();
        console.log('📋 [SIGNALEMENT] Réponse complète:', result);
      } catch (parseError) {
        console.error('❌ [SIGNALEMENT] Erreur parsing JSON:', parseError);
        throw new Error('Réponse du serveur invalide');
      }

      if (response.ok && result.success) {
        console.log('✅ [SIGNALEMENT] Signalement envoyé avec succès!');
        
        Alert.alert(
          '🎉 Succès !',
          'Votre signalement a été envoyé avec succès. Le gardien sera notifié dans les plus brefs délais.',
          [
            {
              text: 'Parfait !',
              style: 'default',
                             onPress: async () => {
                 // Réinitialiser le formulaire
                 await resetForm();
                 
                 // Rediriger vers la page d'accueil
                 router.push('/accueil/home');
               },
            },
          ]
        );
      } else {
        // Gestion des erreurs spécifiques du serveur
        let errorMessage = 'Erreur lors de l\'envoi du signalement';
        
        if (result.message) {
          errorMessage = result.message;
        } else if (response.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        } else if (response.status === 400) {
          errorMessage = 'Données invalides. Vérifiez vos informations.';
        } else if (response.status === 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        }
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('❌ [SIGNALEMENT] Erreur complète:', error);
      
      let userMessage = 'Impossible d\'envoyer le signalement. ';
      
      if (error.message.includes('Network')) {
        userMessage += 'Vérifiez votre connexion internet.';
      } else if (error.message.includes('Session expirée')) {
        userMessage += 'Votre session a expiré.';
        Alert.alert(
          'Session expirée',
          'Votre session a expiré. Veuillez vous reconnecter.',
          [{ text: 'Se reconnecter', onPress: () => router.push('/auth/login') }]
        );
        return;
      } else {
        userMessage += error.message || 'Erreur inconnue.';
      }
      
      Alert.alert(
        'Erreur d\'envoi',
        userMessage,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Réessayer', onPress: performSubmit }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = async () => {
    setTitle('');
    setTypeSignalement('');
    setEtage('');
    setNumeroPorte('');
    setDescription('');
    setSelectedImage(null);
    setDefaultDateTime();
    
    // Nettoyer le brouillon
    try {
      await AsyncStorage.removeItem('signalement_draft');
      console.log('🗑️ [SIGNALEMENT] Brouillon supprimé');
    } catch (error) {
      console.error('❌ [SIGNALEMENT] Erreur suppression brouillon:', error);
    }
    
    console.log('🔄 [SIGNALEMENT] Formulaire réinitialisé');
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
          text: "Prendre une photo",
          onPress: takePhoto
        },
        {
          text: "Galerie",
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <TouchableWithoutFeedback
        onPress={() => setIsSidebarVisible(false)}
        disabled={!isSidebarVisible}
      >
        <View style={styles.contentContainer}>
          <Header subtitle="Signalement" showBackButton={false} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Titre et sous-titre de section */}
            <View style={styles.sectionTitleContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>Nouveau Signalement</Text>
                  <Text style={styles.sectionSubtitle}>
                    Décrivez le problème rencontré dans votre résidence.
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#ff6b6b',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    marginLeft: 10,
                  }}
                  onPress={async () => {
                    Alert.alert(
                      'Effacer le brouillon',
                      'Voulez-vous vraiment effacer toutes les données saisies ?',
                      [
                        { text: 'Annuler', style: 'cancel' },
                        { text: 'Effacer', style: 'destructive', onPress: resetForm }
                      ]
                    );
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                    Effacer
                  </Text>
                </TouchableOpacity>
              </View>
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
                <TouchableOpacity
                  style={styles.inputFieldContainer}
                  onPress={() => setShowTypeList(true)}
                >
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}>
                    <Text style={{ 
                      color: typeSignalement ? '#000' : '#888',
                      fontSize: 16,
                      flex: 1,
                    }}>
                      {typeSignalement || "Choisissez le type d'incident"}
                    </Text>
                    <Text style={{ fontSize: 18, color: '#666' }}>▼</Text>
                  </View>
                </TouchableOpacity>
                {showTypeList && (
                  <View style={{ backgroundColor: '#fff', borderRadius: 8, marginTop: 8, elevation: 4, borderWidth: 1, borderColor: '#eee' }}>
                    {signalementTypes.map((type, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{ padding: 12, borderBottomWidth: index < signalementTypes.length - 1 ? 1 : 0, borderBottomColor: '#eee' }}
                        onPress={() => {
                          setTypeSignalement(type);
                          setShowTypeList(false);
                        }}
                      >
                        <Text style={{ fontSize: 16, color: '#000' }}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => setShowTypeList(false)} style={{ padding: 12 }}>
                      <Text style={{ color: '#d32f2f', textAlign: 'center' }}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* Indication visuelle */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ fontSize: 12, color: '#007AFF', marginRight: 8 }}>
                    Appuyez pour sélectionner
                  </Text>
                  {typeSignalement && (
                    <View style={{
                      backgroundColor: '#e8f5e8',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginLeft: 'auto'
                    }}>
                      <Text style={{ fontSize: 12, color: '#007000' }}>Sélectionné</Text>
                    </View>
                  )}
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
                    {selectedImage ? "Changer la photo" : "Ajouter une photo (Appareil ou Galerie)"}
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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryButtonHorizontalText}>
                      Envoi en cours...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonHorizontalText}>
                    Envoyer le signalement
                  </Text>
                )}
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
    </KeyboardAvoidingView>
  );
}
