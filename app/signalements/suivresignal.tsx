import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
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
import { apiFetch } from "../../config/api";
import { useSuivreSignalStyle } from "../../hooks/useSuivreSignalStyle";
import { colors, getIncidentStatusColor } from "../../theme";

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
  
  const scrollRef = useRef<ScrollView>(null);
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
      if (__DEV__) console.log('📋 [SUIVI] Chargement incident ID:', incidentId);
      setIsLoading(true);

      // Récupérer les détails de l'incident
      const incidentResponse = await apiFetch(`/api/incidents/${incidentId}`);

      if (incidentResponse.ok) {
        const incidentData = await incidentResponse.json();
        if (__DEV__) console.log('📋 [SUIVI] Incident reçu (success):', { success: incidentData?.success });
        
        if (incidentData.success) {
          setIncident(incidentData.incident);
        }
      } else {
        console.error('❌ [SUIVI] Erreur récupération incident:', incidentResponse.status);
      }

      // Récupérer les commentaires
      const commentsResponse = await apiFetch(`/api/incidents/${incidentId}/comments`);

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        if (__DEV__) console.log('💬 [SUIVI] Commentaires (count):', Array.isArray(commentsData?.comments) ? commentsData.comments.length : 0);
        
        if (commentsData.success) {
          setComments(commentsData.comments || []);
        }
      }

      // Récupérer l'historique
      const historyResponse = await apiFetch(`/api/incidents/${incidentId}/history`);

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        if (__DEV__) console.log('📚 [SUIVI] Historique (count):', Array.isArray(historyData?.history) ? historyData.history.length : 0);
        
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
    const text = newComment.trim();
    if (!text) return;

    const optimistic: Comment = {
      id: Date.now(),
      incident_id: parseInt(incidentId),
      user_id: 0,
      user_role: 'locataire',
      comment: text,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user_name: 'Vous',
    };

    setComments(prev => [...prev, optimistic]);
    setNewComment('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      setIsSubmittingComment(true);
      if (__DEV__) console.log('💬 [SUIVI] Envoi commentaire (len):', text.length);

      const response = await apiFetch(`/api/incidents/${incidentId}/comments`, {
        method: 'POST',
        body: { comment: text },
      });

      const data = await response.json();
      if (__DEV__) console.log('💬 [SUIVI] Réponse commentaire (success):', data?.success);

      if (response.ok && data.success) {
        await loadIncidentData();
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
      } else {
        setComments(prev => prev.filter(c => c.id !== optimistic.id));
        setNewComment(text);
        Alert.alert('Erreur', data.message || 'Impossible d\'ajouter le commentaire.');
      }
    } catch (error) {
      console.error('❌ [SUIVI] Erreur envoi commentaire:', error);
      setComments(prev => prev.filter(c => c.id !== optimistic.id));
      setNewComment(text);
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
          <Header subtitle="Suivre un incident" showBackButton={false} />

          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
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
                <Text style={styles.userRole}>Déclarant</Text>
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
                <Text style={styles.metricTitle}>Statut</Text>
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
                  source={{ uri: `${API_BASE_URL}/uploads/${incident.image}` }}
                  style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 10 }}
                  resizeMode="cover"
                />
              </View>
            )}

            <View style={styles.updatesSection}>
              <Text style={styles.updatesTitle}>Historique et Commentaires</Text>
              
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

            {incident.guardian_nom && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Gardien assigné</Text>
                <Text style={styles.descriptionText}>
                  {incident.guardian_prenom} {incident.guardian_nom}
                </Text>
              </View>
            )}

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
