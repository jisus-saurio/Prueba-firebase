import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Componente para efectos de fondo
const BackgroundEffects = ({ pulseAnim, rotateAnim }) => {
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      <View style={styles.backgroundGradient}>
        <View style={[styles.gradientLayer, styles.gradientLayer1]} />
        <View style={[styles.gradientLayer, styles.gradientLayer2]} />
        <View style={[styles.gradientLayer, styles.gradientLayer3]} />
      </View>

      <View style={styles.particlesContainer}>
        {[...Array(12)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                top: Math.random() * height,
                left: Math.random() * width,
                transform: [{ scale: pulseAnim }, { rotate: spin }],
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.cornerEffects}>
        <View style={[styles.cornerEffect, styles.topLeft]} />
        <View style={[styles.cornerEffect, styles.topRight]} />
        <View style={[styles.cornerEffect, styles.bottomLeft]} />
        <View style={[styles.cornerEffect, styles.bottomRight]} />
      </View>
    </>
  );
};

// Componente para tarjeta de usuario
const UserCard = ({ user, onEdit, onDelete, fadeAnim, pulseAnim }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de que quieres eliminar al usuario ${user.name}?\n\nEsta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(user.id, user.name),
        },
      ]
    );
  };

  return (
    <Animated.View
      style={[
        styles.userCard,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.userCardHeader}>
        <Animated.View
          style={[
            styles.userAvatar,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.avatarRing} />
        </Animated.View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name || 'Sin nombre'}</Text>
          <Text style={styles.userEmail}>{user.email || 'Sin email'}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(user)}
            activeOpacity={0.7}
          >
            <View style={styles.editButtonContent}>
              <View style={styles.editIcon} />
              <View style={styles.editGlow} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <View style={styles.deleteButtonContent}>
              <View style={styles.deleteIcon} />
              <View style={styles.deleteGlow} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.userCardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>TÍTULO:</Text>
          <Text style={styles.infoValue}>
            {user.universityDegree || 'No especificado'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>GRADUACIÓN:</Text>
          <Text style={styles.infoValue}>
            {user.graduationYear || 'No especificado'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>MIEMBRO DESDE:</Text>
          <Text style={styles.infoValue}>{formatDate(user.createdAt)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ESTADO:</Text>
          <View style={styles.statusContainer}>
            <Animated.View
              style={[
                styles.statusDotActive,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
            <Text style={styles.statusText}>ACTIVO</Text>
          </View>
        </View>
      </View>
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

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <BackgroundEffects pulseAnim={pulseAnim} rotateAnim={rotateAnim} />

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
        {/* Header */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.titleSection}>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              <View style={styles.logoCircle}>
                <View style={styles.logoInner}>
                  <View style={styles.logoIcon} />
                </View>
                <View style={styles.logoRing} />
              </View>
            </Animated.View>
            
            <Text style={styles.titleText}>LISTA DE USUARIOS</Text>
            <Text style={styles.subtitleText}>Gestión de Cuentas del Sistema</Text>
            <View style={styles.statusIndicator}>
              <Animated.View
                style={[
                  styles.statusDot,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
              <Text style={styles.statusTextHeader}>
                {users.length} USUARIO{users.length !== 1 ? 'S' : ''} REGISTRADO{users.length !== 1 ? 'S' : ''}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Botón de actualizar manual */}
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
            onPress={onRefresh}
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

        {/* Lista de usuarios */}
        {isLoading ? (
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.loadingContent,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.loadingIcon,
                  {
                    transform: [{ rotate: spin }],
                  },
                ]}
              />
              <Text style={styles.loadingText}>CARGANDO USUARIOS...</Text>
            </Animated.View>
          </Animated.View>
        ) : users.length === 0 ? (
          <Animated.View
            style={[
              styles.emptyContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.emptyContent}>
              <Animated.View
                style={[
                  styles.emptyIcon,
                  {
                    transform: [{ rotate: spin }],
                  },
                ]}
              >
                <View style={styles.emptyIconInner} />
              </Animated.View>
              <Text style={styles.emptyTitle}>NO HAY USUARIOS</Text>
              <Text style={styles.emptySubtitle}>
                Aún no se han registrado usuarios en el sistema.{'\n'}
                Desliza hacia abajo para actualizar la lista.
              </Text>
            </View>
          </Animated.View>
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
              />
            ))}
          </View>
        )}

        {/* Panel de estadísticas */}
        <Animated.View
          style={[
            styles.statsPanel,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.statsPanelHeader}>
            <View style={styles.statsDot} />
            <Text style={styles.statsPanelTitle}>ESTADÍSTICAS DEL SISTEMA</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {String(users.length).padStart(2, '0')}
              </Text>
              <Text style={styles.statLabel}>USUARIOS ACTIVOS</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>∞</Text>
              <Text style={styles.statLabel}>CAPACIDAD</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {users.length > 0 ? '100%' : '0%'}
              </Text>
              <Text style={styles.statLabel}>OPERATIVO</Text>
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
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
  },
  gradientLayer2: {
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
    transform: [{ rotate: '30deg' }],
  },
  gradientLayer3: {
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
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
    backgroundColor: 'rgba(168, 85, 247, 0.6)',
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
    borderColor: 'rgba(168, 85, 247, 0.3)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  titleSection: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoInner: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#a855f7',
    borderRadius: 8,
  },
  logoRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    borderStyle: 'dashed',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 4,
    textShadowColor: 'rgba(168, 85, 247, 0.5)',
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
    backgroundColor: '#a855f7',
  },
  statusTextHeader: {
    fontSize: 10,
    color: '#a855f7',
    fontWeight: '600',
    letterSpacing: 1,
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

  // Loading
  loadingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#a855f7',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '700',
    letterSpacing: 2,
  },

  // Empty state
  emptyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIconInner: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
    borderRadius: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Users container
  usersContainer: {
    gap: 16,
    marginBottom: 20,
  },

  // User card
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarInner: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(168, 85, 247, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },
  avatarRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    borderStyle: 'dashed',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },

  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    position: 'relative',
  },
  editIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#10b981',
    borderRadius: 7,
  },
  editGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    zIndex: -1,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220, 53, 69, 0.4)',
    position: 'relative',
  },
  deleteIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#dc3545',
    borderRadius: 7,
  },
  deleteGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    zIndex: -1,
  },

  userCardBody: {
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    flex: 1,
  },
  infoValue: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    flex: 2,
    textAlign: 'right',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDotActive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Stats panel
  statsPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#a855f7',
    marginRight: 8,
  },
  statsPanelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#a855f7',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#a855f7',
    letterSpacing: 2,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
  },
});