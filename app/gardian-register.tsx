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
import { useGuardianRegisterStyle } from "../hooks/useGuardianRegisterStyle";

export default function GardianRegister() {
  const router = useRouter();
  const styles = useGuardianRegisterStyle();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.headerRect}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/gardian-login")}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Guardian</Text>
          <Text style={styles.headerSubtitle}>Créer un compte</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.inputsContainer}>
        <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre email"
              placeholderTextColor="#00000080"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <Text style={styles.inputInfo}>Votre email professionnel</Text>
        </View>

        <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>Nom</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre nom"
              placeholderTextColor="#00000080"
            />
          </View>
        </View>

        <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>Prénom</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre prénom"
              placeholderTextColor="#00000080"
            />
          </View>
        </View>

        <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>Numéro de téléphone</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre numéro de téléphone"
              placeholderTextColor="#00000080"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>Mot de passe</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre mot de passe"
              placeholderTextColor="#00000080"
              secureTextEntry={!showPassword}
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

        <View style={styles.inputFieldContainer}>
          <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Confirmez votre mot de passe"
              placeholderTextColor="#00000080"
              secureTextEntry={!showConfirmPassword}
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

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push("/gardian-login")}
          >
            <Text style={styles.secondaryButtonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push("/gardian-home")}
          >
            <Text style={styles.primaryButtonText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
