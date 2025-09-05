import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useFocusEffect } from '@react-navigation/native';

// Importar componentes
import BackgroundEffectsCustom from '../components/BackgroundEffectsCustom';
import FuturisticHeader from '../components/FuturisticHeader';
import UserCard from '../components/UserCard';
import EmptyState from '../components/EmptyState';
import StatsPanel from '../components/StatsPanel';
import LoadingScreen from '../components/LoadingScreen';
import FuturisticButton from '../components/FuturisticButton';

// Componente para botón de actualizar
const RefreshButton = ({ onPress, refreshing, fadeAnim, slideAnim, rotateAnim }) => {
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.refreshButtonContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={onPress}
        disabled={refreshing}
        activeOpacity={0.8}
      >
        <View style={styles.refreshContent}>
          <Animated.View
            style={[
              styles.refreshIcon,
              refreshing && {
                transform: [{ rotate: spin }],
              },
            ]}
          />
          <Text style={styles.refreshText}>
            {refreshing ? 'ACTUALIZANDO...' : 'ACTUALIZAR LISTA'}
          </Text>
          <View style={styles.refreshGlow} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ListScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

    // Animación de pulso continua
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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

    // Animación de rotación continua
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    loadUsers();
  }, []);

  // Hook para recargar cuando la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const loadUsers = async () => {
    try {
      console.log('Cargando usuarios...');
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('Usuarios encontrados:', usersList.length);
      
      // Filtrar para no mostrar el usuario actual
      const filteredUsers = usersList.filter(user => user.id !== auth.currentUser?.uid);
      console.log('Usuarios filtrados:', filteredUsers.length);
      
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUsers();
  }, []);

  const handleEditUser = (user) => {
    navigation.navigate('EditUser', { userId: user.id, userData: user });
  };

  const handleDeleteUser = async (userId, userName) => {
    try {
      console.log('Eliminando usuario:', userId);
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      Alert.alert('Operación Exitosa', `El usuario ${userName} ha sido eliminado del sistema`);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      Alert.alert('Error del Sistema', 'No se pudo eliminar el usuario');
    }
  };

  // Preparar estadísticas
  const statsData = [
    {
      number: String(users.length).padStart(2, '0'),
      label: 'USUARIOS ACTIVOS',
    },
    {
      number: '∞',
      label: 'CAPACIDAD',
    },
    {
      number: users.length > 0 ? '100%' : '0%',
      label: 'OPERATIVO',
    },
  ];

  if (isLoading) {
    return (
      <LoadingScreen 
        pulseAnim={pulseAnim}
        text="CARGANDO USUARIOS..."
        iconColor="#a855f7"
      />
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundEffectsCustom 
        pulseAnim={pulseAnim} 
        rotateAnim={rotateAnim}
        particleCount={12}
        primaryColor="rgba(168, 85, 247, 0.6)"
        gradientColors={{
          layer1: 'rgba(168, 85, 247, 0.08)',
          layer2: 'rgba(59, 130, 246, 0.06)',
          layer3: 'rgba(16, 185, 129, 0.04)',
        }}
        cornerColor="rgba(168, 85, 247, 0.3)"
      />

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#a855f7"
            colors={["#a855f7"]}
            progressBackgroundColor="rgba(168, 85, 247, 0.1)"
            title="Actualizando usuarios..."
            titleColor="#a855f7"
          />
        }
      >
        <FuturisticHeader 
          fadeAnim={fadeAnim} 
          slideAnim={slideAnim} 
          pulseAnim={pulseAnim}
          title="LISTA DE USUARIOS"
          subtitle="Gestión de Cuentas del Sistema"
          statusText={`${users.length} USUARIO${users.length !== 1 ? 'S' : ''} REGISTRADO${users.length !== 1 ? 'S' : ''}`}
          statusColor="#a855f7"
          titleColor="#a855f7"
        />

        <RefreshButton
          onPress={onRefresh}
          refreshing={refreshing}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          rotateAnim={rotateAnim}
        />

        {/* Lista de usuarios */}
        {users.length === 0 ? (
          <EmptyState
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            rotateAnim={rotateAnim}
            title="NO HAY USUARIOS"
            subtitle="Aún no se han registrado usuarios en el sistema.
Desliza hacia abajo para actualizar la lista."
            iconColor="rgba(168, 85, 247, 0.3)"
          />
        ) : (
          <View style={styles.usersContainer}>
            {users.map((user, index) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                fadeAnim={fadeAnim}
                pulseAnim={pulseAnim}
                cardColor="rgba(168, 85, 247, 0.2)"
                ringColor="rgba(168, 85, 247, 0.3)"
                statusColor="#10b981"
              />
            ))}
          </View>
        )}

        <StatsPanel
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          title="ESTADÍSTICAS DEL SISTEMA"
          stats={statsData}
          dotColor="#a855f7"
          titleColor="#a855f7"
        />
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
  
  // Refresh button
  refreshButtonContainer: {
    marginBottom: 20,
  },
  refreshButton: {
    position: 'relative',
  },
  refreshContent: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    position: 'relative',
  },
  refreshIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#a855f7',
    borderRadius: 8,
    marginRight: 8,
  },
  refreshText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#a855f7',
    letterSpacing: 1,
  },
  refreshGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    zIndex: -1,
  },

  // Users container
  usersContainer: {
    gap: 16,
    marginBottom: 20,
  },
});