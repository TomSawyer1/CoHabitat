import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Logique pour envoyer le lien de réinitialisation du mot de passe
    console.log('Demande de réinitialisation pour:', email);
    // Afficher un message à l'utilisateur (email envoyé ou erreur)
    // Rediriger, par exemple vers une page de confirmation ou la page de connexion
    // router.push('/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header rectangulaire noir */}
      <View style={styles.headerRect}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>CoHabitat</Text>
          <Text style={styles.headerSubtitle}>Mot de passe oublié</Text>
        </View>
      </View>

      {/* Contenu principal */}
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        {/* Titre et sous-titre de section */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Réinitialiser votre mot de passe</Text>
          <Text style={styles.sectionSubtitle}>Entrez votre email pour recevoir un lien de réinitialisation.</Text>
        </View>

        {/* Inputs */}
        <View style={styles.inputsContainer}>
          {/* Input Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Entrez votre email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
        </View>

        {/* Bouton */}
        <View style={styles.buttonsContainerHorizontal}>
          <TouchableOpacity 
            style={[styles.buttonHorizontal, styles.primaryButtonHorizontal]}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryButtonHorizontalText}>Envoyer le lien</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    marginBottom: 6,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitleContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionSubtitle: {
    color: '#00000080',
    fontSize: 16,
  },
  inputsContainer: {
    marginBottom: 30,
    gap: 20,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0000001A',
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: '#f9fafb',
  },
  inputField: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  buttonsContainerHorizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonHorizontal: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 200, // Limite la largeur du bouton pour qu'il ne prenne pas toute la largeur
  },
  primaryButtonHorizontal: {
    backgroundColor: '#000',
  },
  primaryButtonHorizontalText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
}); 