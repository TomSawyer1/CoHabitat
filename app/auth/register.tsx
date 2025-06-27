import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Header from "../../components/Header";
import { API_BASE_URL } from "../../config";
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

  // Charger les bâtiments au démarrage
  useEffect(() => {
    const fetchBuildings = async () => {
      console.log('🏢 Chargement des bâtiments...');
      setBuildingsLoading(true);
      try {
        console.log('🌐 URL API:', API_BASE_URL);
        const response = await fetch(`${API_BASE_URL}/api/buildings`);
        console.log('📡 Réponse buildings:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🏢 Bâtiments reçus:', data);
          setBuildings(data);
        } else {
          console.error("Erreur lors de la récupération des bâtiments:", response.status);
          Alert.alert("Erreur", "Impossible de charger la liste des bâtiments. Vérifiez que le serveur est démarré.");
        }
      } catch (error) {
        console.error("Erreur réseau lors de la récupération des bâtiments:", error);
        Alert.alert("Erreur", "Impossible de se connecter au serveur pour charger les bâtiments.");
      } finally {
        setBuildingsLoading(false);
      }
    };
    fetchBuildings();
  }, []);

  const handleRegister = async () => {
    console.log('🚀 Tentative d\'inscription...');
    console.log('📝 Données:', { nom, prenom, email, telephone, selectedBuilding });
    
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
      console.log('🌐 Envoi vers:', `${API_BASE_URL}/auth/register/locataire`);
      const response = await fetch(`${API_BASE_URL}/auth/register/locataire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          nom: nom.trim(),
          prenom: prenom.trim(),
          telephone: telephone.trim(),
          batiment: selectedBuilding,
          password,
        }),
      });

      console.log('📡 Réponse inscription:', response.status);
      const data = await response.json();
      console.log('📄 Data reçue:', data);

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
      console.error("Erreur lors de l'inscription:", error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const testButtonPress = () => {
    console.log('🔥 BOUTON PRESSÉ !');
    Alert.alert("Test", "Le bouton fonctionne !");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Header subtitle="Créer un compte locataire" showBackButton={false} />

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
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
            <View style={styles.pickerContainer}>
              {buildingsLoading ? (
                <Text style={styles.loadingText}>Chargement des bâtiments...</Text>
              ) : (
                <Picker
                  selectedValue={selectedBuilding}
                  onValueChange={(itemValue) => {
                    console.log('🏢 Bâtiment sélectionné:', itemValue);
                    setSelectedBuilding(itemValue);
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Sélectionnez votre bâtiment" value="" />
                  {buildings.map((building) => (
                    <Picker.Item
                      key={building.id}
                      label={building.nom}
                      value={building.id ? building.id.toString() : ""}
                    />
                  ))}
                </Picker>
              )}
            </View>
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

          {/* Bouton de test pour debug */}
          <TouchableOpacity
            style={[styles.buttonHorizontal, { backgroundColor: '#ff6b6b', flex: 0.3 }]}
            onPress={testButtonPress}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Test</Text>
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
    </View>
  );
}
