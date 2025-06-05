import { Ionicons } from "@expo/vector-icons"; // Import des icônes
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SidebarProps {
  isSidebarVisible: boolean;
  onClose: () => void;
}

const sidebarWidth = 250; // Doit correspondre à la largeur définie dans les styles

export default function Sidebar({ isSidebarVisible, onClose }: SidebarProps) {
  const slideAnim = useRef(new Animated.Value(-sidebarWidth)).current; // Initialiser la position hors écran (-largeur)

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isSidebarVisible ? 0 : -sidebarWidth, // Animer vers 0 si visible, sinon vers -largeur
      duration: 300, // Durée de l'animation en ms
      useNativeDriver: true, // Utiliser le driver natif pour de meilleures performances
    }).start();
  }, [isSidebarVisible, slideAnim]);

  // Exemple d'éléments de menu pour la sidebar
  const menuItems = [
    {
      id: 1,
      text: "Paramètres",
      icon: "settings-outline",
      activeIcon: "settings",
    },
    {
      id: 2,
      text: "Mon Bâtiment",
      icon: "business-outline",
      activeIcon: "business",
    },
    { id: 3, text: "Profil", icon: "person-outline", activeIcon: "person" },
    {
      id: 4,
      text: "Déconnexion",
      icon: "log-out-outline",
      activeIcon: "log-out",
    },
  ];

  const handleItemPress = (itemId: number) => {
    // Ici, vous ajouteriez la logique pour naviguer vers la page correspondante
    console.log("Menu item pressed:", itemId);
    onClose(); // Fermer la sidebar après avoir cliqué sur un élément
  };

  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          transform: [{ translateX: slideAnim }], // Appliquer l'animation sur translateX
        },
      ]}
    >
      {/* Titre de l'application */}
      <Text style={styles.appTitle}>CoHabitat</Text>

      {/* Liste des éléments de menu */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleItemPress(item.id)}
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              color="#fff" // Couleur des icônes en blanc pour la sidebar noire
            />
            <Text style={styles.menuItemText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ajoutez ici d'autres éléments si nécessaire */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0, // Laisser à 0, l'animation translateX gère la position
    bottom: 0,
    width: sidebarWidth, // Utiliser la variable pour la largeur
    backgroundColor: "#000", // Couleur de fond noire
    paddingTop: 50, // Padding en haut pour le titre
    paddingHorizontal: 20,
    zIndex: 50, // Assurez-vous qu'elle est au-dessus des autres éléments
    // Ajoutez des ombres ou d'autres styles si nécessaire
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Pour Android
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30, // Espacement sous le titre
    color: "#fff", // Couleur du titre blanche
  },
  menuContainer: {
    // Styles pour le conteneur des éléments de menu
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    // borderBottomWidth: 1, // Ligne séparatrice optionnelle
    // borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 15, // Espacement entre l'icône et le texte
    color: "#fff", // Couleur du texte des éléments de menu blanche
  },
});
