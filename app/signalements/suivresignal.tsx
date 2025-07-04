import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Linking,
    Platform,
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
import { useSuivreSignalStyle } from "../../hooks/useSuivreSignalStyle";

const { width } = Dimensions.get("window");
const sidebarWidth = 250;

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
  guardian_phone?: string;
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

export default function SuivreSignal() {
  const router = useRouter();
  const styles = useSuivreSignalStyle();
  const params = useLocalSearchParams();
  
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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
    if (incidentId) {
      loadIncidentData();
    }
  }, [incidentId]);

  const loadIncidentData = async () => {
    try {
      console.log('📋 [SUIVI] Chargement incident ID:', incidentId);
      setIsLoading(true);

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter.', [
          { text: 'OK', onPress: () => router.replace('/auth/login') }
        ]);
        return;
      }

      // Récupérer les détails de l'incident
      const incidentResponse = await fetch(`${API_BASE_URL}/api/incidents/${incidentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (incidentResponse.ok) {
        const incidentData = await incidentResponse.json();
        console.log('📋 [SUIVI] Incident reçu:', incidentData);
        
        if (incidentData.success) {
          setIncident(incidentData.incident);
        }
      } else {
        console.error('❌ [SUIVI] Erreur récupération incident:', incidentResponse.status);
      }

      // Récupérer les commentaires
      const commentsResponse = await fetch(`${API_BASE_URL}/api/incidents/${incidentId}/comments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        console.log('💬 [SUIVI] Commentaires reçus:', commentsData);
        
        if (commentsData.success) {
          setComments(commentsData.comments || []);
        }
      }

      // Récupérer l'historique
      const historyResponse = await fetch(`${API_BASE_URL}/api/incidents/${incidentId}/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        console.log('📚 [SUIVI] Historique reçu:', historyData);
        
        if (historyData.success) {
          setHistory(historyData.history || []);
        }
      }

    } catch (error) {
      console.error('❌ [SUIVI] Erreur générale:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails de l\'incident.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactGuardian = () => {
    if (!incident?.guardian_phone) {
      Alert.alert('Information manquante', 'Numéro de téléphone du gardien non disponible.');
      return;
    }

    const phoneNumber = incident.guardian_phone.replace(/\s/g, ''); // Enlever les espaces
    const guardianName = `${incident.guardian_prenom} ${incident.guardian_nom}`;
    
    Alert.alert(
      'Contacter le gardien',
      `Souhaitez-vous appeler ${guardianName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Appeler', 
          onPress: () => Linking.openURL(`tel:${phoneNumber}`) 
        }
      ]
    );
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un commentaire.');
      return;
    }

    try {
      setIsSubmittingComment(true);
      console.log('💬 [SUIVI] Envoi commentaire:', newComment);

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/incidents/${incidentId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment: newComment.trim()
        })
      });

      const data = await response.json();
      console.log('💬 [SUIVI] Réponse commentaire:', data);

      if (response.ok && data.success) {
        setNewComment('');
        Alert.alert('Succès', 'Commentaire ajouté avec succès !');
        // Recharger les données pour afficher le nouveau commentaire
        await loadIncidentData();
      } else {
        Alert.alert('Erreur', data.message || 'Impossible d\'ajouter le commentaire.');
      }
    } catch (error) {
      console.error('❌ [SUIVI] Erreur envoi commentaire:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer le commentaire.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'nouveau': return 'En attente';
      case 'en_cours': return 'En cours';
      case 'resolu': return 'Résolu';
      case 'ferme': return 'Fermé';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau': return '#ff9500';
      case 'en_cours': return '#007AFF';
      case 'resolu': return '#34c759';
      case 'ferme': return '#8e8e93';
      default: return '#8e8e93';
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
          style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF', borderRadius: 8 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: 'white' }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <TouchableWithoutFeedback
        onPress={() => setIsSidebarVisible(false)}
        disabled={!isSidebarVisible}
      >
        <View style={styles.contentContainer}>
          <Header subtitle="Suivre un incident" showBackButton={false} />

          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Section Avatar et utilisateur */}
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
                <Text style={styles.userRole}>Déclarant</Text>
              </View>
            </View>

            {/* Titre de l'incident */}
            <Text style={styles.incidentTitle}>
              {incident.title || incident.type}
            </Text>

            {/* Section Métriques */}
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
                <Text style={styles.metricTitle}>Statut</Text>
                <Text style={[styles.metricData, { color: getStatusColor(incident.status) }]}>
                  {getStatusText(incident.status)}
                </Text>
              </View>
            </View>

            {/* Section Description */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{incident.description}</Text>
            </View>

            {/* Image si disponible */}
            {incident.image && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Photo</Text>
                <Image 
                  source={{ uri: `${API_BASE_URL}/uploads/${incident.image}` }}
                  style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 10 }}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Section Historique et Commentaires */}
            <View style={styles.updatesSection}>
              <Text style={styles.updatesTitle}>Historique et Commentaires</Text>
              
              {/* Historique */}
              {history.map((item, index) => (
                <View key={`history-${item.id}`} style={styles.updateItem}>
                  <Image 
                    source={item.user_role === 'guardian' 
                      ? require('../../assets/images/guard.png') 
                      : require('../../assets/images/luigi.png')
                    }
                    style={styles.updateImageAvatar}
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
                      par {item.user_name || `${item.user_role}`}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Commentaires */}
              {comments.map((comment, index) => (
                <View key={`comment-${comment.id}`} style={styles.updateItem}>
                  <Image 
                    source={comment.user_role === 'guardian' 
                      ? require('../../assets/images/guard.png') 
                      : require('../../assets/images/luigi.png')
                    }
                    style={styles.updateImageAvatar}
                    resizeMode="cover"
                  />
                  <View style={styles.updateContent}>
                    <Text style={styles.updateDate}>{formatDate(comment.created_at)}</Text>
                    <Text style={styles.updateText}>{comment.comment}</Text>
                    <Text style={styles.updateSubtitle}>
                      par {comment.user_name || `${comment.user_role}`}
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

            {/* Champ pour ajouter un commentaire */}
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
                placeholder="Tapez votre commentaire ici..."
                placeholderTextColor="#888"
                multiline
                value={newComment}
                onChangeText={setNewComment}
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
              onPress={handleSubmitComment}
              disabled={isSubmittingComment}
            >
              <Text style={styles.primaryButtonTextFigma}>
                {isSubmittingComment ? 'Envoi...' : 'Envoyer'}
              </Text>
            </TouchableOpacity>

            {/* Informations gardien si assigné */}
            {incident.guardian_nom && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Gardien assigné</Text>
                <Text style={styles.descriptionText}>
                  {incident.guardian_prenom} {incident.guardian_nom}
                </Text>
              </View>
            )}

            {/* Boutons d'action */}
            <View style={styles.buttonsContainerFigma}>
              <TouchableOpacity
                style={[
                  styles.buttonFigma, 
                  styles.secondaryButtonFigma,
                  { 
                    flex: incident.guardian_nom ? 0.35 : 0.5,
                    height: 40,
                    paddingHorizontal: 20
                  }
                ]}
                onPress={() => router.back()}
              >
                <Text style={[styles.secondaryButtonTextFigma, { fontSize: 14 }]}>Retour</Text>
              </TouchableOpacity>
              
              {incident.guardian_nom && (
                <TouchableOpacity
                  style={[styles.buttonFigma, styles.primaryButtonFigma, { flex: 0.65 }]}
                  onPress={handleContactGuardian}
                >
                  <Text style={styles.primaryButtonTextFigma}>Contacter le gardien</Text>
                </TouchableOpacity>
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
    </KeyboardAvoidingView>
  );
}
