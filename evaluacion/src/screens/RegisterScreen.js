import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Importar componentes
import BackgroundEffectsCustom from '../components/BackgroundEffectsCustom';
import FuturisticInput from '../components/FuturisticInput';
import InfoPanel from '../components/InfoPanel';
import FuturisticButton from '../components/FuturisticButton';
import AuthFormWrapper from '../components/AuthFormWrapper';
import AnimatedLogo from '../components/AnimatedLogo';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    universityDegree: '',
    graduationYear: '',
  });
  const [isLoading, setIsLoading] = useState(false);
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
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, email, password, universityDegree, graduationYear } = formData;
    
    if (!name.trim() || !email.trim() || !password.trim() || !universityDegree.trim() || !graduationYear.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    const currentYear = new Date().getFullYear();
    const yearNumber = parseInt(graduationYear);
    
    if (isNaN(yearNumber) || yearNumber < 1950 || yearNumber > currentYear + 10) {
      Alert.alert('Error', `Por favor, ingresa un año válido entre 1950 y ${currentYear + 10}`);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        universityDegree: formData.universityDegree.trim(),
        graduationYear: parseInt(formData.graduationYear),
        createdAt: new Date().toISOString(),
        isActive: true,
      });

      Alert.alert('Éxito', 'Usuario registrado correctamente');

    } catch (error) {
      let message = 'Error al registrar usuario';

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Este correo electrónico ya está registrado';
          break;
        case 'auth/invalid-email':
          message = 'Correo electrónico inválido';
          break;
        case 'auth/weak-password':
          message = 'La contraseña es muy débil';
          break;
        default:
          message = `Error: ${error.message}`;
      }
      
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundEffectsCustom 
        pulseAnim={pulseAnim} 
        particleCount={8}
        primaryColor="rgba(0, 212, 255, 0.6)"
        gradientColors={{
          layer1: 'rgba(16, 185, 129, 0.08)',
          layer2: 'rgba(59, 130, 246, 0.06)',
          layer3: 'rgba(147, 51, 234, 0.04)',
        }}
        cornerColor="rgba(0, 212, 255, 0.3)"
        cornerOffset={{ top: 60, bottom: 40, side: 20 }}
        cornerSize={40}
      />

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
            <AnimatedLogo
              size={80}
              fadeAnim={fadeAnim}
              innerColor="rgba(0, 212, 255, 0.2)"
              iconColor="#00d4ff"
              ring1Color="rgba(0, 212, 255, 0.3)"
              showRings={true}
            />
            
            <Text style={styles.title}>CREAR CUENTA</Text>
            <Text style={styles.subtitle}>Información Académica</Text>
            
            <AuthFormWrapper.DecorativeLines 
              lineColor="rgba(0, 212, 255, 0.5)"
              dotColor="#00d4ff"
            />
          </Animated.View>

          {/* Formulario futurista */}
          <AuthFormWrapper
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            padding={24}
          >
            {/* Campo Nombre */}
            <FuturisticInput
              label="NOMBRE COMPLETO"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Ingresa tu nombre completo"
              focused={focusedInput === 'name'}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="words"
            />

            {/* Campo Email */}
            <FuturisticInput
              label="CORREO ELECTRÓNICO"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="ejemplo@universidad.edu"
              focused={focusedInput === 'email'}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Campo Contraseña */}
            <FuturisticInput
              label="CONTRASEÑA"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              placeholder="Mínimo 6 caracteres"
              focused={focusedInput === 'password'}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              keyboardType="default"
              autoCapitalize="none"
            />

            {/* Campo Título */}
            <FuturisticInput
              label="TÍTULO UNIVERSITARIO"
              value={formData.universityDegree}
              onChangeText={(value) => updateField('universityDegree', value)}
              placeholder="Ingeniería en Sistemas, Licenciatura..."
              focused={focusedInput === 'degree'}
              onFocus={() => setFocusedInput('degree')}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="words"
              multiline={true}
            />

            {/* Campo Año */}
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

            {/* Panel de información */}
            <InfoPanel 
              title="INFORMACIÓN"
              titleColor="#00d4ff"
              dotColor="#00d4ff"
              backgroundColor="rgba(0, 212, 255, 0.05)"
              borderColor="rgba(0, 212, 255, 0.2)"
            >
              <InfoPanel.Text>Todos los campos son obligatorios</InfoPanel.Text>
              <InfoPanel.Text>Tu información será verificada</InfoPanel.Text>
            </InfoPanel>

            {/* Botón de registro */}
            <FuturisticButton
              title="CREAR CUENTA"
              variant="secondary"
              onPress={handleRegister}
              disabled={isLoading}
              loading={isLoading}
              style={styles.registerButton}
            />

            <AuthFormWrapper.Divider />

            {/* Link de login */}
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.loginButtonText}>YA TENGO CUENTA</Text>
            </TouchableOpacity>
          </AuthFormWrapper>
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
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 4,
    marginBottom: 8,
    marginTop: 30,
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

  // Botón de registro
  registerButton: {
    marginBottom: 24,
  },

  // Botón de login
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
  },
});