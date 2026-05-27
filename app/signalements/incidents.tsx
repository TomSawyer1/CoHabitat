import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
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
import { apiFetch } from "../../config/api";
import { useIncidentsListStyle } from "../../hooks/useIncidentsListStyle";
import { getIncidentStatusColor } from "../../theme";

interface Incident {
  id: number;
  type: string;
  description: string;
  date: string;
  image?: string;
  status: string;
  etage?: string;
  numero_porte?: string;
  created_at: string;
  updated_at: string;
  user_nom?: string;
  user_prenom?: string;
  user_email?: string;
  building_nom?: string;
  idBatiment: number;
}

interface IncidentsData {
  nonPrisEnCharge: Incident[];
  enCours: Incident[];
  resolus: Incident[];
  fermes: Incident[];
}

export default function Incidents() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<IncidentsData>({
    nonPrisEnCharge: [],
    enCours: [],
    resolus: [],
    fermes: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [imageToken, setImageToken] = useState<string | null>(null);
  const styles = useIncidentsListStyle();

  useEffect(() => {
    const loadToken = async () => {
      try {
        const t = await AsyncStorage.getItem("token");
        setImageToken(t);
      } catch {
        setImageToken(null);
      }
    };
    void loadToken();
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      if (__DEV__) console.log('📋 [INCIDENTS] Chargement des incidents...');
      setIsLoading(true);

      const [userId, userRole, buildingId] = await Promise.all([
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('userRole'),
        AsyncStorage.getItem('userBuildingId')
      ]);

      setUserRole(userRole);

      let path = '/api/incidents';
      if (userRole === 'guardian' && buildingId) {
        path = `/api/incidents?building_id=${buildingId}`;
      } else if (userRole === 'locataire' && userId) {
        path = `/api/incidents/user/${userId}`;
      }

      const response = await apiFetch(path);

      if (__DEV__) console.log('📡 [INCIDENTS] Réponse API:', response.status);

      if (response.ok) {
        const data = await response.json();
        if (__DEV__) console.log('📋 [INCIDENTS] Données reçues (success/count):', { success: data?.success, count: Array.isArray(data?.incidents) ? data.incidents.length : 0 });

        if (data.success) {
          const allIncidents = data.incidents || [];
          if (__DEV__) console.log('📊 [INCIDENTS] Total incidents:', allIncidents.length);

          // Organiser les incidents par statut
          const organizedIncidents: IncidentsData = {
            nonPrisEnCharge: allIncidents.filter((inc: Incident) => inc.status === 'nouveau'),
            enCours: allIncidents.filter((inc: Incident) => inc.status === 'en_cours'),
            resolus: allIncidents.filter((inc: Incident) => inc.status === 'resolu'),
            fermes: allIncidents.filter((inc: Incident) => inc.status === 'ferme')
          };

          if (__DEV__) console.log('📊 [INCIDENTS] Répartition:', {
            nouveau: organizedIncidents.nonPrisEnCharge.length,
            en_cours: organizedIncidents.enCours.length,
            resolu: organizedIncidents.resolus.length,
            ferme: organizedIncidents.fermes.length
          });

          setIncidents(organizedIncidents);
        } else {
          console.error('❌ [INCIDENTS] Erreur API:', data.message);
          Alert.alert('Erreur', data.message || 'Impossible de charger les incidents.');
        }
      } else {
        console.error('❌ [INCIDENTS] Erreur HTTP:', response.status);
        Alert.alert('Erreur', 'Impossible de charger les incidents.');
      }

    } catch (error) {
      console.error('❌ [INCIDENTS] Erreur générale:', error);
      Alert.alert('Erreur', 'Impossible de charger les incidents.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'nouveau': return 'Non pris en charge';
      case 'en_cours': return 'En cours de traitement';
      case 'resolu': return 'Résolu';
      case 'ferme': return 'Fermé';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderIncidentsList = (incidentsList: Incident[]) => {
    if (incidentsList.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucun incident dans cette catégorie</Text>
        </View>
      );
    }

    return incidentsList.map((incident) => (
      <TouchableOpacity
        key={incident.id}
        style={styles.incidentItem}
        onPress={() => {
          // Navigation vers la page de détail/suivi
          if (userRole === 'guardian') {
            // Gardien vers gestion
            router.push({
              pathname: "/signalements/gerer-incidents",
              params: {
                id: incident.id,
                title: incident.type,
                date: formatDate(incident.created_at),
                status: incident.status,
                description: incident.description,
                image: incident.image,
              },
            });
          } else {
            // Locataire vers suivi
            router.push({
              pathname: "/signalements/suivresignal",
              params: {
                id: incident.id,
                title: incident.type,
                date: formatDate(incident.created_at),
                status: incident.status,
                description: incident.description,
                image: incident.image,
              },
            });
          }
        }}
      >
        {incident.image ? (
          <Image 
            source={{
              uri: imageToken
                ? `${API_BASE_URL}/uploads/${incident.image}?token=${encodeURIComponent(imageToken)}`
                : `${API_BASE_URL}/uploads/${incident.image}`,
            }}
            style={styles.incidentImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.incidentImage} />
        )}
        
        <View style={styles.incidentInfo}>
          <Text style={styles.incidentTitle}>{incident.type}</Text>
          
          {userRole === 'guardian' && incident.user_nom && (
            <Text style={[styles.incidentDate, { color: '#666', fontSize: 12 }]}>
              Par: {incident.user_prenom} {incident.user_nom}
            </Text>
          )}
          
          {(incident.etage || incident.numero_porte) && (
            <Text style={[styles.incidentDate, { color: '#666', fontSize: 12 }]}>
              {incident.etage && `Étage ${incident.etage}`}
              {incident.etage && incident.numero_porte && ' - '}
              {incident.numero_porte && `Porte ${incident.numero_porte}`}
            </Text>
          )}
          
          <Text style={styles.incidentDate}>{formatDate(incident.created_at)}</Text>
          <Text style={[styles.incidentStatus, { color: getIncidentStatusColor(incident.status) }]}>
            {getStatusText(incident.status)}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 16 }}>Chargement des incidents...</Text>
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
          <Header 
            subtitle={userRole === 'guardian' ? "Incidents du Bâtiment" : "Mes Incidents"} 
            showBackButton={false} 
          />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("nonPrisEnCharge")}
            >
              <Text style={styles.sectionTitle}>
                Non Pris en Charge ({incidents.nonPrisEnCharge.length})
              </Text>
              <Ionicons
                name={
                  expandedSection === "nonPrisEnCharge"
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="rgba(0,0,0,0.7)"
              />
            </TouchableOpacity>
            {expandedSection === "nonPrisEnCharge" && (
              <View style={styles.incidentsContainer}>
                {renderIncidentsList(incidents.nonPrisEnCharge)}
              </View>
            )}

            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("enCours")}
            >
              <Text style={styles.sectionTitle}>
                En Cours ({incidents.enCours.length})
              </Text>
              <Ionicons
                name={
                  expandedSection === "enCours"
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="rgba(0,0,0,0.7)"
              />
            </TouchableOpacity>
            {expandedSection === "enCours" && (
              <View style={styles.incidentsContainer}>
                {renderIncidentsList(incidents.enCours)}
              </View>
            )}

            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("resolus")}
            >
              <Text style={styles.sectionTitle}>
                Résolus ({incidents.resolus.length})
              </Text>
              <Ionicons
                name={
                  expandedSection === "resolus"
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="rgba(0,0,0,0.7)"
              />
            </TouchableOpacity>
            {expandedSection === "resolus" && (
              <View style={styles.incidentsContainer}>
                {renderIncidentsList(incidents.resolus)}
              </View>
            )}

            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("fermes")}
            >
              <Text style={styles.sectionTitle}>
                Fermés ({incidents.fermes.length})
              </Text>
              <Ionicons
                name={
                  expandedSection === "fermes"
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="rgba(0,0,0,0.7)"
              />
            </TouchableOpacity>
            {expandedSection === "fermes" && (
              <View style={styles.incidentsContainer}>
                {renderIncidentsList(incidents.fermes)}
              </View>
            )}

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadIncidents}
            >
              <Text style={styles.refreshButtonText}>Actualiser</Text>
            </TouchableOpacity>
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