import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';

const backgroundImage = require('../assets/images/SpeedOnana.jpg');

const { width } = Dimensions.get('window');
const sidebarWidth = 250; // Doit correspondre à la largeur de la sidebar

export default function Home() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const router = useRouter();

  const handlePressOutsideSidebar = () => {
    if (isSidebarVisible) {
      setIsSidebarVisible(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <TouchableWithoutFeedback onPress={handlePressOutsideSidebar} disabled={!isSidebarVisible}>
        <View style={styles.contentContainer}>
          <View style={styles.barContainer}>
            <View style={styles.bar} />
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>CoHabitat</Text>
          </View>

          <View style={styles.mainContent}>
            {/* Votre contenu ira ici */}
          </View>

          <Navbar isSidebarVisible={isSidebarVisible} setIsSidebarVisible={setIsSidebarVisible} router={router} />
        </View>
      </TouchableWithoutFeedback>

      <Sidebar isSidebarVisible={isSidebarVisible} onClose={() => setIsSidebarVisible(false)} />

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // ou 'contain', 'stretch'
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  mainContent: {
    flex: 1,
    paddingTop: 100,
    paddingBottom: 0,
    paddingHorizontal: 20,
  },
  barContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    height: 100,
    backgroundColor: '#000',
  },
  headerTitleContainer: {
    position: 'absolute',
    top: 35,
    left: 0,
    width: '100%',
    zIndex: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
