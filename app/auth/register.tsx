import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Header from "../../components/Header";
import { API_BASE_URL } from "../../config";
import { apiFetch } from "../../config/api";
import { useRegisterStyle } from "../../hooks/useRegisterStyle";

export default function Register() {
  const router = useRouter();
  const styles = useRegisterStyle();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telephone, setTelephone] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [buildings, setBuildings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buildingsLoading, setBuildingsLoading] = useState(true);
  const [showBuildingList, setShowBuildingList] = useState(false);

  // Charger les bâtiments au démarrage
  useEffect(() => {
    const fetchBuildings = async () => {
      setBuildingsLoading(true);
      try {
        // Récupérer le token
        const response = await apiFetch('/api/buildings', { auth: false });
        if (__DEV__) console.log('📡 [REGISTER] buildings status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          if (__DEV__) console.log('🏢 [REGISTER] buildings count:', Array.isArray(data?.buildings) ? data.buildings.length : 0);
          
          // Extraire le tableau de bâtiments de la réponse
          if (data.success && Array.isArray(data.buildings)) {
            setBuildings(data.buildings);
          } else {
            if (__DEV__) console.error('[REGISTER] Format de réponse inattendu:', data);
            setBuildings([]);
            Alert.alert("Erreur", "Format de données des bâtiments invalide.");
          }
        } else {
          if (__DEV__) console.error("[REGISTER] Erreur lors de la récupération des bâtiments:", response.status);
          Alert.alert("Erreur", "Impossible de charger la liste des bâtiments. Vérifiez que le serveur est démarré.");
        }
      } catch (error) {
        if (__DEV__) console.error("Erreur réseau lors de la récupération des bâtiments:", error);
        Alert.alert("Erreur", "Impossible de se connecter au serveur pour charger les bâtiments.");
      } finally {
        setBuildingsLoading(false);
      }
    };
    fetchBuildings();
  }, []);

  const handleRegister = async () => {
    if (__DEV__) console.log('🚀 [REGISTER] Tentative d\'inscription', { hasEmail: !!email, hasPhone: !!telephone, hasBuilding: !!selectedBuilding });
    
    // Validation des mots de passe
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    // Vérification des champs requis
    if (!email || !nom || !prenom || !telephone || !selectedBuilding || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Veuillez entrer un email valide.");
      return;
    }

    // Validation mot de passe
    if (password.length < 8) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch('/auth/register/locataire', {
        method: 'POST',
        auth: false,
        body: {
          email: email.toLowerCase().trim(),
          nom: nom.trim(),
          prenom: prenom.trim(),
          telephone: telephone.trim(),
          batiment: selectedBuilding,
          password,
        },
      });

      if (__DEV__) console.log('📡 [REGISTER] Réponse inscription:', response.status);
      const data = await response.json();
      if (__DEV__) console.log('📄 [REGISTER] Réponse inscription (success/message):', { success: data?.success, message: data?.message });

      if (response.ok) {
        Alert.alert(
          "Succès", 
          "Inscription réussie ! Vous pouvez maintenant vous connecter.",
          [
            {
              text: "OK",
              onPress: () => router.push("/auth/login")
            }
          ]
        );
      } else {
        Alert.alert("Erreur", data.message || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      if (__DEV__) console.error("Erreur lors de l'inscription:", error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="light" />

      <Header subtitle="Créer un compte locataire" showBackButton={false} />

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Bienvenue !</Text>
          <Text style={styles.sectionSubtitle}>
            Créez votre compte pour commencer.
          </Text>
        </View>

        <View style={styles.inputsContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Entrez votre nom"
                placeholderTextColor="#888"
                value={nom}
                onChangeText={setNom}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Prénom</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Entrez votre prénom"
                placeholderTextColor="#888"
                value={prenom}
                onChangeText={setPrenom}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Entrez votre email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Téléphone</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Entrez votre numéro de téléphone"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                value={telephone}
                onChangeText={setTelephone}
              />
            </View>
            <Text style={styles.inputInfo}>Votre numéro de téléphone</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bâtiment</Text>
            <TouchableOpacity
              style={[styles.inputFieldContainer, { minHeight: 48, justifyContent: 'center' }]}
              onPress={() => setShowBuildingList(true)}
            >
              <Text style={{ color: selectedBuilding ? '#000' : '#888', fontSize: 16 }}>
                {selectedBuilding
                  ? buildings.find(b => b.id.toString() === selectedBuilding)?.nom
                  : 'Sélectionnez votre bâtiment'}
              </Text>
            </TouchableOpacity>
            {showBuildingList && (
              <View style={{ backgroundColor: '#fff', borderRadius: 8, marginTop: 8, elevation: 4, borderWidth: 1, borderColor: '#eee' }}>
                {buildings.map((building) => (
                  <TouchableOpacity
                    key={building.id}
                    style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                    onPress={() => {
                      setSelectedBuilding(building.id.toString());
                      setShowBuildingList(false);
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#000' }}>{building.nom}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setShowBuildingList(false)} style={{ padding: 12 }}>
                  <Text style={{ color: '#d32f2f', textAlign: 'center' }}>Annuler</Text>
                </TouchableOpacity>
              </View>
            )}
            <Text style={styles.inputInfo}>
              {buildings.length > 0 
                ? `${buildings.length} bâtiment(s) disponible(s)` 
                : "Aucun bâtiment trouvé"
              }
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputInfo}>Minimum 8 caractères</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirmer mot de passe</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Confirmez votre mot de passe"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainerHorizontal}>
          <TouchableOpacity
            style={[styles.buttonHorizontal, styles.secondaryButtonHorizontal]}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonHorizontalText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonHorizontal, styles.primaryButtonHorizontal]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonHorizontalText}>
              {isLoading ? "Inscription..." : "S'inscrire"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
