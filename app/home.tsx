import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ImageBackground,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useHomeStyle } from "../hooks/useHomeStyle";

const backgroundImage = require("../assets/images/SpeedOnana.jpg");

export default function Home() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const router = useRouter();
  const styles = useHomeStyle();

  const handlePressOutsideSidebar = () => {
    if (isSidebarVisible) {
      setIsSidebarVisible(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <TouchableWithoutFeedback
        onPress={handlePressOutsideSidebar}
        disabled={!isSidebarVisible}
      >
        <View style={styles.contentContainer}>
          <View style={styles.barContainer}>
            <View style={styles.bar} />
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>CoHabitat</Text>
          </View>

          <View style={styles.mainContent}>{/* Votre contenu ira ici */}</View>

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
    </ImageBackground>
  );
}
