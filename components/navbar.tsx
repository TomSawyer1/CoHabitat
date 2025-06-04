import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface NavbarProps {
  isSidebarVisible: boolean;
  setIsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>; // Type de la fonction de mise à jour d'état
}

export default function Navbar({ isSidebarVisible, setIsSidebarVisible }: NavbarProps) {
  const [activeIndex, setActiveIndex] = useState(0);

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
      setIsSidebarVisible(!isSidebarVisible); // Basculer la visibilité de la sidebar via les props
    } else {
      setActiveIndex(index); // Pour les autres icônes, définir l'élément actif
      // La sidebar devrait déjà être fermée par le clic extérieur dans home.tsx, mais on peut la fermer ici aussi pour être sûr
      setIsSidebarVisible(false);
      // Ajoutez ici la logique de navigation pour les autres pages
    }
  };

  return (
    // Suppression du fragment <> et du rendu conditionnel de Sidebar ici
    // La sidebar est maintenant gérée dans le composant parent (home.tsx)
    <View style={styles.navbarContainer}>
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
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70, // Hauteur ajustée pour l'effet de cercle
    backgroundColor: '#000', // Fond noir
    // Supprimer borderTopWidth si vous ne voulez pas la ligne du haut
    // borderTopWidth: 1,
    // borderColor: '#e7e7e7',
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%', // L'élément prend toute la hauteur pour centrer l'icône/cercle
    position: 'relative', // Important pour positionner le cercle
  },
  activeCircle: {
    position: 'absolute',
    width: 50, // Taille du cercle
    height: 50, // Taille du cercle
    borderRadius: 25, // Pour faire un cercle parfait
    // La couleur de fond est définie dynamiquement dans le composant
  },
});
 