import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Importar componentes
import BackgroundEffects from '../components/BackgroundEffects';
import FuturisticHeader from '../components/FuturisticHeader';
import FuturisticInput from '../components/FuturisticInput';
import InfoPanel from '../components/InfoPanel';
import FuturisticButton from '../components/FuturisticButton';
import LoadingScreen from '../components/LoadingScreen';

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
      <LoadingScreen 
        pulseAnim={pulseAnim}
        text="CARGANDO PERFIL..."
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Fondo futurista con menos partículas */}
      <View style={styles.backgroundGradient}>
        <View style={[styles.gradientLayer, styles.gradientLayer1]} />
        <View style={[styles.gradientLayer, styles.gradientLayer2]} />
        <View style={[styles.gradientLayer, styles.gradientLayer3]} />
      </View>

      {/* Partículas flotantes reducidas */}
      <View style={styles.particlesContainer}>
        {[...Array(8)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                top: Math.random() * 800,
                left: Math.random() * 400,
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
          <FuturisticHeader 
            fadeAnim={fadeAnim} 
            slideAnim={slideAnim} 
            pulseAnim={pulseAnim}
            title="EDITAR PERFIL"
            subtitle="Actualizar Información"
            statusText="CONECTADO"
            statusColor="#00d4ff"
            titleColor="#00d4ff"
          />

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
            <FuturisticInput
              label="CORREO ELECTRÓNICO"
              value={auth.currentUser?.email || ''}
              editable={false}
              helpText="El correo electrónico no se puede modificar"
            />

            {/* Campo Nombre */}
            <FuturisticInput
              label="NOMBRE COMPLETO *"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Ingresa tu nombre completo"
              focused={focusedInput === 'name'}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="words"
            />

            {/* Campo Título Universitario */}
            <FuturisticInput
              label="TÍTULO UNIVERSITARIO"
              value={formData.universityDegree}
              onChangeText={(value) => updateField('universityDegree', value)}
              placeholder="Tu carrera universitaria..."
              focused={focusedInput === 'degree'}
              onFocus={() => setFocusedInput('degree')}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="words"
              multiline={true}
            />

            {/* Campo Año de Graduación */}
            <FuturisticInput
              label="AÑO DE GRADUACIÓN"
              value={formData.graduationYear}
              onChangeText={(value) => updateField('graduationYear', value)}
              placeholder={`${new Date().getFullYear()}`}
              focused={focusedInput === 'year'}
              onFocus={() => setFocusedInput('year')}
              onBlur={() => setFocusedInput(null)}
              keyboardType="numeric"
              maxLength={4}
            />

            <InfoPanel 
              title="INFORMACIÓN"
              titleColor="#00d4ff"
              dotColor="#00d4ff"
              backgroundColor="rgba(0, 212, 255, 0.05)"
              borderColor="rgba(0, 212, 255, 0.2)"
            >
              <InfoPanel.Text>* Campos obligatorios</InfoPanel.Text>
              <InfoPanel.Text>
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </InfoPanel.Text>
            </InfoPanel>

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
              <FuturisticButton
                title="CANCELAR"
                variant="outline"
                onPress={handleCancel}
                flex={1}
              />

              <FuturisticButton
                title="GUARDAR"
                variant="secondary"
                onPress={handleSave}
                disabled={isLoading}
                loading={isLoading}
                flex={2}
              />
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

  // Formulario
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Botones
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});