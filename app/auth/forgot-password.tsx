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
    View
} from "react-native";
import Header from "../../components/Header";
import { useForgotPasswordStyle } from "../../hooks/useForgotPasswordStyle";

export default function ForgotPassword() {
  const router = useRouter();
  const styles = useForgotPasswordStyle();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    // Validation minimale : on n'a pas encore le backend pour l'envoi de mail
    // de réinitialisation. On affiche un message honnête plutôt qu'un faux
    // succès qui laisserait l'utilisateur attendre un email qui n'arrivera pas.
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez saisir votre email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Veuillez entrer un email valide.");
      return;
    }

    Alert.alert(
      "Fonctionnalité bientôt disponible",
      "La réinitialisation de mot de passe par email sera disponible prochainement. En attendant, contactez votre gardien ou le support.",
      [
        { text: "OK", onPress: () => router.back() }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <Header subtitle="Mot de passe oublié" showBackButton={false} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>
            Réinitialiser votre mot de passe
          </Text>
          <Text style={styles.sectionSubtitle}>
            Entrez votre email pour recevoir un lien de réinitialisation.
          </Text>
        </View>

        <View style={styles.inputsContainer}>
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
