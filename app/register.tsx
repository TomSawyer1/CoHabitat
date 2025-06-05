import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          <Text style={styles.headerSubtitle}>Créer un compte</Text>
        </View>
      </View>

      {/* Contenu principal */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        {/* Titre et sous-titre de section */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Bienvenue !</Text>
          <Text style={styles.sectionSubtitle}>
            Créez votre compte pour commencer.
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
              />
            </View>
          </View>

          {/* Input Nom */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Entrez votre nom"
                placeholderTextColor="#888"
              />
            </View>
          </View>

          {/* Input Prénom */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Prénom</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Entrez votre prénom"
                placeholderTextColor="#888"
              />
            </View>
          </View>

          {/* Input Mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
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

          {/* Input Confirmer mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirmer mot de passe</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Confirmez votre mot de passe"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirmPassword}
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

        {/* Boutons */}
        <View style={styles.buttonsContainerHorizontal}>
          {/* Secondaire */}
          <TouchableOpacity
            style={[styles.buttonHorizontal, styles.secondaryButtonHorizontal]}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonHorizontalText}>Annuler</Text>
          </TouchableOpacity>

          {/* Primaire */}
          <TouchableOpacity
            style={[styles.buttonHorizontal, styles.primaryButtonHorizontal]}
          >
            <Text style={styles.primaryButtonHorizontalText}>S&apos;inscrire</Text>
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
  headerRect: {
    width: "100%",
    height: 120,
    backgroundColor: "#161616",
    justifyContent: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 24,
    top: 50,
    padding: 4,
    zIndex: 1,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  headerSubtitle: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitleContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sectionSubtitle: {
    color: "#00000080",
    fontSize: 16,
  },
  inputsContainer: {
    marginBottom: 30,
    gap: 20,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
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
    marginTop: 2,
  },
  eyeIcon: {
    padding: 4,
  },
  buttonsContainerHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 16,
  },
  buttonHorizontal: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonHorizontal: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  secondaryButtonHorizontalText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  primaryButtonHorizontal: {
    backgroundColor: "#000",
  },
  primaryButtonHorizontalText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
