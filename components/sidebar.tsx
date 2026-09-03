import { Ionicons } from "@expo/vector-icons"; // Import des icônes
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { removeToken } from "../config/tokenStorage";
import { sidebarWidth, useSidebarStyle } from "../hooks/useSidebarStyle";

interface SidebarProps {
  isSidebarVisible: boolean;
  onClose: () => void;
}

export default function Sidebar({ isSidebarVisible, onClose }: SidebarProps) {
  const slideAnim = useRef(new Animated.Value(-sidebarWidth)).current; // Initialiser la position hors écran (-largeur)
  const [userRole, setUserRole] = useState<string | null>(null);
  const styles = useSidebarStyle();
  const router = useRouter();

  // Charger le rôle utilisateur au démarrage
  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        setUserRole(role);
        if (__DEV__) console.log('📱 [SIDEBAR] Rôle utilisateur chargé:', role);
      } catch (error) {
        console.error('❌ [SIDEBAR] Erreur chargement rôle:', error);
      }
    };
    loadUserRole();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isSidebarVisible ? 0 : -sidebarWidth, // Animer vers 0 si visible, sinon vers -largeur
      duration: 300, // Durée de l'animation en ms
      useNativeDriver: true, // Utiliser le driver natif pour de meilleures performances
    }).start();
  }, [isSidebarVisible, slideAnim]);

  const handleLogout = async () => {
    try {
      await removeToken();
      await AsyncStorage.multiRemove([
        "userId",
        "userRole",
        "userEmail",
        "userName",
        "userBuildingId",
        "userBuildingName",
        "userBuildingAddress",
        "signalement_draft",
      ]);
      router.replace("/accueil");
      onClose();
    } catch (e) {
      console.error("Erreur lors de la déconnexion:", e);
      Alert.alert("Erreur", "Erreur lors de la déconnexion.");
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
    // Navigation selon la structure des fichiers
    if (itemId === 1) {
      router.push("/batiments/mon-batiment");
    } else if (itemId === 2) {
      router.push("/batiments/mon-gardien");
    } else if (itemId === 3) {
      // Navigation différente selon le rôle pour les incidents
      if (userRole === 'guardian') {
        if (__DEV__) console.log('🛡️ [SIDEBAR] Gardien -> Gestion des incidents');
        router.push("/signalements/gerer-incidents");
      } else {
        if (__DEV__) console.log('👤 [SIDEBAR] Locataire -> Liste des incidents');
        router.push("/signalements/incidents");
      }
    } else if (itemId === 4) {
      // "Rapports" : liste des incidents (vue identique pour les deux rôles).
      router.push("/signalements/incidents");
    } else if (itemId === 5) {
      router.push("/profil/profil");
    } else if (itemId === 6) {
      router.push("/profil/parametres");
    } else if (itemId === 7) {
      handleLogout(); // Appeler la fonction de déconnexion
    }
    if (__DEV__) console.log("Menu item pressed:", itemId);
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
      <Text style={styles.appTitle}>CoHabitat</Text>

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
    </Animated.View>
  );
}
