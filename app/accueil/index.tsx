import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAccueilStyle } from "../../hooks/useAccueilStyle";

const backgroundImage = require("../../assets/images/immeuble.jpg");

export default function Accueil() {
  const router = useRouter();
  const styles = useAccueilStyle();

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.appTitle}>CoHabitat</Text>
            <Text style={styles.subtitle}>
              Simplifiez la gestion de votre bâtiment
            </Text>
            <Text style={styles.description}>
              Une application moderne pour améliorer la communication entre 
              locataires et gardiens d'immeubles.
            </Text>
          </View>

          <View style={styles.buttonsSection}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push("/auth/login")}
            >
              <Text style={styles.primaryButtonText}>
                Je suis locataire
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push("/auth/gardian-login")}
            >
              <Text style={styles.secondaryButtonText}>
                Je suis gardien
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Première fois ? Créez votre compte rapidement
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
} 