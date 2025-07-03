import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Header from "../../components/Header";
import { useForgotPasswordStyle } from "../../hooks/useForgotPasswordStyle";

export default function ForgotPassword() {
  const router = useRouter();
  const styles = useForgotPasswordStyle();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    // Logique pour envoyer le lien de réinitialisation du mot de passe
    console.log("Demande de réinitialisation pour:", email);
    // Afficher un message à l'utilisateur (email envoyé ou erreur)
    // Rediriger, par exemple vers une page de confirmation ou la page de connexion
    // router.push('/login');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="light" />
      <Header subtitle="Mot de passe oublié" showBackButton={false} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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
    </KeyboardAvoidingView>
  );
}
