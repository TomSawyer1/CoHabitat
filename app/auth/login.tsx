import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from 'react';
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
import { API_BASE_URL } from "../../config";
import { useLoginStyle } from "../../hooks/useLoginStyle";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const styles = useLoginStyle();

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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          role: 'locataire',
        }),
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
        
        console.log('✅ [LOGIN] Données stockées:', {
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
      console.error("Erreur lors de la connexion:", error);
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
      <Header subtitle="Connexion Locataire" showBackButton={false} />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Connexion Locataire</Text>
        <View style={styles.inputsContainer}>
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
                    <View style={styles.buttonsContainer}>
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
            onPress={() => router.push("/auth/register")}
          >
            <Text style={styles.secondaryButtonBlackText}>Créer un compte</Text>
                        </TouchableOpacity>
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
    </KeyboardAvoidingView>
  );
}
