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
import { useGuardianRegisterStyle } from "../../hooks/useGuardianRegisterStyle";

export default function GardianRegister() {
  const router = useRouter();
  const styles = useGuardianRegisterStyle();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [building, setBuilding] = useState("");
  const [guardNumber, setGuardNumber] = useState("");
  const [buildings, setBuildings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buildingsLoading, setBuildingsLoading] = useState(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      console.log('🏢 [GARDIEN] Chargement des bâtiments...');
      setBuildingsLoading(true);
      try {
        console.log('🌐 [GARDIEN] URL API:', API_BASE_URL);
        const response = await fetch(`${API_BASE_URL}/api/buildings`);
        console.log('📡 [GARDIEN] Réponse buildings:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🏢 [GARDIEN] Bâtiments reçus:', data);
          
          // Extraire le tableau de bâtiments de la réponse
          if (data.success && Array.isArray(data.buildings)) {
            setBuildings(data.buildings);
          } else {
            console.error('Format de réponse inattendu:', data);
            setBuildings([]);
            Alert.alert("Erreur", "Format de données des bâtiments invalide.");
          }
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
    console.log('🚀 [GARDIEN] Tentative d\'inscription...');
    console.log('📝 [GARDIEN] Données:', { firstName, lastName, email, phoneNumber, building, guardNumber });
    
    // Validation des mots de passe
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    // Vérification des champs requis
    if (!email || !lastName || !firstName || !phoneNumber || !building || !guardNumber || !password) {
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
      console.log('🌐 [GARDIEN] Envoi vers:', `${API_BASE_URL}/auth/register/guardian`);
      const response = await fetch(`${API_BASE_URL}/auth/register/guardian`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          nom: lastName.trim(),
          prenom: firstName.trim(),
          telephone: phoneNumber.trim(),
          batiment: building,
          numeroGardien: guardNumber.trim(),
          password,
        }),
      });

      console.log('📡 [GARDIEN] Réponse inscription:', response.status);
      const data = await response.json();
      console.log('📄 [GARDIEN] Data reçue:', data);

      if (response.ok) {
        Alert.alert(
          "Succès", 
          "Inscription du gardien réussie ! Vous pouvez maintenant vous connecter.",
          [
            {
              text: "OK",
              onPress: () => router.push("/auth/gardian-login")
            }
          ]
        );
      } else {
        Alert.alert("Erreur", data.message || "Erreur lors de l'inscription du gardien.");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription du gardien:", error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const testButtonPress = () => {
    console.log('🔥 [GARDIEN] BOUTON PRESSÉ !');
    Alert.alert("Test Gardien", "Le bouton gardien fonctionne !");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header 
        subtitle="Créer un compte gardien"
        onBackPress={() => router.push("/auth/gardian-login")}
        showBackButton={false}
      />
      <ScrollView contentContainerStyle={styles.inputsContainer}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Bienvenue !</Text>
          <Text style={styles.sectionSubtitle}>
            Créez votre compte gardien pour commencer.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nom</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre nom"
              placeholderTextColor="#00000080"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Prénom</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre prénom"
              placeholderTextColor="#00000080"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bâtiment</Text>
          <View style={styles.pickerContainer}>
            {buildingsLoading ? (
              <Text style={styles.loadingText}>Chargement des bâtiments...</Text>
            ) : (
              <Picker
                selectedValue={building}
                onValueChange={(itemValue) => {
                  console.log('🏢 [GARDIEN] Bâtiment sélectionné:', itemValue);
                  setBuilding(itemValue);
                }}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionnez le bâtiment" value="" />
                {buildings && buildings.length > 0 ? buildings.map((b) => (
                  <Picker.Item key={b.id} label={b.nom} value={b.id ? b.id.toString() : ""} />
                )) : (
                  <Picker.Item label="Aucun bâtiment disponible" value="" enabled={false} />
                )}
              </Picker>
            )}
          </View>
          <Text style={styles.inputInfo}>
            {buildings && buildings.length > 0 
              ? `${buildings.length} bâtiment(s) disponible(s)` 
              : "Aucun bâtiment trouvé"
            }
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Numéro Gardien</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez le numéro du gardien"
              placeholderTextColor="#00000080"
              keyboardType="numeric"
              value={guardNumber}
              onChangeText={setGuardNumber}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Numéro de téléphone</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre numéro de téléphone"
              placeholderTextColor="#00000080"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre email"
              placeholderTextColor="#00000080"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <Text style={styles.inputInfo}>Votre email professionnel</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Mot de passe</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre mot de passe"
              placeholderTextColor="#00000080"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#00000080"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.inputInfo}>Minimum 8 caractères</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Confirmez votre mot de passe"
              placeholderTextColor="#00000080"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color="#00000080"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonsContainerHorizontal}>
          <TouchableOpacity
            style={[styles.buttonHorizontal, styles.secondaryButtonHorizontal]}
            onPress={() => router.push("/auth/gardian-login")}
          >
            <Text style={styles.secondaryButtonHorizontalText}>Annuler</Text>
          </TouchableOpacity>
          
          {/* Bouton de test pour debug */}
          <TouchableOpacity
            style={[styles.buttonHorizontal, { backgroundColor: '#4ECDC4', flex: 0.3 }]}
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
              {isLoading ? "Création..." : "Créer un compte"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
