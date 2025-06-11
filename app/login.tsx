import { Ionicons } from "@expo/vector-icons";
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
import Header from "../components/Header";
import { useLoginStyle } from "../hooks/useLoginStyle";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const styles = useLoginStyle();

  const handleLogin = () => {
    // Vérifie si l'email et le mot de passe correspondent aux valeurs spécifiques
    if (email === "test@test.com" && password === "test") {
      // Redirige vers la page de signalement
      router.push("/home");
    } else {
      // Ici, vous pourriez ajouter une logique pour afficher un message d'erreur à l'utilisateur
      console.log("Identifiants incorrects");
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
            onPress={() => router.push("/register")}
          >
            <Text style={styles.secondaryButtonBlackText}>Créer un compte</Text>
          </TouchableOpacity>
          {/* Mot de passe oublié */}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push("/forgot-password")}
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
