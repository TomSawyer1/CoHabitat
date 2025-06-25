import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Header from "../../components/Header";
import { useLoginStyle } from "../../hooks/useLoginStyle";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const styles = useLoginStyle();

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
          role: 'locataire', // Spécifier le rôle pour la connexion
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Connexion réussie !");
        // Stocker le token et les informations utilisateur
        await AsyncStorage.setItem('userToken', data.token);
        // Vous pouvez également stocker d'autres informations utilisateur si nécessaire, par exemple: 
        // await AsyncStorage.setItem('userId', data.user.id.toString());
        router.push("/accueil"); // Rediriger vers la page d'accueil
      } else {
        alert(data.message || "Identifiants incorrects.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      alert("Impossible de se connecter au serveur. Veuillez réessayer plus tard.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header subtitle="Connexion Locataire" showBackButton={false} />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        {/* Titre de section */}
        <Text style={styles.sectionTitle}>Connexion Locataire</Text>
        {/* Inputs */}
        <View style={styles.inputsContainer}>
          {/* Input Email */}
          <View>
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
            <Text style={styles.inputInfo}>Votre email professionnel</Text>
          </View>
          {/* Input Mot de passe */}
          <View>
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
        </View>
        {/* Boutons */}
        <View style={styles.buttonsContainer}>
          {/* Primaire */}
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleLogin}
          >
            <Text style={styles.primaryButtonText}>Se connecter</Text>
          </TouchableOpacity>
          {/* Secondaire 2 */}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButtonBlack]}
            onPress={() => router.push("/auth/register")}
          >
            <Text style={styles.secondaryButtonBlackText}>Créer un compte</Text>
          </TouchableOpacity>
          {/* Mot de passe oublié */}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push("/auth/forgot-password")}
          >
            <Text style={styles.secondaryButtonText}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
