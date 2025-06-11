import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/Header";
import { useGardianLoginStyle } from "../hooks/useGardianLoginStyle";

export default function GardianLogin() {
  const router = useRouter();
  const styles = useGardianLoginStyle();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Vérification des champs requis
    if (!email || !password) {
      alert("Veuillez entrer votre email et votre mot de passe.");
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: 'guardian', // Spécifier le rôle pour la connexion du gardien
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Connexion réussie !");
        await AsyncStorage.setItem('userToken', data.token);
        // Vous pouvez également stocker d'autres informations utilisateur si nécessaire
        router.push("/home"); // Rediriger vers la page d'accueil
      } else {
        alert(data.message || "Identifiants incorrects.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion du gardien:", error);
      alert("Impossible de se connecter au serveur. Veuillez réessayer plus tard.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header subtitle="Connexion Gardien" showBackButton={false} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {/* Titre de section */}
        <Text style={styles.sectionTitle}>Connexion Gardien</Text>
        {/* Inputs */}
        <View style={styles.inputsContainer}>
          {/* Input Email */}
          <View>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Entrez votre email"
                placeholderTextColor="#00000080"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
          {/* Input Mot de passe */}
          <View>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
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
          </View>
        </View>
        {/* Boutons */}
        <View style={styles.buttonsContainer}>
          {/* Primaire */}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push("/gardian-register")}
          >
            <Text style={styles.secondaryButtonText}>Créer un compte</Text>
          </TouchableOpacity>
          {/* Secondaire 2 - Peut-être à adapter pour gardiens */}
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleLogin}
          >
            <Text style={styles.primaryButtonText}>Se connecter</Text>
          </TouchableOpacity>
          {/* Mot de passe oublié */}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButtonBlack]}
            onPress={() => router.push("/forgot-password")}
          >
            <Text style={styles.secondaryButtonBlackText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    zIndex: 30,
  },
  scrollViewContent: {
    paddingTop: 120,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
  },
  inputsContainer: {
    marginBottom: 48,
    gap: 24,
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
  inputInfo: {
    fontSize: 13,
    color: "#00000080",
    marginTop: 6,
  },
  buttonsContainer: {
    marginTop: 56,
    marginBottom: 16,
    gap: 16,
  },
  button: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
  secondaryButtonBlack: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#000",
  },
  secondaryButtonBlackText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
});
