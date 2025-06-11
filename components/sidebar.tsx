import { Ionicons } from "@expo/vector-icons"; // Import des icônes
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { sidebarWidth, useSidebarStyle } from "../hooks/useSidebarStyle";

interface SidebarProps {
  isSidebarVisible: boolean;
  onClose: () => void;
}

export default function Sidebar({ isSidebarVisible, onClose }: SidebarProps) {
  const slideAnim = useRef(new Animated.Value(-sidebarWidth)).current; // Initialiser la position hors écran (-largeur)
  const styles = useSidebarStyle();
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isSidebarVisible ? 0 : -sidebarWidth, // Animer vers 0 si visible, sinon vers -largeur
      duration: 300, // Durée de l'animation en ms
      useNativeDriver: true, // Utiliser le driver natif pour de meilleures performances
    }).start();
  }, [isSidebarVisible, slideAnim]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Supprimer le token d'authentification
      // Vous pouvez également supprimer d'autres informations utilisateur si nécessaire
      router.replace('/accueil'); // Rediriger vers l'écran d'accueil/connexion
      onClose(); // Fermer la sidebar
    } catch (e) {
      console.error("Erreur lors de la déconnexion:", e);
      alert("Erreur lors de la déconnexion.");
    }
  };

  // Exemple d'éléments de menu pour la sidebar
  const menuItems = [
    {
      id: 1,
      text: "Mon Bâtiment",
      icon: "business-outline",
      activeIcon: "business",
    },
    {
      id: 2,
      text: "Mon Gardien",
      icon: "shield-outline",
      activeIcon: "shield",
    },
    {
      id: 3,
      text: "Incidents",
      icon: "warning-outline",
      activeIcon: "warning",
    },
    {
      id: 4,
      text: "Rapports",
      icon: "document-text-outline",
      activeIcon: "document-text",
    },
    { 
      id: 5, 
      text: "Profil", 
      icon: "person-outline", 
      activeIcon: "person" 
    },
    {
      id: 6,
      text: "Paramètres",
      icon: "settings-outline",
      activeIcon: "settings",
    },
    {
      id: 7,
      text: "Déconnexion",
      icon: "log-out-outline",
      activeIcon: "log-out",
    },
  ];

  const handleItemPress = (itemId: number) => {
    // Ici, vous ajouteriez la logique pour naviguer vers la page correspondante
    if (itemId === 1) {
      router.push("/mon-batiment");
    } else if (itemId === 2) {
      router.push("/mon-gardien");
    } else if (itemId === 3) {
      router.push("/incidents");
    } else if (itemId === 4) {
      router.push("/gerer-incidents");
    } else if (itemId === 5) {
      router.push("/profil");
    } else if (itemId === 6) {
      router.push("/parametres");
    } else if (itemId === 7) {
      handleLogout(); // Appeler la fonction de déconnexion
    }
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
