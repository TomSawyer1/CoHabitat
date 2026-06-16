import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { apiFetch } from "../../config/api";
import { useSignalementStyle } from "../../hooks/useSignalementStyle";

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
  const [showEtageList, setShowEtageList] = useState(false);
  const [buildingFloors, setBuildingFloors] = useState(0);

  // Charger les données utilisateur au démarrage
  useEffect(() => {
    loadUserData();
    setDefaultDateTime();
    loadDraftData();
  }, []);

  // Sauvegarder automatiquement en brouillon (avec debounce pour éviter
  // une écriture AsyncStorage à chaque frappe — au pire 1 écriture / 800ms).
  useEffect(() => {
    if (!title && !description && !etage && !numeroPorte && !typeSignalement) {
      return;
    }
    const timer = setTimeout(() => {
      saveDraftData();
    }, 800);
    return () => clearTimeout(timer);
  }, [title, description, etage, numeroPorte, typeSignalement]);

  const loadUserData = async () => {
    try {
      const [token, id, buildingId, buildingName] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('userBuildingId'),
        AsyncStorage.getItem('userBuildingName')
      ]);
      
      if (__DEV__) console.log('📱 [SIGNALEMENT] Données utilisateur:', { hasToken: !!token, hasUserId: !!id, hasBuildingId: !!buildingId });
      
      if (token && id) {
        setUserToken(token);
        setUserId(parseInt(id));
        if (buildingId) {
          setUserBuildingId(parseInt(buildingId));
        }
        if (buildingName) {
          setUserBuildingName(buildingName);
          setBatiment(buildingName);
        }
        // Récupérer le nombre d'étages du bâtiment pour le sélecteur
        const buildingRes = await apiFetch(`/api/buildings/${id}`);
        if (buildingRes.ok) {
          const buildingData = await buildingRes.json();
          if (buildingData.success) {
            setBuildingFloors(buildingData.building.floors ?? 0);
          }
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
        if (__DEV__) console.log('📄 [SIGNALEMENT] Brouillon chargé (champs):', Object.keys(draft || {}));
        
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
      if (__DEV__) console.log('💾 [SIGNALEMENT] Brouillon sauvegardé');
    } catch (error) {
      console.error('❌ [SIGNALEMENT] Erreur sauvegarde brouillon:', error);
    }
  };

  const handleSubmit = async () => {
    if (__DEV__) console.log('🚀 [SIGNALEMENT] Début de l\'envoi du signalement');
    
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
    if (__DEV__) console.log('📤 [SIGNALEMENT] Préparation de l\'envoi...');

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
        
        if (__DEV__) console.log('📷 [SIGNALEMENT] Ajout de l\'image:', { filename, fileType });
        
        formData.append('image', {
          uri: imageUri,
          type: `image/${fileType}`,
          name: filename,
        } as any);
      }

      if (__DEV__) console.log('🔑 [SIGNALEMENT] Token:', userToken ? 'Présent' : 'Absent');

      const response = await apiFetch('/api/incidents', {
        method: 'POST',
        body: formData,
        isMultipart: true,
      });

      if (__DEV__) console.log('📨 [SIGNALEMENT] Statut de la réponse:', response.status);
      
      let result;
      try {
        result = await response.json();
        if (__DEV__) console.log('📋 [SIGNALEMENT] Réponse (success/message):', { success: result?.success, message: result?.message });
      } catch (parseError) {
        if (__DEV__) console.error('❌ [SIGNALEMENT] Erreur parsing JSON:', parseError);
        throw new Error('Réponse du serveur invalide');
      }

      if (response.ok && result.success) {
        if (__DEV__) console.log('✅ [SIGNALEMENT] Signalement envoyé avec succès!');
        
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
      if (__DEV__) console.error('❌ [SIGNALEMENT] Erreur complète:', error);
      
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
      mediaTypes: ['images'],
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
      mediaTypes: ['images'],
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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
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
            {/* En-tête */}
            <View style={styles.formHeader}>
              <View style={styles.formHeaderRow}>
                <Text style={styles.sectionTitle}>Nouveau{'\n'}Signalement</Text>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() =>
                    Alert.alert(
                      'Effacer le brouillon',
                      'Voulez-vous effacer toutes les données saisies ?',
                      [
                        { text: 'Annuler', style: 'cancel' },
                        { text: 'Effacer', style: 'destructive', onPress: resetForm },
                      ]
                    )
                  }
                >
                  <Text style={styles.clearButtonText}>Effacer</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionSubtitle}>
                Décrivez le problème rencontré dans votre résidence.
              </Text>
              {batiment ? (
                <View style={styles.buildingBadge}>
                  <Ionicons name="business-outline" size={13} color="#0369a1" style={{ marginRight: 5 }} />
                  <Text style={styles.buildingBadgeText}>{batiment}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.inputsContainer}>

              {/* Titre */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Titre <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.inputFieldContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Ex : Fuite d'eau dans la salle de bain"
                    placeholderTextColor="#9ca3af"
                    value={title}
                    onChangeText={setTitle}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Type de signalement */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Type <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.typeSelector}
                  onPress={() => setShowTypeList(!showTypeList)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.typeSelectorText,
                    typeSignalement ? styles.typeSelectorValue : styles.typeSelectorPlaceholder,
                  ]}>
                    {typeSignalement || "Choisissez un type"}
                  </Text>
                  <Ionicons
                    name={showTypeList ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#6b7280"
                  />
                </TouchableOpacity>
                {showTypeList && (
                  <View style={styles.typeDropdown}>
                    {signalementTypes.map((type, index) => (
                      <View key={type}>
                        <TouchableOpacity
                          style={styles.typeDropdownItem}
                          onPress={() => { setTypeSignalement(type); setShowTypeList(false); }}
                        >
                          <Text style={styles.typeDropdownItemText}>{type}</Text>
                        </TouchableOpacity>
                        {index < signalementTypes.length - 1 && (
                          <View style={styles.typeDropdownSeparator} />
                        )}
                      </View>
                    ))}
                    <TouchableOpacity style={styles.typeDropdownCancel} onPress={() => setShowTypeList(false)}>
                      <Text style={styles.typeDropdownCancelText}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Description <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={[styles.inputFieldContainer, styles.descriptionInputContainer]}>
                  <TextInput
                    style={[styles.inputField, styles.descriptionInputField]}
                    placeholder="Que s'est-il passé ? Depuis quand ? Quelles sont les conséquences ?"
                    placeholderTextColor="#9ca3af"
                    multiline
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>
              </View>

              {/* Étage + Numéro de porte sur la même ligne */}
              <View style={styles.inputRowGroup}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Étage</Text>
                  <TouchableOpacity
                    style={styles.typeSelector}
                    onPress={() => setShowEtageList(!showEtageList)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.typeSelectorText,
                      etage ? styles.typeSelectorValue : styles.typeSelectorPlaceholder,
                    ]}>
                      {etage || "Choisir"}
                    </Text>
                    <Ionicons
                      name={showEtageList ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                  {showEtageList && (
                    <View style={[styles.typeDropdown, { position: 'absolute', top: 72, left: 0, right: 0, zIndex: 10 }]}>
                      {["RDC", ...Array.from({ length: buildingFloors }, (_, i) => String(i + 1))].map((floor, index, arr) => (
                        <View key={floor}>
                          <TouchableOpacity
                            style={styles.typeDropdownItem}
                            onPress={() => { setEtage(floor); setShowEtageList(false); }}
                          >
                            <Text style={styles.typeDropdownItemText}>
                              {floor === "RDC" ? "Rez-de-chaussée" : `Étage ${floor}`}
                            </Text>
                          </TouchableOpacity>
                          {index < arr.length - 1 && <View style={styles.typeDropdownSeparator} />}
                        </View>
                      ))}
                      <TouchableOpacity style={styles.typeDropdownCancel} onPress={() => setShowEtageList(false)}>
                        <Text style={styles.typeDropdownCancelText}>Annuler</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>N° de porte</Text>
                  <View style={styles.inputFieldContainer}>
                    <TextInput
                      style={styles.inputField}
                      placeholder="101, 23A…"
                      placeholderTextColor="#9ca3af"
                      value={numeroPorte}
                      onChangeText={setNumeroPorte}
                    />
                  </View>
                </View>
              </View>

              {/* Photo */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Photo</Text>
                <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                  <Ionicons
                    name={selectedImage ? "camera" : "camera-outline"}
                    size={18}
                    color="#6b7280"
                  />
                  <Text style={styles.imagePickerButtonText}>
                    {selectedImage ? "Changer la photo" : "Ajouter une photo"}
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
              <TouchableOpacity
                style={[styles.buttonHorizontal, styles.secondaryButtonHorizontal]}
                onPress={() => router.back()}
                disabled={isLoading}
              >
                <Text style={styles.secondaryButtonHorizontalText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonHorizontal, styles.primaryButtonHorizontal, isLoading && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ActivityIndicator color="white" size="small" />
                    <Text style={styles.primaryButtonHorizontalText}>Envoi…</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonHorizontalText}>Envoyer</Text>
                )}
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Navbar
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
        router={router}
      />

      <Sidebar
        isSidebarVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </View>
  );
}
