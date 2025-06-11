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
import { useGuardianRegisterStyle } from "../hooks/useGuardianRegisterStyle";

export default function GardianRegister() {
  const router = useRouter();
  const styles = useGuardianRegisterStyle();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [guardNumber, setGuardNumber] = useState("");

  // Données fictives des bâtiments
  const buildings = [
    { id: "1", name: "Bâtiment A" },
    { id: "2", name: "Bâtiment B" },
    { id: "3", name: "Bâtiment C" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header 
        subtitle="Créer un compte gardien"
        onBackPress={() => router.push("/gardian-login")}
        showBackButton={false}
      />
      <ScrollView contentContainerStyle={styles.inputsContainer}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Bienvenue !</Text>
          <Text style={styles.sectionSubtitle}>
            Créez votre compte gardien pour commencer.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nom</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre nom"
              placeholderTextColor="#00000080"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Prénom</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre prénom"
              placeholderTextColor="#00000080"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Rue</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez le nom de la rue"
              placeholderTextColor="#00000080"
              value={street}
              onChangeText={setStreet}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bâtiment</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={building}
              onValueChange={(itemValue) => setBuilding(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Sélectionnez le bâtiment" value="" />
              {buildings.map((b) => (
                <Picker.Item key={b.id} label={b.name} value={b.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Numéro Gardien</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez le numéro du gardien"
              placeholderTextColor="#00000080"
              keyboardType="numeric"
              value={guardNumber}
              onChangeText={setGuardNumber}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Numéro de téléphone</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre numéro de téléphone"
              placeholderTextColor="#00000080"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre email"
              placeholderTextColor="#00000080"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <Text style={styles.inputInfo}>Votre email professionnel</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Mot de passe</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
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
          <Text style={styles.inputInfo}>Minimum 8 caractères</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Confirmez votre mot de passe"
              placeholderTextColor="#00000080"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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

        <View style={styles.buttonsContainerHorizontal}>
          <TouchableOpacity
            style={[styles.buttonHorizontal, styles.secondaryButtonHorizontal]}
            onPress={() => router.push("/gardian-login")}
          >
            <Text style={styles.secondaryButtonHorizontalText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonHorizontal, styles.primaryButtonHorizontal]}
            onPress={() => router.push("/gardian-home")}
          >
            <Text style={styles.primaryButtonHorizontalText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
