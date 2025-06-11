import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
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
import Header from "../components/Header";
import { useRegisterStyle } from "../hooks/useRegisterStyle";

export default function Register() {
  const router = useRouter();
  const styles = useRegisterStyle();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [telephone, setTelephone] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");

  // Données fictives des bâtiments
  const buildings = [
    { id: "1", name: "Résidence Les Alpes" },
    { id: "2", name: "Résidence Le Parc" },
    { id: "3", name: "Résidence Les Tilleuls" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Header subtitle="Créer un compte locataire" showBackButton={false} />

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Bienvenue !</Text>
          <Text style={styles.sectionSubtitle}>
            Créez votre compte pour commencer.
          </Text>
        </View>

        <View style={styles.inputsContainer}>
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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Téléphone</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Entrez votre numéro de téléphone"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                value={telephone}
                onChangeText={setTelephone}
              />
            </View>
            <Text style={styles.inputInfo}>Votre numéro de téléphone</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bâtiment</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedBuilding}
                onValueChange={(itemValue) => setSelectedBuilding(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionnez votre bâtiment" value="" />
                {buildings.map((building) => (
                  <Picker.Item
                    key={building.id}
                    label={building.name}
                    value={building.id}
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.inputInfo}>Votre lieu de résidence</Text>
          </View>

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

        <View style={styles.buttonsContainerHorizontal}>
          <TouchableOpacity
            style={[styles.buttonHorizontal, styles.secondaryButtonHorizontal]}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonHorizontalText}>Annuler</Text>
          </TouchableOpacity>

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
