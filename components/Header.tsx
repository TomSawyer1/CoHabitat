import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderStyle } from "../hooks/useHeaderStyle";

interface HeaderProps {
  subtitle: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function Header({
  subtitle,
  showBackButton = true,
  onBackPress,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useHeaderStyle();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.headerRect, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        {showBackButton && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>CoHabitat</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}
