import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Header from "../../components/Header";
import { apiFetch } from "../../config/api";
import { useGardianLoginStyle } from "../../hooks/useGardianLoginStyle";

export default function GardianLogin() {
  const router = useRouter();
  const styles = useGardianLoginStyle();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Vérification des champs requis
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez entrer votre email et votre mot de passe.");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Veuillez entrer un email valide.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        auth: false,
        body: {
          email: email.toLowerCase().trim(),
          password,
          role: 'guardian',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token et les informations utilisateur
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userId', data.user.id.toString());
        await AsyncStorage.setItem('userRole', data.user.role);
        await AsyncStorage.setItem('userEmail', data.user.email);
        await AsyncStorage.setItem('userName', `${data.user.prenom} ${data.user.nom}`);
        
        // Stocker les informations du bâtiment si disponibles
        if (data.user.building_id) {
          await AsyncStorage.setItem('userBuildingId', data.user.building_id.toString());
          await AsyncStorage.setItem('userBuildingName', data.user.building_name || '');
          await AsyncStorage.setItem('userBuildingAddress', data.user.building_address || '');
        }
        
        console.log('✅ [GARDIEN LOGIN] Données stockées:', {
          userId: data.user.id,
          userRole: data.user.role,
          buildingId: data.user.building_id,
          buildingName: data.user.building_name
        });
        
        Alert.alert(
          "Succès", 
          "Connexion réussie !",
          [
            {
              text: "OK",
              onPress: () => router.replace("/accueil/home")
            }
          ]
        );
      } else {
        Alert.alert("Erreur", data.message || "Identifiants incorrects.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion du gardien:", error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="light" />
      <Header subtitle="Connexion Gardien" showBackButton={false} />
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Connexion Gardien</Text>
        <View style={styles.inputsContainer}>
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
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push("/auth/gardian-register")}
          >
            <Text style={styles.secondaryButtonText}>Créer un compte</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButtonBlack]}
            onPress={() => router.push("/auth/forgot-password")}
          >
            <Text style={styles.secondaryButtonBlackText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
