import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Header from "../../components/Header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { useParametresStyle } from "../../hooks/useParametresStyle";

export default function Parametres() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [language, setLanguage] = useState("Français");

  const styles = useParametresStyle();

  // Fonction pour changer la langue (exemple simple)
  const handleChangeLanguage = () => {
    // Logique réelle pour changer la langue de l'application
    setLanguage((prev) => (prev === "Français" ? "Anglais" : "Français"));
    console.log("Changement de langue vers :", language);
  };

  

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <TouchableWithoutFeedback
        onPress={() => setIsSidebarVisible(false)}
        disabled={!isSidebarVisible}
      >
        <View style={styles.contentContainer}>
          <Header subtitle="Paramètres" showBackButton={false} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Paramètres</Text>
              <Text style={styles.sectionSubtitle}>
                Personnalisez votre expérience
              </Text>
            </View>

            {/* Section Langue */}
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleChangeLanguage}
              >
                <Text style={styles.settingLabel}>Langue</Text>
                <Text style={styles.settingValue}>{language}</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            </View>



            {/* Autres paramètres à ajouter ici */}
          </ScrollView>

          <Navbar
            isSidebarVisible={isSidebarVisible}
            setIsSidebarVisible={setIsSidebarVisible}
            router={router}
          />
        </View>
      </TouchableWithoutFeedback>

      <Sidebar
        isSidebarVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </View>
  );
} 