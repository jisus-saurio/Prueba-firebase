import React, { useState } from 'react';
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
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function AddUserScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    specialty: '',
    role: 'user', // Campo adicional para rol
    phone: '', // Campo adicional para teléfono
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, email, password, age } = formData;
    
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Nombre, email y contraseña son campos obligatorios');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (age && (isNaN(age) || parseInt(age) < 1 || parseInt(age) > 120)) {
      Alert.alert('Error', 'Por favor, ingresa una edad válida');
      return false;
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleAddUser = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password
      );

      // Guardar datos adicionales en Firestore
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.uid || 'admin', // Quien creó el usuario
        isActive: true,
      };

      // Agregar campos opcionales solo si tienen valor
      if (formData.age) {
        userData.age = parseInt(formData.age);
      }
      if (formData.specialty.trim()) {
        userData.specialty = formData.specialty.trim();
      }
      if (formData.phone.trim()) {
        userData.phone = formData.phone.trim();
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      Alert.alert(
        'Usuario Creado', 
        `Usuario ${formData.name} creado exitosamente`,
        [
          {
            text: 'Crear Otro',
            onPress: () => {
              // Limpiar formulario para crear otro usuario
              setFormData({
                name: '',
                email: '',
                password: '',
                age: '',
                specialty: '',
                role: 'user',
                phone: '',
              });
            },
          },
          {
            text: 'Volver',
            onPress: () => navigation.goBack(),
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
          message = 'La contraseña es muy débil';
          break;
        case 'auth/operation-not-allowed':
          message = 'No tienes permisos para crear usuarios';
          break;
        default:
          message = `Error: ${error.message}`;
      }
      
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar',
      '¿Estás seguro de que quieres cancelar? Los datos ingresados se perderán.',
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

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Elementos decorativos de fondo */}
      <View style={styles.backgroundDecor}>
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
        <View style={[styles.decorCircle, styles.decorCircle3]} />
        <View style={[styles.decorCircle, styles.decorCircle4]} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header moderno */}
        <View style={styles.headerContainer}>
          <View style={styles.logoWrapper}>
            <View style={styles.logoBackground}>
              <Text style={styles.logo}>👤</Text>
            </View>
          </View>
          
          <Text style={styles.title}>Agregar Usuario</Text>
          <Text style={styles.subtitle}>Crea una nueva cuenta de usuario</Text>
          
          {/* Línea decorativa */}
          <View style={styles.decorLine} />
        </View>

        {/* Contenedor del formulario con card effect */}
        <View style={styles.formCard}>
          <View style={styles.formContainer}>
            
            {/* Campo Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>👨 Nombre Completo *</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'name' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre y apellidos"
                  placeholderTextColor="#a0a0a0"
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  autoCapitalize="words"
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Campo Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>📧 Correo Electrónico *</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'email' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="usuario@ejemplo.com"
                  placeholderTextColor="#a0a0a0"
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>🔒 Contraseña *</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'password' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#a0a0a0"
                  value={formData.password}
                  onChangeText={(value) => updateField('password', value)}
                  secureTextEntry
                  autoComplete="password-new"
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Campos en fila: Edad y Teléfono */}
            <View style={styles.rowContainer}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>🎂 Edad</Text>
                <View style={[
                  styles.inputWrapper,
                  focusedInput === 'age' && styles.inputWrapperFocused
                ]}>
                  <TextInput
                    style={styles.input}
                    placeholder="25"
                    placeholderTextColor="#a0a0a0"
                    value={formData.age}
                    onChangeText={(value) => updateField('age', value)}
                    keyboardType="numeric"
                    maxLength={3}
                    onFocus={() => setFocusedInput('age')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>📱 Teléfono</Text>
                <View style={[
                  styles.inputWrapper,
                  focusedInput === 'phone' && styles.inputWrapperFocused
                ]}>
                  <TextInput
                    style={styles.input}
                    placeholder="+503 1234-5678"
                    placeholderTextColor="#a0a0a0"
                    value={formData.phone}
                    onChangeText={(value) => updateField('phone', value)}
                    keyboardType="phone-pad"
                    onFocus={() => setFocusedInput('phone')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>
            </View>

            {/* Campo Especialidad */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>💼 Especialidad</Text>
              <View style={[
                styles.inputWrapper,
                focusedInput === 'specialty' && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Profesión o área de especialización"
                  placeholderTextColor="#a0a0a0"
                  value={formData.specialty}
                  onChangeText={(value) => updateField('specialty', value)}
                  autoCapitalize="words"
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                  onFocus={() => setFocusedInput('specialty')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Selector de Rol */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>🔑 Rol del Usuario</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'user' && styles.roleButtonActive
                  ]}
                  onPress={() => updateField('role', 'user')}
                >
                  <Text style={[
                    styles.roleButtonText,
                    formData.role === 'user' && styles.roleButtonTextActive
                  ]}>
                    👤 Usuario
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'admin' && styles.roleButtonActive
                  ]}
                  onPress={() => updateField('role', 'admin')}
                >
                  <Text style={[
                    styles.roleButtonText,
                    formData.role === 'admin' && styles.roleButtonTextActive
                  ]}>
                    👑 Admin
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Información de campos obligatorios */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>* Campos obligatorios</Text>
              <Text style={styles.infoText}>
                El usuario recibirá acceso inmediato con estas credenciales
              </Text>
            </View>

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.createButton, isLoading && styles.createButtonDisabled]}
                onPress={handleAddUser}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <View style={styles.buttonGradient}>
                  <Text style={styles.createButtonText}>
                    {isLoading ? '⏳ Creando...' : '✨ Crear Usuario'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  
  // Elementos decorativos de fondo
  backgroundDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
  },
  decorCircle1: {
    width: 180,
    height: 180,
    top: -60,
    right: -40,
  },
  decorCircle2: {
    width: 120,
    height: 120,
    bottom: 150,
    left: -30,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  decorCircle3: {
    width: 200,
    height: 200,
    top: '35%',
    right: -80,
    backgroundColor: 'rgba(147, 51, 234, 0.04)',
  },
  decorCircle4: {
    width: 90,
    height: 90,
    bottom: 50,
    right: 30,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  
  // Header moderno
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logoWrapper: {
    marginBottom: 25,
  },
  logoBackground: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  logo: {
    fontSize: 45,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  decorLine: {
    width: 50,
    height: 3,
    backgroundColor: '#16a34a',
    borderRadius: 2,
  },
  
  // Card del formulario
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },
  formContainer: {
    padding: 24,
  },
  
  // Grupos de input
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: '#16a34a',
    backgroundColor: '#ffffff',
    shadowColor: '#16a34a',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  
  // Contenedor de fila para campos lado a lado
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  
  // Información
  infoContainer: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeft: 4,
    borderLeftColor: '#0ea5e9',
  },
  infoText: {
    fontSize: 14,
    color: '#0369a1',
    marginBottom: 4,
    fontWeight: '500',
  },
  
  // Botones de acción
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  createButton: {
    flex: 2,
    borderRadius: 14,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  createButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  buttonGradient: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});