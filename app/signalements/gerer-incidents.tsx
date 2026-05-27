import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
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
  const [imageToken, setImageToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const styles = useGererIncidentsStyle();

  // Types de signalement (identique à signalement.tsx)
  const signalementTypes = [
    "Problème de plomberie",
    "Problème électrique",
    "Problème de chauffage",
    "Vandalisme",
    "Bruit excessif",
    "Problème d'ascenseur",
    "Éclairage défaillant",
    "Problème de sécurité",
    "Autre"
  ];

  const incidentId = params.id as string;

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
    if (!comment.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un commentaire.');
      return;
    }

    try {
      setIsSubmittingComment(true);
      if (__DEV__) console.log('💬 [GESTION] Envoi commentaire (len):', comment.trim().length);

      const response = await apiFetch(`/api/incidents/${incidentId}/comments`, {
        method: 'POST',
        body: { comment: comment.trim() },
      });

      const data = await response.json();
      if (__DEV__) console.log('💬 [GESTION] Réponse commentaire (success/message):', { success: data?.success, message: data?.message });

      if (response.ok && data.success) {
        setComment('');
        Alert.alert('Succès', 'Commentaire ajouté avec succès !');
        // Recharger les données pour afficher le nouveau commentaire
        await loadIncidentData();
      } else {
        Alert.alert('Erreur', data.message || 'Impossible d\'ajouter le commentaire.');
      }
    } catch (error) {
      console.error('❌ [GESTION] Erreur envoi commentaire:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer le commentaire.');
    } finally {
      setIsSubmittingComment(false);
    }
  }, [comment, incidentId]);

  const handleUpdateIncident = useCallback(async () => {
    if (!incident) return;

    try {
      setIsUpdating(true);
      if (__DEV__) console.log('🔄 [GESTION] Mise à jour incident (status):', incidentStatus);

      const updateData: any = {};
      
      // Seulement envoyer les changements
      if (incidentStatus !== incident.status) {
        updateData.status = incidentStatus;
      }

      // Vérifier qu'il y a quelque chose à mettre à jour
      if (Object.keys(updateData).length === 0) {
        Alert.alert('Info', 'Aucune modification à enregistrer.');
        return;
      }

      const response = await apiFetch(`/api/incidents/${incidentId}`, {
        method: 'PUT',
        body: updateData,
      });

      const data = await response.json();
      if (__DEV__) console.log('🔄 [GESTION] Réponse mise à jour (success/message):', { success: data?.success, message: data?.message });

      if (response.ok && data.success) {
        Alert.alert('Succès', 'Incident mis à jour avec succès !');
        // Recharger les données pour afficher les changements
        await loadIncidentData();
      } else {
        Alert.alert('Erreur', data.message || 'Impossible de mettre à jour l\'incident.');
      }
    } catch (error) {
      console.error('❌ [GESTION] Erreur mise à jour:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour l\'incident.');
    } finally {
      setIsUpdating(false);
    }
  }, [incidentStatus, incident, incidentId]);

  const handleContactTenant = useCallback(() => {
    if (!incident) return;
    
    const phoneNumber = incident.user_email; // Ou téléphone si disponible
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
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

      <TouchableWithoutFeedback
        onPress={() => setIsSidebarVisible(false)}
        disabled={!isSidebarVisible}
      >
        <View style={styles.contentContainer}>
          <Header subtitle="Gérer l'incident" showBackButton={true} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
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
                <Image 
                  source={{
                    uri: imageToken
                      ? `${API_BASE_URL}/uploads/${incident.image}?token=${encodeURIComponent(imageToken)}`
                      : `${API_BASE_URL}/uploads/${incident.image}`,
                  }}
                  style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 10 }}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Section Statut (modifiable) */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Modifier le statut</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={incidentStatus}
                  onValueChange={(itemValue) => setIncidentStatus(itemValue)}
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="En attente" value="nouveau" />
                  <Picker.Item label="En cours" value="en_cours" />
                  <Picker.Item label="Résolu" value="resolu" />
                  <Picker.Item label="Fermé" value="ferme" />
                </Picker>
              </View>
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

            <TouchableOpacity
              style={[
                styles.buttonFigma,
                styles.primaryButtonFigma,
                { marginVertical: 10 },
                isUpdating && { opacity: 0.6 }
              ]}
              onPress={handleUpdateIncident}
              disabled={isUpdating}
            >
              <Text style={styles.primaryButtonTextFigma}>
                {isUpdating ? 'Mise à jour...' : 'Mettre à jour l\'incident'}
              </Text>
            </TouchableOpacity>

            <View style={styles.updatesSection}>
              <Text style={styles.updatesTitle}>Historique et Commentaires</Text>
              
              {history.map((item, index) => (
                <View key={`history-${item.id}`} style={styles.updateItem}>
                  <View style={[styles.updateImagePlaceholder, { backgroundColor: incidentStatusColors.en_cours }]} />
                  <View style={styles.updateContent}>
                    <Text style={styles.updateDate}>{formatDate(item.created_at)}</Text>
                    <Text style={styles.updateText}>
                      {item.action}
                      {item.old_status && item.new_status && 
                        ` : ${getStatusText(item.old_status)} → ${getStatusText(item.new_status)}`
                      }
                    </Text>
                    <Text style={styles.updateSubtitle}>
                      par {item.user_name || `${item.user_role}`}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Commentaires */}
              {comments.map((commentItem, index) => (
                <View key={`comment-${commentItem.id}`} style={styles.updateItem}>
                  <View style={[styles.updateImagePlaceholder, { backgroundColor: incidentStatusColors.resolu }]} />
                  <View style={styles.updateContent}>
                    <Text style={styles.updateDate}>{formatDate(commentItem.created_at)}</Text>
                    <Text style={styles.updateText}>{commentItem.comment}</Text>
                    <Text style={styles.updateSubtitle}>
                      par {commentItem.user_name || `${commentItem.user_role}`}
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
              
              <TouchableOpacity
                style={[styles.buttonFigma, styles.secondaryButtonMuted]}
                onPress={() => router.back()}
              >
                <Text style={styles.primaryButtonTextFigma}>Retour</Text>
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