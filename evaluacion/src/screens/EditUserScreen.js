import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Importar componentes
import BackgroundEffects from '../components/BackgroundEffects';
import FuturisticHeader from '../components/FuturisticHeader';
import FuturisticInput from '../components/FuturisticInput';
import InfoPanel from '../components/InfoPanel';
import FuturisticButton from '../components/FuturisticButton';

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
      console.log('Cargando datos del usuario con ID:', userId);
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('Datos del usuario cargados:', data);
        
        const userData = {
          name: data.name || '',
          email: data.email || '',
          universityDegree: data.universityDegree || '',
          graduationYear: data.graduationYear || '',
        };
        
        setFormData(userData);
        setOriginalData({
          ...userData,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } else {
        console.log('No se encontró el usuario');
        Alert.alert('Error', 'No se encontró el usuario');
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario: ' + error.message);
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
    console.log('Iniciando guardado de cambios...');
    
    if (!validateForm()) {
      console.log('Validación del formulario falló');
      return;
    }

    if (!hasChanges) {
      Alert.alert('Sin Cambios', 'No se han realizado modificaciones');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Guardando cambios para usuario ID:', userId);
      
      // Preparar datos para actualizar
      const updateData = {
        name: formData.name.trim(),
        universityDegree: formData.universityDegree.trim(),
        graduationYear: formData.graduationYear.trim(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Datos a actualizar:', updateData);

      // Actualizar en Firebase
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, updateData);

      console.log('Usuario actualizado exitosamente');

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
      Alert.alert('Error del Sistema', 'No se pudieron guardar los cambios: ' + error.message);
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
          title="EDITAR USUARIO"
          subtitle="Modificación de Datos del Sistema"
          statusText="MODO EDICIÓN ACTIVO"
          statusColor="#3b82f6"
          titleColor="#3b82f6"
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
              editable={false}
              helpText="El correo electrónico no puede ser modificado por seguridad"
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

            <InfoPanel 
              title="INFORMACIÓN DE CUENTA"
              titleColor="#3b82f6"
              dotColor="#3b82f6"
            >
              <InfoPanel.Row 
                label="Creado:" 
                value={formatDate(originalData.createdAt || userData?.createdAt)} 
              />
              {originalData.updatedAt && (
                <InfoPanel.Row 
                  label="Última actualización:" 
                  value={formatDate(originalData.updatedAt)} 
                />
              )}
              <InfoPanel.Text>• El correo electrónico no puede ser modificado por seguridad</InfoPanel.Text>
              <InfoPanel.Text>• Los cambios se aplicarán inmediatamente al guardar</InfoPanel.Text>
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
                title="GUARDAR CAMBIOS"
                variant="secondary"
                onPress={handleSaveChanges}
                disabled={isLoading || !hasChanges}
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
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});