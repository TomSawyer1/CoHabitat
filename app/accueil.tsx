import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Accueil() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Ellipse décorative noire */}
      <View style={styles.ellipseContainer}>
        <View style={styles.ellipse} />
        {/* Titre blanc centré sur l'ellipse */}
        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>CoHabitat</Text>
        </View>
      </View>

      {/* Contenu principal - Boutons */}
      <View style={styles.contentContainer}>
        {/* Bouton Locataire */}
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.primaryButtonText}>Locataire</Text>
        </TouchableOpacity>

        {/* Bouton Gardien */}
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/gardian-login')}
        >
          <Text style={styles.secondaryButtonText}>Gardien</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  ellipseContainer: {
    position: 'absolute',
    width: '100%',
    top: -18,
    left: 0,
    zIndex: 0,
    alignItems: 'center',
  },
  ellipse: {
    width: '100%',
    height: 185,
    backgroundColor: '#000',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
    headerTitleContainer: {
    position: 'absolute',
    top: 110,
    left: 0,
    width: '100%',
    zIndex: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 100,
    gap: 16,
  },
  button: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#000',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
}); 