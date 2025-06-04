import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  subtitle: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function Header({ subtitle, showBackButton = true, onBackPress }: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
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

const styles = StyleSheet.create({
  headerRect: {
    width: '100%',
    height: 120,
    backgroundColor: '#161616',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    left: 0,
    padding: 4,
    zIndex: 1,
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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