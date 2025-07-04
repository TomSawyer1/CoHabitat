import { StyleSheet } from 'react-native';

export const useAccueilStyle = () => {
  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 100,
      paddingBottom: 50,
    },
    headerSection: {
      alignItems: 'center',
      marginBottom: 50,
    },
    appTitle: {
      fontSize: 42,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginBottom: 16,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    subtitle: {
      fontSize: 18,
      color: '#fff',
      textAlign: 'center',
      marginBottom: 12,
      fontWeight: '600',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    description: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: 20,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    buttonsSection: {
      gap: 16,
      paddingHorizontal: 20,
    },
    button: {
      width: '100%',
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    primaryButton: {
      backgroundColor: '#007AFF',
    },
    primaryButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderWidth: 2,
      borderColor: '#007AFF',
    },
    secondaryButtonText: {
      color: '#007AFF',
      fontSize: 18,
      fontWeight: '600',
    },
    footer: {
      alignItems: 'center',
      marginTop: 30,
    },
    footerText: {
      fontSize: 14,
      color: '#fff',
      textAlign: 'center',
      opacity: 0.8,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    
    // Anciens styles conservés pour compatibilité
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingBottom: 100,
      gap: 24,
    },
  });
}; 