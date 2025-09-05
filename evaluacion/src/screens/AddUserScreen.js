import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Importar componentes
import BackgroundEffects from '../components/BackgroundEffects';
import FuturisticHeader from '../components/FuturisticHeader';
import FuturisticInput from '../components/FuturisticInput';
import InfoPanel from '../components/InfoPanel';
import FuturisticButton from '../components/FuturisticButton';

export default function AddUserScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    universityDegree: '',
    graduationYear: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

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
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, email, universityDegree, graduationYear } = formData;
    
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'El email es obligatorio');
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, ingresa un email válido');
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

  const handleAddUser = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Generar contraseña temporal
      const tempPassword = `temp${Math.random().toString(36).slice(-8)}`;
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        tempPassword
      );

      // Guardar datos en Firestore
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        universityDegree: formData.universityDegree.trim(),
        graduationYear: formData.graduationYear.trim(),
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.uid || 'system',
        isActive: true,
        tempPassword: tempPassword, // Para que el admin pueda informar al usuario
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      Alert.alert(
        'Usuario Creado Exitosamente', 
        `Usuario: ${formData.name}\nEmail: ${formData.email}\nContraseña temporal: ${tempPassword}\n\n¡Asegúrate de compartir estas credenciales de forma segura!`,
        [
          {
            text: 'Crear Otro',
            onPress: () => {
              setFormData({
                name: '',
                email: '',
                universityDegree: '',
                graduationYear: '',
              });
            },
          },
          {
            text: 'Volver al Inicio',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );

    } catch (error) {
      console.log('Error al crear usuario:', error);
      let message = 'Error al crear usuario';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Este correo electrónico ya está registrado';
          break;
        case 'auth/invalid-email':
          message = 'Correo electrónico inválido';
          break;
        case 'auth/weak-password':
          message = 'La contraseña generada es muy débil';
          break;
        default:
          message = `Error: ${error.message}`;
      }
      
      Alert.alert('Error del Sistema', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Confirmar Cancelación',
      '¿Estás seguro de que quieres cancelar? Los datos ingresados se perderán.',
      [
        {
          text: 'Continuar Editando',
          style: 'cancel',
        },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
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
          title="AGREGAR USUARIO"
          subtitle="Sistema de Gestión de Cuentas"
          statusText="MÓDULO ACTIVO"
          statusColor="#10b981"
          titleColor="#10b981"
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
              <Text style={styles.formTitle}>DATOS DEL USUARIO</Text>
            </View>
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
              label="CORREO ELECTRÓNICO"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="usuario@ejemplo.com"
              focused={focusedInput === 'email'}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              keyboardType="email-address"
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

            <InfoPanel title="INFORMACIÓN DEL SISTEMA">
              <InfoPanel.Text>• Se generará una contraseña temporal automáticamente</InfoPanel.Text>
              <InfoPanel.Text>• El usuario recibirá acceso inmediato al sistema</InfoPanel.Text>
              <InfoPanel.Text>• La fecha de "Miembro desde" se asignará automáticamente</InfoPanel.Text>
            </InfoPanel>

            {/* Botones de acción */}
            <View style={styles.actionContainer}>
              <FuturisticButton
                title="CANCELAR"
                variant="danger"
                onPress={handleCancel}
                flex={1}
              />
              
              <FuturisticButton
                title="CREAR USUARIO"
                variant="primary"
                onPress={handleAddUser}
                disabled={isLoading}
                loading={isLoading}
                flex={2}
              />
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 70,
  },
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
  },
  formDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
  },
  formContent: {
    padding: 24,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});