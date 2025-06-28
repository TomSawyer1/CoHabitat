import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Header from "../../components/Header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { API_BASE_URL } from "../../config";
import { useMonGardienStyle } from "../../hooks/useMonGardienStyle";

interface GuardianData {
  name: string;
  role: string;
  phone: string;
  email: string;
  officeHours: string;
}

export default function MonGardien() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const styles = useMonGardienStyle();

  const [guardianData, setGuardianData] = useState<GuardianData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGuardianData();
  }, []);

  const loadGuardianData = async () => {
    try {
      console.log('👮 [MON-GARDIEN] Chargement des données du gardien...');
      setLoading(true);
      setError(null);

      // Récupérer les données utilisateur depuis AsyncStorage
      const [token, userId] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userId')
      ]);

      console.log('📱 [MON-GARDIEN] Données utilisateur:', { 
        hasToken: !!token, 
        userId 
      });

      if (!token || !userId) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter.', [
          { text: 'OK', onPress: () => router.replace('/auth/login') }
        ]);
        return;
      }

      // Appel API pour récupérer les informations du bâtiment (qui contient les infos du gardien)
      console.log('🌐 [MON-GARDIEN] Récupération depuis API...');
      const response = await fetch(`${API_BASE_URL}/api/buildings/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 [MON-GARDIEN] Réponse API:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('👮 [MON-GARDIEN] Données reçues:', data);

        if (data.success && data.building && data.building.guardian) {
          const guardian = data.building.guardian;
          
          setGuardianData({
            name: guardian.name || 'Gardien non assigné',
            role: 'Gardien de l\'immeuble',
            phone: guardian.phone || 'Non disponible',
            email: guardian.email || 'Non disponible',
            officeHours: 'Lun-Ven: 9h-12h et 14h-17h'
          });
        } else {
          setError('Aucun gardien assigné à votre bâtiment.');
        }
      } else {
        const errorData = await response.json();
        console.error('❌ [MON-GARDIEN] Erreur API:', errorData);
        setError(errorData.message || 'Erreur lors de la récupération des données.');
      }
    } catch (error) {
      console.error('❌ [MON-GARDIEN] Erreur:', error);
      setError('Impossible de charger les informations du gardien. Vérifiez votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactGardian = () => {
    if (!guardianData?.phone || guardianData.phone === 'Non disponible') {
      Alert.alert('Information manquante', 'Numéro de téléphone du gardien non disponible.');
      return;
    }

    const phoneNumber = guardianData.phone.replace(/\s/g, ''); // Enlever les espaces
    
    Alert.alert(
      'Contacter le gardien',
      `Souhaitez-vous appeler ${guardianData.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Appeler', 
          onPress: () => Linking.openURL(`tel:${phoneNumber}`) 
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 16 }}>Chargement des informations du gardien...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }]}>
        <Text style={{ color: '#d32f2f', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity onPress={loadGuardianData}>
          <View style={{ backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Réessayer</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  if (!guardianData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 16 }}>Aucune information de gardien disponible.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <TouchableWithoutFeedback
        onPress={() => setIsSidebarVisible(false)}
        disabled={!isSidebarVisible}
      >
        <View style={styles.contentContainer}>
          <Header subtitle="Mon Gardien" showBackButton={false} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Mon Gardien</Text>
              <Text style={styles.sectionSubtitle}>
                Informations de contact et responsabilités
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.avatarSection}>
                <View style={styles.avatarPlaceholder} />
                <Text style={styles.name}>{guardianData.name}</Text>
                <Text style={styles.role}>{guardianData.role}</Text>
              </View>

              {/* Informations de contact */}
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Informations de contact</Text>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="call-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Téléphone</Text>
                    <Text style={styles.infoValue}>{guardianData.phone}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="mail-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{guardianData.email}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="time-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Heures de bureau</Text>
                    <Text style={styles.infoValue}>{guardianData.officeHours}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleContactGardian}
              >
                <Text style={styles.contactButtonText}>Contacter le Gardien</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <Navbar
            isSidebarVisible={isSidebarVisible}
            setIsSidebarVisible={setIsSidebarVisible}
            router={router}
          />
        </View>
      </TouchableWithoutFeedback>

      <Sidebar
        isSidebarVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </View>
  );
} 