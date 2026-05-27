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
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Header from "../../components/Header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { API_BASE_URL } from "../../config";
import { apiFetch } from "../../config/api";
import { useProfilStyle } from "../../hooks/useProfilStyle";

export default function Profil() {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [imageToken, setImageToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    batiment_nom: "",
    batiments_id: "",
  });
  const [incidents, setIncidents] = useState<any[]>([]);
  const styles = useProfilStyle();

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
    loadUserData();
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    } catch (error) {
      console.error('❌ [PROFIL] Erreur chargement rôle:', error);
    }
  };

  const loadUserData = async () => {
    try {
      if (__DEV__) console.log('📱 [PROFIL] Chargement des données utilisateur...');
      setIsLoading(true);

      // Récupérer les données depuis AsyncStorage
      const [token, userId, userRole, userBuildingName, userBuildingId] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('userRole'),
        AsyncStorage.getItem('userBuildingName'),
        AsyncStorage.getItem('userBuildingId')
      ]);

      if (__DEV__) console.log('📱 [PROFIL] AsyncStorage:', { hasToken: !!token, hasUserId: !!userId, userRole });

      if (!token || !userId) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter.', [
          { text: 'OK', onPress: () => router.replace('/auth/login') }
        ]);
        return;
      }

      // Récupérer les informations du profil depuis l'API
      if (__DEV__) console.log('🌐 [PROFIL] Récupération profil depuis API...');
      const profileResponse = await apiFetch('/auth/profile');

      if (__DEV__) console.log('📡 [PROFIL] Réponse profil:', profileResponse.status);

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (__DEV__) console.log('👤 [PROFIL] Profil reçu (success):', { success: profileData?.success });

        if (profileData.success) {
          setFormData({
            nom: profileData.user.nom || "",
            prenom: profileData.user.prenom || "",
            email: profileData.user.email || "",
            telephone: profileData.user.telephone || "",
            batiment_nom: userBuildingName || profileData.user.building_name || "",
            batiments_id: userBuildingId || profileData.user.building_id || "",
          });
        }
      } else {
        console.error('❌ [PROFIL] Erreur récupération profil:', profileResponse.status);
        // Utiliser les données d'AsyncStorage en fallback
        setFormData({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          batiment_nom: userBuildingName || "",
          batiments_id: userBuildingId || "",
        });
      }

      // Récupérer les incidents de l'utilisateur
      if (__DEV__) console.log('🌐 [PROFIL] Récupération incidents...');
      const incidentsResponse = await apiFetch(`/api/incidents/user/${userId}`);

      if (__DEV__) console.log('📡 [PROFIL] Réponse incidents:', incidentsResponse.status);

      if (incidentsResponse.ok) {
        const incidentsData = await incidentsResponse.json();
        if (__DEV__) console.log('📋 [PROFIL] Incidents reçus (count):', Array.isArray(incidentsData?.incidents) ? incidentsData.incidents.length : 0);
        
        if (incidentsData.success && Array.isArray(incidentsData.incidents)) {
          setIncidents(incidentsData.incidents);
        } else {
          setIncidents([]);
        }
      } else {
        console.error('❌ [PROFIL] Erreur récupération incidents:', incidentsResponse.status);
        setIncidents([]);
      }

    } catch (error) {
      console.error('❌ [PROFIL] Erreur générale:', error);
      Alert.alert('Erreur', 'Impossible de charger vos informations.');
      setIncidents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (__DEV__) console.log('💾 [PROFIL] Sauvegarde en cours...');

      const token = await AsyncStorage.getItem('userToken');
      const userRole = await AsyncStorage.getItem('userRole');
      
      if (!token) {
        Alert.alert("Session expirée", "Veuillez vous reconnecter.");
        router.replace('/auth/login');
        return;
      }

      // Validation côté client
      if (!formData.nom.trim() || !formData.prenom.trim()) {
        Alert.alert("Erreur", "Le nom et le prénom sont requis.");
        return;
      }

      const endpoint = userRole === 'locataire' ? '/auth/profile/locataire' : '/auth/profile/guardian';
      if (__DEV__) console.log('🌐 [PROFIL] Endpoint:', endpoint);
      
      const requestData = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        telephone: formData.telephone.trim(),
      };

      if (__DEV__) console.log('📤 [PROFIL] Envoi des données (champs):', Object.keys(requestData));

      const response = await apiFetch(endpoint, {
        method: 'PUT',
        body: requestData,
      });

      if (__DEV__) console.log('📡 [PROFIL] Status réponse:', response.status);
      const data = await response.json();
      if (__DEV__) console.log('📡 [PROFIL] Réponse sauvegarde (success/message):', { success: data?.success, message: data?.message });

      if (response.ok && data.success) {
        Alert.alert("Succès", "Profil mis à jour avec succès !");
        
        // Recharger les données pour s'assurer qu'elles sont à jour
        if (__DEV__) console.log('🔄 [PROFIL] Rechargement des données...');
        await loadUserData();
        
        // Mettre à jour AsyncStorage avec les nouvelles données
        await Promise.all([
          AsyncStorage.setItem('userName', `${formData.prenom} ${formData.nom}`),
        ]);
        
      } else {
        Alert.alert("Erreur", data.message || "Erreur lors de la mise à jour du profil.");
      }
    } catch (error) {
      if (__DEV__) console.error("❌ [PROFIL] Erreur sauvegarde:", error);
      Alert.alert("Erreur", "Impossible de sauvegarder le profil. Veuillez réessayer plus tard.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Vous déménagez ?",
      "Êtes-vous sûr de vouloir supprimer votre compte ?",
      [
        { text: "Non", style: "cancel" },
        { text: "Oui", style: "destructive", onPress: async () => {
            // Deuxième confirmation
            Alert.alert(
              "Confirmation",
              "Cette action est irréversible. Voulez-vous vraiment supprimer votre compte ?",
              [
                { text: "Annuler", style: "cancel" },
                { text: "Supprimer", style: "destructive", onPress: async () => {
                    try {
                      const token = await AsyncStorage.getItem('userToken');
                      if (!token) {
                        Alert.alert("Session expirée", "Veuillez vous reconnecter.");
                        router.replace('/auth/login');
                        return;
                      }
                      const response = await apiFetch('/auth/profile', {
                        method: 'DELETE',
                      });
                      const data = await response.json();
                      if (response.ok && data.success) {
                        Alert.alert("Compte supprimé", "Votre compte a bien été supprimé.");
                        await AsyncStorage.clear();
                        router.replace('/auth/login');
                      } else {
                        Alert.alert("Erreur", data.message || "Erreur lors de la suppression du compte.");
                      }
                    } catch (error) {
                      Alert.alert("Erreur", "Impossible de supprimer le compte. Veuillez réessayer plus tard.");
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 16 }}>Chargement...</Text>
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
          <Header subtitle="Mon Profil" showBackButton={false} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            <View style={styles.avatarSection}>
              <Image 
                source={userRole === 'guardian' 
                  ? require('../../assets/images/guard.png') 
                  : require('../../assets/images/luigi.png')
                }
                style={styles.avatarImage}
                resizeMode="cover"
              />
              <Text style={styles.userName}>
                {`${formData.prenom} ${formData.nom}` || 'Nom non défini'}
              </Text>
              {formData.batiment_nom && (
                <Text style={styles.userBuilding}>{formData.batiment_nom}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("informations")}
            >
              <Text style={styles.sectionTitle}>Informations Personnelles</Text>
              <Ionicons
                name={
                  expandedSection === "informations"
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="rgba(0,0,0,0.7)"
              />
            </TouchableOpacity>
            {expandedSection === "informations" && (
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nom</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.nom}
                    onChangeText={(value) => handleInputChange("nom", value)}
                    placeholder={formData.nom || "Nom non défini"}
                    placeholderTextColor="rgba(0,0,0,0.5)"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Prénom</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.prenom}
                    onChangeText={(value) => handleInputChange("prenom", value)}
                    placeholder={formData.prenom || "Prénom non défini"}
                    placeholderTextColor="rgba(0,0,0,0.5)"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: '#f5f5f5', color: '#666' }]}
                    value={formData.email}
                    placeholder={formData.email || "Email non défini"}
                    placeholderTextColor="rgba(0,0,0,0.5)"
                    editable={false}
                  />
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    L'email ne peut pas être modifié
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Téléphone</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.telephone}
                    onChangeText={(value) => handleInputChange("telephone", value)}
                    placeholder={formData.telephone || "Téléphone non défini"}
                    placeholderTextColor="rgba(0,0,0,0.5)"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bâtiment</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: '#f5f5f5', color: '#666' }]}
                    value={formData.batiment_nom}
                    placeholder="Bâtiment non défini"
                    placeholderTextColor="rgba(0,0,0,0.5)"
                    editable={false}
                  />
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    Le bâtiment ne peut pas être modifié
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Sauvegarder</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("incidents")}
            >
              <Text style={styles.sectionTitle}>Vos Incidents ({incidents.length})</Text>
              <Ionicons
                name={
                  expandedSection === "incidents"
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="rgba(0,0,0,0.7)"
              />
            </TouchableOpacity>
            {expandedSection === "incidents" && (
              <View style={styles.incidentsContainer}>
                {incidents.length === 0 ? (
                  <Text style={{ color: "#666", textAlign: 'center', padding: 20 }}>
                    Aucun incident signalé pour le moment.
                  </Text>
                ) : (
                  incidents.map((incident) => (
                    <TouchableOpacity
                      key={incident.id}
                      style={styles.incidentItem}
                      onPress={() =>
                        router.push({
                          pathname: "/signalements/suivresignal",
                          params: {
                            id: incident.id,
                            title: incident.type,
                            date: incident.date,
                            status: incident.status || "En attente",
                            description: incident.description,
                            image: incident.image,
                          },
                        })
                      }
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
                        <Text style={styles.incidentDate}>{incident.date}</Text>
                        <Text style={styles.incidentStatus}>
                          {incident.status === 'nouveau' ? 'En attente' :
                           incident.status === 'en_cours' ? 'En cours' :
                           incident.status === 'resolu' ? 'Résolu' :
                           incident.status === 'ferme' ? 'Fermé' :
                           incident.status || "En attente"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}

                                <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Supprimer mon compte</Text>
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

