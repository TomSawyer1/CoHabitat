import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Header from "../../components/Header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { apiFetch } from "../../config/api";
import { getToken } from "../../config/tokenStorage";
import { useMonBatimentStyle } from "../../hooks/useMonBatimentStyle";

interface BuildingData {
  id: number;
  name: string;
  address: string;
  floors: number;
  totalApartments: number;
  yearBuilt: string | number;
  lastRenovation: string | number;
  facilities?: string[];
  rules?: string;
}

interface GuardianData {
  name: string;
  phone: string;
  email: string;
}

export default function MonBatiment() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const styles = useMonBatimentStyle();

  const [buildingData, setBuildingData] = useState<BuildingData | null>(null);
  const [guardianData, setGuardianData] = useState<GuardianData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBuildingData();
  }, []);

  const loadBuildingData = async () => {
    try {
      if (__DEV__) console.log('🏢 [MON-BATIMENT] Chargement des données du bâtiment...');
      setLoading(true);
      setError(null);

      // Récupérer les données utilisateur depuis AsyncStorage
      const [token, userId] = await Promise.all([
        getToken(),
        AsyncStorage.getItem('userId')
      ]);

      if (__DEV__) console.log('📱 [MON-BATIMENT] Données utilisateur:', { hasToken: !!token, hasUserId: !!userId });

      if (!token || !userId) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter.', [
          { text: 'OK', onPress: () => router.replace('/auth/login') }
        ]);
        return;
      }

      // Appel API pour récupérer les informations du bâtiment
      if (__DEV__) console.log('🌐 [MON-BATIMENT] Récupération depuis API...');
      const response = await apiFetch(`/api/buildings/${userId}`);

      if (__DEV__) console.log('📡 [MON-BATIMENT] Réponse API:', response.status);

      if (response.ok) {
        const data = await response.json();
        if (__DEV__) console.log('🏢 [MON-BATIMENT] Données reçues (success):', { success: data?.success });

        if (data.success && data.building) {
          const building = data.building;
          
          setBuildingData({
            id: building.id,
            name: building.name || 'Non spécifié',
            address: building.address || 'Non spécifiée',
            floors: building.floors || 0,
            totalApartments: building.totalApartments || 0,
            yearBuilt: building.yearBuilt || 'Non spécifiée',
            lastRenovation: building.lastRenovation || 'Non spécifiée',
            facilities: building.facilities || [],
            rules: building.rules || 'Règlement non disponible'
          });

          if (building.guardian) {
            setGuardianData({
              name: building.guardian.name || 'Non assigné',
              phone: building.guardian.phone || 'Non disponible',
              email: building.guardian.email || 'Non disponible'
            });
          }
        } else {
          setError('Aucune information de bâtiment disponible.');
        }
      } else {
        const errorData = await response.json();
        console.error('❌ [MON-BATIMENT] Erreur API:', errorData);
        setError(errorData.message || 'Erreur lors de la récupération des données.');
      }
    } catch (error) {
      console.error('❌ [MON-BATIMENT] Erreur:', error);
      setError('Impossible de charger les informations du bâtiment. Vérifiez votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" style={{ marginBottom: 12 }} />
        <Text style={{ color: '#666', fontSize: 16 }}>Chargement des informations du bâtiment...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }]}>
        <Text style={{ color: '#d32f2f', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        <TouchableWithoutFeedback onPress={loadBuildingData}>
          <View style={{ backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Réessayer</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  if (!buildingData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 16 }}>Aucune donnée de bâtiment disponible.</Text>
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
          <Header subtitle="Mon Bâtiment" showBackButton={false} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Mon Bâtiment</Text>
              <Text style={styles.sectionSubtitle}>
                Informations et contacts utiles
              </Text>
            </View>

            <View style={styles.buildingCard}>
              <Text style={styles.buildingName}>{buildingData.name}</Text>
              <Text style={styles.buildingAddress}>{buildingData.address}</Text>

                      <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Informations générales</Text>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="business-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Nombre d'étages</Text>
                    <Text style={styles.infoValue}>{buildingData.floors}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="home-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Nombre d'appartements</Text>
                    <Text style={styles.infoValue}>{buildingData.totalApartments}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="calendar-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Année de construction</Text>
                    <Text style={styles.infoValue}>{buildingData.yearBuilt}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="construct-outline" size={24} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Dernière rénovation</Text>
                    <Text style={styles.infoValue}>{buildingData.lastRenovation}</Text>
                  </View>
                </View>
              </View>

              {buildingData.facilities && buildingData.facilities.length > 0 && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>Équipements</Text>
                  {buildingData.facilities.map((facility, index) => (
                    <View key={index} style={styles.infoItem}>
                      <View style={styles.infoIcon}>
                        <Ionicons name="checkmark-circle-outline" size={24} color="#666" />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoValue}>{facility}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {guardianData && (
                <View style={styles.contactSection}>
                  <Text style={styles.contactTitle}>Gardien</Text>
                  <View style={styles.contactItem}>
                    <Ionicons name="person-outline" size={20} color="#666" />
                    <Text style={styles.contactText}>{guardianData.name}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Ionicons name="call-outline" size={20} color="#666" />
                    <Text style={styles.contactText}>{guardianData.phone}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Ionicons name="mail-outline" size={20} color="#666" />
                    <Text style={styles.contactText}>{guardianData.email}</Text>
                  </View>
                </View>
              )}

              {buildingData.rules && buildingData.rules !== 'Règlement non disponible' && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>Règlement</Text>
                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <Ionicons name="document-text-outline" size={24} color="#666" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoValue}>{buildingData.rules}</Text>
                    </View>
                  </View>
                </View>
              )}
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