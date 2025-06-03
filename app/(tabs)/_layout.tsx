import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Masquer l'en-tête pour les écrans des onglets
        tabBarStyle: {
          backgroundColor: '#1E1E2D', // Couleur de fond sombre
          borderTopWidth: 0, // Supprimer la bordure supérieure
          height: 60, // Ajuster la hauteur si nécessaire
        },
        tabBarActiveTintColor: '#6A5ACD', // Couleur de l'icône active (exemple)
        tabBarInactiveTintColor: '#FFFFFF', // Couleur blanche pour les icônes inactives
        tabBarShowLabel: false, // Masquer les labels de texte sous les icônes
      }}
    >
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => <Ionicons name="menu" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => <Ionicons name="archive-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="signalement"
        options={{
          title: 'Signalement',
          tabBarIcon: ({ color }) => <Ionicons name="layers" size={32} color="#6A5ACD" />, // Icône centrale plus grande et couleur différente
        }}
      />
      <Tabs.Screen
        name="layout" // Nom placeholder
        options={{
          title: 'Layout',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="gallery" // Nom placeholder
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color }) => <Ionicons name="image-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
