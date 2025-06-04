import { Ionicons } from '@expo/vector-icons';
import { Router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NavbarProps {
  isSidebarVisible: boolean;
  setIsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>; // Type de la fonction de mise à jour d'état
  router: Router; // Ajouter la prop router
}

export default function Navbar({ isSidebarVisible, setIsSidebarVisible, router }: NavbarProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();

  // Icônes de placeholder - on garde l'idée de 4-5 icônes simples
  const menuItems = [
    { id: 1, icon: 'menu-outline', activeIcon: 'menu', color: '#65ddb7' }, // Icône de menu burger
    { id: 2, icon: 'home-outline', activeIcon: 'home', color: '#ff8c00' },
    { id: 3, icon: 'create-outline', activeIcon: 'create', color: '#f54888'  }, // Icône de publication
    { id: 4, icon: 'notifications-outline', activeIcon: 'notifications', color: '#4343f5' },
    { id: 5, icon: 'person-outline', activeIcon: 'person', color: '#e0b115'}, // Exemple d'une 5ème icône
  ];

  const handleMenuItemPress = (index: number, itemId: number) => {
    if (itemId === 1) { // Si c'est l'icône du menu burger (ID 1)
      setIsSidebarVisible(!isSidebarVisible);
    } else if (itemId === 2) { // Si c'est l'icône de la maison (ID 2)
      router.push('/home'); // Naviguer vers la page home.tsx
      setActiveIndex(index); // Définir l'élément actif
      setIsSidebarVisible(false); // Cacher la sidebar si elle est ouverte
    } else if (itemId === 3) { // Si c'est l'icône de publication (ID 3)
      router.push('/signalement'); // Naviguer vers la page signalement.tsx
      setActiveIndex(index);
      setIsSidebarVisible(false);
    } else if (itemId === 4) { // Si c'est l'icône de notification (ID 4)
      router.push('/notifications'); // Naviguer vers la page notifications.tsx
      setActiveIndex(index);
      setIsSidebarVisible(false);
    } else if (itemId === 5) { // Si c'est l'icône du profil (ID 5)
      router.push('/profil'); // Naviguer vers la page profil.tsx
      setActiveIndex(index);
      setIsSidebarVisible(false);
    } else {
      setActiveIndex(index); // Pour les autres icônes, définir l'élément actif
      // La sidebar devrait déjà être fermée par le clic extérieur dans home.tsx, mais on peut la fermer ici aussi pour être sûr
      setIsSidebarVisible(false);
      // Ajoutez ici la logique de navigation pour les autres pages
    }
  };

  return (
    <View style={[styles.navbarContainer, { paddingBottom: insets.bottom }]}>
      <View style={styles.menuItemsContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(index, item.id)}
            activeOpacity={0.8}
          >
            {/* Cercle de fond pour l'élément actif (uniquement pour les éléments non-burger) */}
            {activeIndex === index && item.id !== 1 && (
              <View style={[styles.activeCircle, { backgroundColor: item.color }]} />
            )}
            <Ionicons 
              name={activeIndex === index && item.id !== 1 ? item.activeIcon as any : item.icon as any}
              size={26}
              color={activeIndex === index ? '#fff' : '#fff'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: '#000',
  },
  menuItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  activeCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
 