import { Ionicons } from "@expo/vector-icons";
import { Router } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavbarStyle } from "../hooks/useNavbarStyle";

interface NavbarProps {
  isSidebarVisible: boolean;
  setIsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  router: Router;
}

export default function Navbar({
  isSidebarVisible,
  setIsSidebarVisible,
  router,
}: NavbarProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const styles = useNavbarStyle();

  // Icônes de placeholder - on garde l'idée de 4-5 icônes simples
  const menuItems = [
    { id: 1, icon: "menu-outline", activeIcon: "menu", color: "#65ddb7" },
    { id: 2, icon: "home-outline", activeIcon: "home", color: "#ff8c00" },
    { id: 3, icon: "create-outline", activeIcon: "create", color: "#f54888" },
    {
      id: 4,
      icon: "notifications-outline",
      activeIcon: "notifications",
      color: "#4343f5",
    },
    { id: 5, icon: "person-outline", activeIcon: "person", color: "#e0b115" },
  ];

  const handleMenuItemPress = (index: number, itemId: number) => {
    if (itemId === 1) {
      setIsSidebarVisible(!isSidebarVisible);
    } else if (itemId === 2) {
      router.push("/accueil/home");
      setActiveIndex(index);
      setIsSidebarVisible(false);
    } else if (itemId === 3) {
      router.push("/signalements/signalement");
      setActiveIndex(index);
      setIsSidebarVisible(false);
    } else if (itemId === 4) {
      router.push("/notifications/notifications");
      setActiveIndex(index);
      setIsSidebarVisible(false);
    } else if (itemId === 5) {
      router.push("/profil/profil");
      setActiveIndex(index);
      setIsSidebarVisible(false);
    } else {
      setActiveIndex(index);
      setIsSidebarVisible(false);
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
            {activeIndex === index && item.id !== 1 && (
              <View
                style={[styles.activeCircle, { backgroundColor: item.color }]}
              />
            )}
            <Ionicons
              name={
                activeIndex === index && item.id !== 1
                  ? (item.activeIcon as any)
                  : (item.icon as any)
              }
              size={26}
              color={activeIndex === index ? "#fff" : "#fff"}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
