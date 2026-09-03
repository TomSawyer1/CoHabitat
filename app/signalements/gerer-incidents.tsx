import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthImage from "../../components/AuthImage";
import Header from "../../components/Header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { API_BASE_URL } from "../../config";
import { apiFetch } from "../../config/api";
import { useGererIncidentsStyle } from "../../hooks/useGererIncidentsStyle";
import { colors, getIncidentStatusColor, incidentStatusColors } from "../../theme";

interface Incident {
  id: number;
  type: string;
  title?: string;
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
  guardian_nom?: string;
  guardian_prenom?: string;
  assigned_guardian_id?: number;
  idBatiment: number;
  idUtilisateur: number;
}

interface Comment {
  id: number;
  incident_id: number;
  user_id: number;
  user_role: string;
  comment: string;
  created_at: string;
  user_name?: string;
}

interface HistoryItem {
  id: number;
  incident_id: number;
  action: string;
  old_status?: string;
  new_status?: string;
  comment?: string;
  user_id: number;
  user_role: string;
  created_at: string;
  user_name?: string;
}

export default function GererIncidents() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [comment, setComment] = useState("");
  const [incidentStatus, setIncidentStatus] = useState("nouveau");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showStatusList, setShowStatusList] = useState(false);
  const styles = useGererIncidentsStyle();

  const incidentId = params.id as string;

  // Écran réservé aux gardiens : un locataire qui navigue ici est renvoyé
  // vers le suivi (le backend refuse déjà les mutations, mais on ne doit pas
  // afficher l'interface de gestion).
  useEffect(() => {
    AsyncStorage.getItem("userRole").then((role) => {
      if (role !== "guardian") {
        router.replace(
          incidentId
            ? { pathname: "/signalements/suivresignal", params: { id: incidentId } }
            : "/accueil/home"
        );
      }
    });
  }, [incidentId, router]);

  useEffect(() => {
    if (incidentId) {
      loadIncidentData();
    }
  }, [incidentId]);

  const loadIncidentData = async () => {
    try {
      if (__DEV__) console.log('📋 [GESTION] Chargement incident ID:', incidentId);
      setIsLoading(true);

      const incidentResponse = await apiFetch(`/api/incidents/${incidentId}`);

      if (incidentResponse.ok) {
        const incidentData = await incidentResponse.json();
        if (__DEV__) console.log('📋 [GESTION] Incident reçu (success):', { success: incidentData?.success });
        
        if (incidentData.success) {
          setIncident(incidentData.incident);
          setIncidentStatus(incidentData.incident.status);
        }
      } else {
        console.error('❌ [GESTION] Erreur récupération incident:', incidentResponse.status);
        Alert.alert('Erreur', 'Impossible de charger les détails de l\'incident.');
        router.back();
        return;
      }

      // Récupérer les commentaires
      const commentsResponse = await apiFetch(`/api/incidents/${incidentId}/comments`);

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        if (__DEV__) console.log('💬 [GESTION] Commentaires (count):', Array.isArray(commentsData?.comments) ? commentsData.comments.length : 0);
        
        if (commentsData.success) {
          setComments(commentsData.comments || []);
        }
      }

      // Récupérer l'historique
      const historyResponse = await apiFetch(`/api/incidents/${incidentId}/history`);

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        if (__DEV__) console.log('📚 [GESTION] Historique (count):', Array.isArray(historyData?.history) ? historyData.history.length : 0);
        
        if (historyData.success) {
          setHistory(historyData.history || []);
        }
      }

    } catch (error) {
      console.error('❌ [GESTION] Erreur générale:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails de l\'incident.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendComment = useCallback(async () => {
    const text = comment.trim();
    if (!text) return;

    const optimistic: Comment = {
      id: Date.now(),
      incident_id: parseInt(incidentId),
      user_id: 0,
      user_role: 'guardian',
      comment: text,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user_name: 'Vous',
    };

    setComments(prev => [...prev, optimistic]);
    setComment('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      setIsSubmittingComment(true);
      if (__DEV__) console.log('💬 [GESTION] Envoi commentaire (len):', text.length);

      const response = await apiFetch(`/api/incidents/${incidentId}/comments`, {
        method: 'POST',
        body: { comment: text },
      });

      const data = await response.json();
      if (__DEV__) console.log('💬 [GESTION] Réponse commentaire (success):', data?.success);

      if (response.ok && data.success) {
        await loadIncidentData();
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
      } else {
        setComments(prev => prev.filter(c => c.id !== optimistic.id));
        setComment(text);
        Alert.alert('Erreur', data.message || 'Impossible d\'ajouter le commentaire.');
      }
    } catch (error) {
      console.error('❌ [GESTION] Erreur envoi commentaire:', error);
      setComments(prev => prev.filter(c => c.id !== optimistic.id));
      setComment(text);
      Alert.alert('Erreur', 'Impossible d\'envoyer le commentaire.');
    } finally {
      setIsSubmittingComment(false);
    }
  }, [comment, incidentId]);

  const handleUpdateStatus = useCallback(async (newStatus: string) => {
    if (!incident || newStatus === incident.status) return;

    setIncidentStatus(newStatus);
    setShowStatusList(false);

    try {
      setIsUpdating(true);
      if (__DEV__) console.log('🔄 [GESTION] Mise à jour statut:', newStatus);

      const response = await apiFetch(`/api/incidents/${incidentId}`, {
        method: 'PUT',
        body: { status: newStatus },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await loadIncidentData();
      } else {
        setIncidentStatus(incident.status);
        Alert.alert('Erreur', data.message || 'Impossible de mettre à jour le statut.');
      }
    } catch (error) {
      console.error('❌ [GESTION] Erreur mise à jour:', error);
      setIncidentStatus(incident.status);
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut.');
    } finally {
      setIsUpdating(false);
    }
  }, [incident, incidentId]);

  const handleContactTenant = useCallback(() => {
    if (!incident) return;

    Alert.alert(
      'Contacter le locataire',
      `Email: ${incident.user_email || 'Non disponible'}\n\nVoulez-vous envoyer un email ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Email', 
          onPress: () => {
            // TODO: Implémenter l'envoi d'email
            Alert.alert('Info', 'Fonctionnalité d\'email en cours de développement.');
          }
        }
      ]
    );
  }, [incident]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'nouveau': return 'En attente';
      case 'en_cours': return 'En cours';
      case 'resolu': return 'Résolu';
      case 'ferme': return 'Fermé';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString.replace(' ', 'T'));
    if (isNaN(d.getTime())) return dateString;
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} à ${h}h${m}`;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 16 }}>Chargement...</Text>
      </View>
    );
  }

  if (!incident) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 16 }}>Incident non trouvé</Text>
        <TouchableOpacity 
          style={{ marginTop: 20, padding: 10, backgroundColor: colors.primary, borderRadius: 8 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: colors.primaryContrast }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
      <TouchableWithoutFeedback
        onPress={() => setIsSidebarVisible(false)}
        disabled={!isSidebarVisible}
      >
        <View style={styles.contentContainer}>
          <Header subtitle="Gérer l'incident" showBackButton={false} />

          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.avatarContainer}>
              <Image 
                source={require('../../assets/images/luigi.png')}
                style={styles.avatarImage}
                resizeMode="cover"
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {incident.user_prenom} {incident.user_nom}
                </Text>
                <Text style={styles.userRole}>Locataire</Text>
              </View>
            </View>

            <Text style={styles.incidentTitle}>
              {incident.title || incident.type}
            </Text>

            <View style={styles.metricsSection}>
              <Text style={styles.sectionTitle}>Détails de l'incident</Text>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricTitle}>Type</Text>
                <Text style={styles.metricData}>{incident.type}</Text>
              </View>

              {incident.etage && (
                <View style={styles.metricItem}>
                  <Text style={styles.metricTitle}>Étage</Text>
                  <Text style={styles.metricData}>{incident.etage}</Text>
                </View>
              )}

              {incident.numero_porte && (
                <View style={styles.metricItem}>
                  <Text style={styles.metricTitle}>Numéro de porte</Text>
                  <Text style={styles.metricData}>{incident.numero_porte}</Text>
                </View>
              )}

              <View style={styles.metricItem}>
                <Text style={styles.metricTitle}>Bâtiment</Text>
                <Text style={styles.metricData}>{incident.building_nom || 'Non spécifié'}</Text>
              </View>

              <View style={styles.metricItem}>
                <Text style={styles.metricTitle}>Date de création</Text>
                <Text style={styles.metricData}>{formatDate(incident.created_at)}</Text>
              </View>

              <View style={styles.metricItem}>
                <Text style={styles.metricTitle}>Statut actuel</Text>
                <Text style={[styles.metricData, { color: getIncidentStatusColor(incident.status) }]}>
                  {getStatusText(incident.status)}
                </Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{incident.description}</Text>
            </View>

            {incident.image && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Photo</Text>
                <AuthImage
                  uri={`${API_BASE_URL}/uploads/${incident.image}`}
                  style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 10 }}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Section Statut (modifiable) */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Modifier le statut</Text>
              <TouchableOpacity
                style={[styles.pickerContainer, {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  backgroundColor: '#fff',
                  opacity: isUpdating ? 0.5 : 1,
                }]}
                onPress={() => !isUpdating && setShowStatusList(!showStatusList)}
                activeOpacity={0.7}
                disabled={isUpdating}
              >
                <Text style={{ fontSize: 15, color: getIncidentStatusColor(incidentStatus), fontWeight: '500' }}>
                  {getStatusText(incidentStatus)}
                </Text>
                <Ionicons
                  name={showStatusList ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#6b7280"
                />
              </TouchableOpacity>
              {showStatusList && (
                <View style={{
                  marginTop: 4,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  backgroundColor: '#fff',
                  overflow: 'hidden',
                  zIndex: 20,
                }}>
                  {([
                    { label: 'En attente', value: 'nouveau' },
                    { label: 'En cours', value: 'en_cours' },
                    { label: 'Résolu', value: 'resolu' },
                    { label: 'Fermé', value: 'ferme' },
                  ] as const).map((item, index, arr) => (
                    <View key={item.value}>
                      <TouchableOpacity
                        style={{
                          paddingVertical: 12,
                          paddingHorizontal: 14,
                          backgroundColor: incidentStatus === item.value ? '#f0f9ff' : '#fff',
                        }}
                        onPress={() => handleUpdateStatus(item.value)}
                      >
                        <Text style={{
                          fontSize: 15,
                          color: getIncidentStatusColor(item.value),
                          fontWeight: incidentStatus === item.value ? '600' : '400',
                        }}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                      {index < arr.length - 1 && (
                        <View style={{ height: 1, backgroundColor: '#f3f4f6' }} />
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.commentInputContainer}>
              <Text style={styles.commentInputLabel}>Ajouter un commentaire</Text>
              <TextInput
                style={[styles.commentTextFieldPlaceholder, {
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 8,
                  padding: 12,
                  minHeight: 80,
                  textAlignVertical: 'top'
                }]}
                multiline
                placeholder="Tapez votre commentaire ici..."
                placeholderTextColor="#888"
                value={comment}
                onChangeText={setComment}
                editable={!isSubmittingComment}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.buttonFigma,
                styles.primaryButtonFigma,
                styles.sendButtonFigma,
                isSubmittingComment && { opacity: 0.6 }
              ]}
              onPress={handleSendComment}
              disabled={isSubmittingComment}
            >
              <Text style={styles.primaryButtonTextFigma}>
                {isSubmittingComment ? 'Envoi...' : 'Envoyer commentaire'}
              </Text>
            </TouchableOpacity>

            <View style={styles.updatesSection}>
              <Text style={styles.updatesTitle}>Historique et Commentaires</Text>
              
              {history.map((item) => (
                <View key={`history-${item.id}`} style={styles.updateItem}>
                  <Image
                    source={item.user_role === 'guardian'
                      ? require('../../assets/images/guard.png')
                      : require('../../assets/images/luigi.png')
                    }
                    style={[styles.updateImagePlaceholder, { overflow: 'hidden' }]}
                    resizeMode="cover"
                  />
                  <View style={styles.updateContent}>
                    <Text style={styles.updateDate}>{formatDate(item.created_at)}</Text>
                    <Text style={styles.updateText}>
                      {item.action}
                      {item.old_status && item.new_status &&
                        ` : ${getStatusText(item.old_status)} → ${getStatusText(item.new_status)}`
                      }
                    </Text>
                    <Text style={styles.updateSubtitle}>
                      par {item.user_name || item.user_role}
                    </Text>
                  </View>
                </View>
              ))}

              {comments.map((commentItem) => (
                <View key={`comment-${commentItem.id}`} style={styles.updateItem}>
                  <Image
                    source={commentItem.user_role === 'guardian'
                      ? require('../../assets/images/guard.png')
                      : require('../../assets/images/luigi.png')
                    }
                    style={[styles.updateImagePlaceholder, { overflow: 'hidden' }]}
                    resizeMode="cover"
                  />
                  <View style={styles.updateContent}>
                    <Text style={styles.updateDate}>{formatDate(commentItem.created_at)}</Text>
                    <Text style={styles.updateText}>{commentItem.comment}</Text>
                    <Text style={styles.updateSubtitle}>
                      par {commentItem.user_name || commentItem.user_role}
                    </Text>
                  </View>
                </View>
              ))}

              {history.length === 0 && comments.length === 0 && (
                <Text style={{ color: '#666', textAlign: 'center', padding: 20 }}>
                  Aucun historique ou commentaire pour cet incident.
                </Text>
              )}
            </View>

            <View style={styles.buttonsContainerFigma}>
              <TouchableOpacity
                style={[styles.buttonFigma, styles.primaryButtonFigma]}
                onPress={handleContactTenant}
              >
                <Text style={styles.primaryButtonTextFigma}>Contacter le locataire</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Navbar
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
        router={router}
      />

      <Sidebar
        isSidebarVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </View>
  );
} 