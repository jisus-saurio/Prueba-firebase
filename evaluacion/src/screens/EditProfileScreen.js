import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const { width, height } = Dimensions.get('window');

export default function EditProfileScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    universityDegree: '',
    graduationYear: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [focusedInput, setFocusedInput] = useState(null);

  // Animaciones
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de pulso continua
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    loadUserData();
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFormData({
          name: userData.name || '',
          universityDegree: userData.universityDegree || '',
          graduationYear: userData.graduationYear ? userData.graduationYear.toString() : '',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const { name, graduationYear } = formData;
    
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }

    if (graduationYear) {
      const currentYear = new Date().getFullYear();
      const yearNumber = parseInt(graduationYear);
      
      if (isNaN(yearNumber) || yearNumber < 1950 || yearNumber > currentYear + 10) {
        Alert.alert('Error', `Por favor, ingresa un año válido entre 1950 y ${currentYear + 10}`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updateData = {
        name: formData.name.trim(),
        updatedAt: new Date().toISOString(),
      };

      if (formData.universityDegree.trim()) {
        updateData.universityDegree = formData.universityDegree.trim();
      }

      if (formData.graduationYear) {
        updateData.graduationYear = parseInt(formData.graduationYear);
      }

      await updateDoc(doc(db, 'users', auth.currentUser.uid), updateData);
      
      Alert.alert('Éxito', 'Perfil actualizado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar',
      '¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.',
      [
        {
          text: 'Continuar editando',
          style: 'cancel',
        },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View
          style={[
            styles.loadingContent,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.loadingIcon} />
          <Text style={styles.loadingText}>CARGANDO PERFIL...</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fondo futurista */}
      <View style={styles.backgroundGradient}>
        <View style={[styles.gradientLayer, styles.gradientLayer1]} />
        <View style={[styles.gradientLayer, styles.gradientLayer2]} />
        <View style={[styles.gradientLayer, styles.gradientLayer3]} />
      </View>

      {/* Partículas flotantes */}
      <View style={styles.particlesContainer}>
        {[...Array(8)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                top: Math.random() * height,
                left: Math.random() * width,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        ))}
      </View>

      {/* Efectos de esquinas */}
      <View style={styles.cornerEffects}>
        <View style={[styles.cornerEffect, styles.topLeft]} />
        <View style={[styles.cornerEffect, styles.topRight]} />
        <View style={[styles.cornerEffect, styles.bottomLeft]} />
        <View style={[styles.cornerEffect, styles.bottomRight]} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header futurista */}
          <Animated.View
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <View style={styles.logoInner}>
                  <View style={styles.logoIcon} />
                </View>
                <View style={styles.logoRing} />
              </View>
            </View>
            
            <Text style={styles.title}>EDITAR PERFIL</Text>
            <Text style={styles.subtitle}>Actualizar Información</Text>
            
            <View style={styles.decorativeLines}>
              <View style={styles.line} />
              <View style={styles.centerDot} />
              <View style={styles.line} />
            </View>
          </Animated.View>

          {/* Formulario futurista */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Email (solo lectura) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
              <View style={styles.inputWrapperDisabled}>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={auth.currentUser?.email || ''}
                  editable={false}
                />
                <View style={styles.disabledOverlay} />
              </View>
              <Text style={styles.helpText}>El correo electrónico no se puede modificar</Text>
            </View>

            {/* Campo Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NOMBRE COMPLETO *</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'name' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nombre completo"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  autoCapitalize="words"
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                />
                <View style={styles.inputGlow} />
              </View>
            </View>

            {/* Campo Título Universitario */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>TÍTULO UNIVERSITARIO</Text>
              <View style={[
                styles.inputWrapper,
                styles.inputWrapperLarge,
                focusedInput === 'degree' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tu carrera universitaria..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={formData.universityDegree}
                  onChangeText={(value) => updateField('universityDegree', value)}
                  autoCapitalize="words"
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                  onFocus={() => setFocusedInput('degree')}
                  onBlur={() => setFocusedInput(null)}
                />
                <View style={styles.inputGlow} />
              </View>
            </View>

            {/* Campo Año de Graduación */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>AÑO DE GRADUACIÓN</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'year' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder={`${new Date().getFullYear()}`}
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={formData.graduationYear}
                  onChangeText={(value) => updateField('graduationYear', value)}
                  keyboardType="numeric"
                  maxLength={4}
                  onFocus={() => setFocusedInput('year')}
                  onBlur={() => setFocusedInput(null)}
                />
                <View style={styles.inputGlow} />
              </View>
            </View>

            {/* Panel de información */}
            <View style={styles.infoPanel}>
              <View style={styles.infoPanelHeader}>
                <View style={styles.infoDot} />
                <Text style={styles.infoPanelTitle}>INFORMACIÓN</Text>
              </View>
              <Text style={styles.infoText}>* Campos obligatorios</Text>
              <Text style={styles.infoText}>Última actualización: {new Date().toLocaleDateString('es-ES')}</Text>
            </View>

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>CANCELAR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <View style={styles.saveButtonContent}>
                  <Text style={styles.saveButtonText}>
                    {isLoading ? 'GUARDANDO...' : 'GUARDAR'}
                  </Text>
                  <View style={styles.buttonGlow} />
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },

  // Loading screen
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00d4ff',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '700',
    letterSpacing: 2,
  },

  // Fondo futurista
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientLayer1: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  gradientLayer2: {
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
    transform: [{ rotate: '45deg' }],
  },
  gradientLayer3: {
    backgroundColor: 'rgba(147, 51, 234, 0.04)',
    transform: [{ rotate: '-45deg' }],
  },

  // Partículas
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: 'rgba(0, 212, 255, 0.6)',
    borderRadius: 1.5,
  },

  // Efectos de esquinas
  cornerEffects: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  cornerEffect: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  topLeft: {
    top: 20,
    left: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 20,
    right: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 40,
    left: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 40,
    right: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },

  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  // Header
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#00d4ff',
    borderRadius: 10,
  },
  logoRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    borderStyle: 'dashed',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 4,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 212, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 2,
    marginBottom: 20,
  },
  decorativeLines: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  line: {
    width: 30,
    height: 1,
    backgroundColor: 'rgba(0, 212, 255, 0.5)',
  },
  centerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00d4ff',
  },

  // Formulario
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapperLarge: {
    minHeight: 60,
  },
  inputWrapperFocused: {
    borderColor: 'rgba(0, 212, 255, 0.5)',
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
  },
  inputWrapperDisabled: {
    position: 'relative',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  inputDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  inputGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  helpText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 5,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },

  // Panel de información
  infoPanel: {
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  infoPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00d4ff',
    marginRight: 8,
  },
  infoPanelTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00d4ff',
    letterSpacing: 1,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },

  // Botones
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
  },
  saveButton: {
    flex: 2,
    borderRadius: 10,
    position: 'relative',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonContent: {
    backgroundColor: 'rgba(0, 212, 255, 0.8)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  buttonGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    zIndex: -1,
  },
});