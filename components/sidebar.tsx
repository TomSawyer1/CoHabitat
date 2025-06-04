import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text } from 'react-native';

interface SidebarProps {
  isSidebarVisible: boolean;
}

const { width } = Dimensions.get('window'); // Obtenir la largeur de l'écran
const sidebarWidth = 250; // Doit correspondre à la largeur définie dans les styles

export default function Sidebar({ isSidebarVisible }: SidebarProps) {
  const slideAnim = useRef(new Animated.Value(-sidebarWidth)).current; // Initialiser la position hors écran (-largeur)

  useEffect(() => {
    Animated.timing(
      slideAnim,
      {
        toValue: isSidebarVisible ? 0 : -sidebarWidth, // Animer vers 0 si visible, sinon vers -largeur
        duration: 300, // Durée de l'animation en ms
        useNativeDriver: true, // Utiliser le driver natif pour de meilleures performances
      }
    ).start();
  }, [isSidebarVisible, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          transform: [{ translateX: slideAnim }], // Appliquer l'animation sur translateX
        },
      ]}
    >
      <Text style={styles.sidebarText}>Contenu de la Sidebar</Text>
      {/* Ajoutez ici les éléments de votre sidebar (liens, options, etc.) */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0, // Laisser à 0, l'animation translateX gère la position
    bottom: 0,
    width: sidebarWidth, // Utiliser la variable pour la largeur
    backgroundColor: '#fff', // Couleur de fond
    padding: 20,
    zIndex: 50, // Assurez-vous qu'elle est au-dessus des autres éléments
    // Ajoutez des ombres ou d'autres styles si nécessaire
  },
  sidebarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 