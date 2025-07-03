module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Transformation des fichiers
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Extensions de fichiers de test (utilisé testMatch au lieu de testRegex)
  
  // Collecte de la couverture de code
  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.{ts,tsx,js,jsx}',
    'components/**/*.{ts,tsx,js,jsx}',
    'hooks/**/*.{ts,tsx,js,jsx}',
    'config/**/*.{ts,tsx,js,jsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/__tests__/**',
    '!**/tests/**',
  ],
  
  // Seuils de couverture
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Répertoires de sortie
  coverageDirectory: 'coverage',
  
  // Mock automatiques
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|react-native-vector-icons|@react-navigation|@react-native-async-storage|@react-native-picker)/)',
  ],
  
  // Modules à mocker
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
  },
  
  // Environment de test
  testEnvironment: 'node',
  
  // Cache des modules
  clearMocks: true,
  
  // Verbose pour plus de détails
  verbose: true,
  
  // Chemins des tests
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}',
  ],
  
  // Timeout par défaut
  testTimeout: 10000,
}; 