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

  const styles = useParametresStyle();


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

            {/* Le changement de langue n'est pas encore implémenté : on
                l'affiche désactivé plutôt que de simuler un réglage factice. */}
            <View style={styles.card}>
              <View style={[styles.settingItem, { opacity: 0.5 }]}>
                <Text style={styles.settingLabel}>Langue</Text>
                <Text style={styles.settingValue}>Français (bientôt disponible)</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
            </View>



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