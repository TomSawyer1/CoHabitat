import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  subtitle: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function Header({ subtitle, showBackButton = true, onBackPress }: HeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.headerRect}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>CoHabitat</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRect: {
    width: '100%',
    height: 120,
    backgroundColor: '#161616',
    justifyContent: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 50,
    padding: 4,
    zIndex: 1,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
}); 