import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import { useAccueilStyle } from "../hooks/useAccueilStyle";

export default function Accueil() {
  const router = useRouter();
  const styles = useAccueilStyle();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Ellipse décorative noire */}
      <View style={styles.ellipseContainer}>
        <View style={styles.ellipse} />
        {/* Titre blanc centré sur l'ellipse */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>CoHabitat</Text>
        </View>
      </View>

      {/* Contenu principal - Boutons */}
      <View style={styles.contentContainer}>
        {/* Bouton Locataire */}
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.primaryButtonText}>Locataire</Text>
        </TouchableOpacity>

        {/* Bouton Gardien */}
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/gardian-login")}
        >
          <Text style={styles.secondaryButtonText}>Gardien</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
