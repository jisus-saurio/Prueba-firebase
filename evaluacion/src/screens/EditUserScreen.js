import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const { width, height } = Dimensions.get('window');

// Componente para efectos de fondo
const BackgroundEffects = ({ pulseAnim, rotateAnim }) => {
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      {/* Fondo futurista */}
      <View style={styles.backgroundGradient}>
        <View style={[styles.gradientLayer, styles.gradientLayer1]} />
        <View style={[styles.gradientLayer, styles.gradientLayer2]} />
        <View style={[styles.gradientLayer, styles.gradientLayer3]} />
      </View>

      {/* Partículas flotantes */}
      <View style={styles.particlesContainer}>
        {[...Array(10)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                top: Math.random() * height,
                left: Math.random() * width,
                transform: [
                  { scale: pulseAnim },
                  { rotate: spin },
                ],
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
    </>
  );
};

// Componente para el header
const FuturisticHeader = ({ fadeAnim, slideAnim, pulseAnim, userName }) => (
  <Animated.View
    style={[
      styles.headerContainer,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      },
    ]}
  >
    <Animated.View
      style={[
        styles.logoContainer,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <View style={styles.logoCircle}>
        <View style={styles.logoInner}>
          <Text style={styles.logoText}>
            {userName ? userName.charAt(0).toUpperCase() : 'E'}
          </Text>
        </View>
        <View style={styles.logoRing} />
        <View style={styles.logoRing2} />
      </View>
    </Animated.View>
    
    <Text style={styles.titleText}>EDITAR USUARIO</Text>
    <Text style={styles.subtitleText}>Modificación de Datos del Sistema</Text>
    
    <View style={styles.statusIndicator}>
      <Animated.View
        style={[
          styles.statusDot,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Text style={styles.statusText}>MODO EDICIÓN ACTIVO</Text>
    </View>
  </Animated.View>
);

// Componente para input futurista
const FuturisticInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  focused, 
  onFocus, 
  onBlur, 
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  multiline = false,
  editable = true
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[
      styles.inputContainer,
      focused && styles.inputContainerFocused,
      !editable && styles.inputContainerDisabled
    ]}>
      <TextInput
        style={[
          styles.input, 
          multiline && styles.inputMultiline,
          !editable && styles.inputDisabled
        ]}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.4)"
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
        editable={editable}
      />
      {focused && editable && <View style={styles.inputGlow} />}
    </View>
  </View>
);

// Componente principal
export default function EditUserScreen({ route, navigation }) {
  const { userId, userData } = route.params;
  
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    universityDegree: userData?.universityDegree || '',
    graduationYear: userData?.graduationYear || '',
  });
  
  const [originalData, setOriginalData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Animaciones
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de rotación continua
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    // Animación de pulso continua
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Cargar datos actuales del usuario
    loadUserData();
  }, []);

  useEffect(() => {
    // Verificar si hay cambios
    const hasFormChanges = 
      formData.name !== originalData.name ||
      formData.universityDegree !== originalData.universityDegree ||
      formData.graduationYear !== originalData.graduationYear;
    
    setHasChanges(hasFormChanges);
  }, [formData, originalData]);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          universityDegree: data.universityDegree || '',
          graduationYear: data.graduationYear || '',
        });
        setOriginalData({
          name: data.name || '',
          email: data.email || '',
          universityDegree: data.universityDegree || '',
          graduationYear: data.graduationYear || '',
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, universityDegree, graduationYear } = formData;
    
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }

    if (!universityDegree.trim()) {
      Alert.alert('Error', 'El título universitario es obligatorio');
      return false;
    }

    if (!graduationYear.trim()) {
      Alert.alert('Error', 'El año de graduación es obligatorio');
      return false;
    }

    // Validar año de graduación
    const currentYear = new Date().getFullYear();
    const year = parseInt(graduationYear);
    if (isNaN(year) || year < 1950 || year > currentYear + 5) {
      Alert.alert('Error', `El año de graduación debe estar entre 1950 y ${currentYear + 5}`);
      return false;
    }

    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    if (!hasChanges) {
      Alert.alert('Sin Cambios', 'No se han realizado modificaciones');
      return;
    }

    setIsLoading(true);
    try {
      // Actualizar solo los campos modificables (no el email)
      const updateData = {
        name: formData.name.trim(),
        universityDegree: formData.universityDegree.trim(),
        graduationYear: formData.graduationYear.trim(),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, 'users', userId), updateData);

      Alert.alert(
        'Actualización Exitosa', 
        `Los datos de ${formData.name} han sido actualizados correctamente`,
        [
          {
            text: 'Volver a la Lista',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Alert.alert('Error del Sistema', 'No se pudieron guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Descartar Cambios',
        '¿Estás seguro de que quieres descartar los cambios realizados?',
        [
          {
            text: 'Continuar Editando',
            style: 'cancel',
          },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <BackgroundEffects pulseAnim={pulseAnim} rotateAnim={rotateAnim} />

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FuturisticHeader 
          fadeAnim={fadeAnim} 
          slideAnim={slideAnim} 
          pulseAnim={pulseAnim}
          userName={formData.name}
        />

        {/* Formulario */}
        <Animated.View
          style={[
            styles.formCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.formHeader}>
            <View style={styles.formTitleContainer}>
              <View style={styles.formDot} />
              <Text style={styles.formTitle}>MODIFICAR DATOS</Text>
            </View>
            {hasChanges && (
              <View style={styles.changesIndicator}>
                <View style={styles.changesDot} />
                <Text style={styles.changesText}>CAMBIOS PENDIENTES</Text>
              </View>
            )}
          </View>

          <View style={styles.formContent}>
            <FuturisticInput
              label="NOMBRE COMPLETO"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Ingresa el nombre completo"
              focused={focusedInput === 'name'}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="words"
            />

            <FuturisticInput
              label="CORREO ELECTRÓNICO (NO EDITABLE)"
              value={formData.email}
              placeholder="Correo electrónico"
              focused={false}
              onFocus={() => {}}
              onBlur={() => {}}
              editable={false}
            />

            <FuturisticInput
              label="TÍTULO UNIVERSITARIO"
              value={formData.universityDegree}
              onChangeText={(value) => updateField('universityDegree', value)}
              placeholder="Ej: Licenciatura en Ingeniería"
              focused={focusedInput === 'universityDegree'}
              onFocus={() => setFocusedInput('universityDegree')}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="words"
              multiline={true}
            />

            <FuturisticInput
              label="AÑO DE GRADUACIÓN"
              value={formData.graduationYear}
              onChangeText={(value) => updateField('graduationYear', value)}
              placeholder="2020"
              focused={focusedInput === 'graduationYear'}
              onFocus={() => setFocusedInput('graduationYear')}
              onBlur={() => setFocusedInput(null)}
              keyboardType="numeric"
              maxLength={4}
            />

            {/* Info panel */}
            <View style={styles.infoPanel}>
              <View style={styles.infoPanelHeader}>
                <View style={styles.infoDot} />
                <Text style={styles.infoPanelTitle}>INFORMACIÓN DE CUENTA</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Creado:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(originalData.createdAt || userData?.createdAt)}
                </Text>
              </View>
              {originalData.updatedAt && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Última actualización:</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(originalData.updatedAt)}
                  </Text>
                </View>
              )}
              <Text style={styles.infoText}>
                • El correo electrónico no puede ser modificado por seguridad
              </Text>
              <Text style={styles.infoText}>
                • Los cambios se aplicarán inmediatamente al guardar
              </Text>
            </View>

            {/* Botones de acción */}
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <View style={styles.cancelContent}>
                  <Text style={styles.cancelText}>CANCELAR</Text>
                  <View style={styles.cancelGlow} />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.saveButton, 
                  (isLoading || !hasChanges) && styles.saveButtonDisabled
                ]}
                onPress={handleSaveChanges}
                disabled={isLoading || !hasChanges}
                activeOpacity={0.8}
              >
                <View style={styles.saveContent}>
                  <Text style={styles.saveText}>
                    {isLoading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                  </Text>
                  <View style={styles.saveGlow} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
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
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  gradientLayer2: {
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    transform: [{ rotate: '30deg' }],
  },
  gradientLayer3: {
    backgroundColor: 'rgba(147, 51, 234, 0.04)',
    transform: [{ rotate: '-30deg' }],
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
    width: 2,
    height: 2,
    backgroundColor: 'rgba(59, 130, 246, 0.6)',
    borderRadius: 1,
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
    width: 50,
    height: 50,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  topLeft: {
    top: 60,
    left: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 60,
    right: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 120,
    left: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 120,
    right: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },

  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 70,
  },

  // Header
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    marginBottom: 20,
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
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },
  logoRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderStyle: 'dashed',
  },
  logoRing2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 4,
    textShadowColor: 'rgba(59, 130, 246, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitleText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
  },
  statusText: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Formulario
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  formHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  formTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  formDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginRight: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
  },
  changesIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  changesDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#f59e0b',
    marginRight: 6,
  },
  changesText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f59e0b',
    letterSpacing: 1,
  },
  formContent: {
    padding: 24,
  },

  // Inputs
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  inputContainerFocused: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  inputContainerDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  inputGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 13,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    zIndex: -1,
  },

  // Panel de información
  infoPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3b82f6',
    marginRight: 6,
  },
  infoPanelTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b82f6',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 16,
  },

  // Botones de acción
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    position: 'relative',
  },
  cancelContent: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220, 53, 69, 0.3)',
    position: 'relative',
  },
  cancelText: {
    color: '#dc3545',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cancelGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    zIndex: -1,
  },
  saveButton: {
    flex: 2,
    position: 'relative',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveContent: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  saveText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  saveGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    zIndex: -1,
  },
});