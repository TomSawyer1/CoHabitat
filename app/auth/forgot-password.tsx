import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useForgotPasswordStyle } from "../../hooks/useForgotPasswordStyle";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const styles = useForgotPasswordStyle();

  const handleSubmit = () => {
    // Logique pour envoyer le lien de réinitialisation du mot de passe
    console.log("Demande de réinitialisation pour:", email);
    // Afficher un message à l'utilisateur (email envoyé ou erreur)
    // Rediriger, par exemple vers une page de confirmation ou la page de connexion
    // router.push('/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header rectangulaire noir */}
      <View style={styles.headerRect}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>CoHabitat</Text>
          <Text style={styles.headerSubtitle}>Mot de passe oublié</Text>
        </View>
      </View>

      {/* Contenu principal */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        {/* Titre et sous-titre de section */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>
            Réinitialiser votre mot de passe
          </Text>
          <Text style={styles.sectionSubtitle}>
            Entrez votre email pour recevoir un lien de réinitialisation.
          </Text>
        </View>

        {/* Inputs */}
        <View style={styles.inputsContainer}>
          {/* Input Email */}
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
        </View>

        {/* Bouton */}
        <View style={styles.buttonsContainerHorizontal}>
          <TouchableOpacity
            style={[styles.buttonHorizontal, styles.primaryButtonHorizontal]}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryButtonHorizontalText}>
              Envoyer le lien
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
