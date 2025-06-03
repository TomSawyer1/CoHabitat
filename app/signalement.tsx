import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Signalement() {
  const router = useRouter();
  // Vous pouvez ajouter des états ici pour gérer les valeurs des inputs
  const [typeSignalement, setTypeSignalement] = useState('');
  const [lieu, setLieu] = useState('');
  const [dateHeure, setDateHeure] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSubmit = () => {
    // Logique pour soumettre le signalement
    console.log('Signalement soumis:', { typeSignalement, lieu, dateHeure, description, selectedImage });
    // Rediriger ou afficher un message de succès
    // router.back(); // Exemple de redirection
  };

  const pickImage = async () => {
    // Demande la permission d'accéder à la galerie de photos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Désolé, nous avons besoin des permissions de la galerie pour que cela fonctionne !');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
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
          <Text style={styles.headerSubtitle}>Signalement</Text>
        </View>
      </View>

      {/* Contenu principal */}
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        {/* Titre et sous-titre de section */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Nouveau Signalement</Text>
          <Text style={styles.sectionSubtitle}>Veuillez décrire le problème ou l'incident.</Text>
        </View>

        {/* Inputs */}
        <View style={styles.inputsContainer}>
          {/* Input Type de signalement */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Type de signalement</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Ex: Vandalisme, Problème technique"
                placeholderTextColor="#888"
                value={typeSignalement}
                onChangeText={setTypeSignalement}
              />
            </View>
          </View>

          {/* Input Lieu */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Lieu</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Ex: Bâtiment A, Appartement 3B"
                placeholderTextColor="#888"
                value={lieu}
                onChangeText={setLieu}
              />
            </View>
          </View>

          {/* Input Date et Heure */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date et Heure</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Ex: 20/10/2023 14:30"
                placeholderTextColor="#888"
                value={dateHeure}
                onChangeText={setDateHeure}
              />
            </View>
          </View>

          {/* Input Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <View style={[styles.inputFieldContainer, styles.descriptionInputContainer]}>
              <TextInput
                style={[styles.inputField, styles.descriptionInputField]}
                placeholder="Décrivez le problème en détail"
                placeholderTextColor="#888"
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          {/* Section Ajout Photo */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Photo (optionnel)</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Ionicons name="camera" size={24} color="#000" />
              <Text style={styles.imagePickerButtonText}>Choisir une photo</Text>
            </TouchableOpacity>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            )}
          </View>

        </View>

        {/* Boutons */}
        <View style={styles.buttonsContainerHorizontal}>
          {/* Secondaire */}
          <TouchableOpacity 
            style={[styles.buttonHorizontal, styles.secondaryButtonHorizontal]}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonHorizontalText}>Annuler</Text>
          </TouchableOpacity>

          {/* Primaire */}
          <TouchableOpacity 
            style={[styles.buttonHorizontal, styles.primaryButtonHorizontal]}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryButtonHorizontalText}>Soumettre</Text>
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
  descriptionInputContainer: {
    height: 150,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  descriptionInputField: {
    height: '100%',
  },
  inputInfo: {
    fontSize: 13,
    color: '#00000080',
    marginTop: 2,
  },
  eyeIcon: {
    padding: 4,
  },
  buttonsContainerHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 16,
  },
  buttonHorizontal: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonHorizontal: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  secondaryButtonHorizontalText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  primaryButtonHorizontal: {
    backgroundColor: '#000',
  },
  primaryButtonHorizontalText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    justifyContent: 'center',
  },
  imagePickerButtonText: {
    fontSize: 16,
    color: '#000',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
}); 