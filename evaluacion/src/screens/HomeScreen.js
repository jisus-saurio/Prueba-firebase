// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        setUserData({
          name: auth.currentUser.displayName || 'Usuario',
          email: auth.currentUser.email,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (isLoading) {
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
          <Text style={styles.loadingText}>CARGANDO SISTEMA...</Text>
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
        {[...Array(12)].map((_, i) => (
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

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#00d4ff"
            colors={["#00d4ff"]}
          />
        }
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
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>SISTEMA ACTIVO</Text>
            <Text style={styles.userName}>{userData?.name || 'USUARIO'}</Text>
            <View style={styles.statusIndicator}>
              <Animated.View
                style={[
                  styles.statusDot,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
              <Text style={styles.statusText}>CONECTADO</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.logoutContent}>
              <Text style={styles.logoutText}>SALIR</Text>
              <View style={styles.logoutGlow} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Avatar y datos del usuario */}
        <Animated.View
          style={[
            styles.userCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.avatarContainer,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <View style={styles.avatarCircle}>
              <View style={styles.avatarInner}>
                <View style={styles.avatarIcon} />
              </View>
              <View style={styles.avatarRing} />
              <View style={styles.avatarRing2} />
            </View>
          </Animated.View>
          
          <View style={styles.userInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>NOMBRE:</Text>
              <Text style={styles.infoValue}>{userData?.name || 'No disponible'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>EMAIL:</Text>
              <Text style={styles.infoValue}>{userData?.email || 'No disponible'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>TÍTULO:</Text>
              <Text style={styles.infoValue}>
                {userData?.universityDegree || 'No disponible'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>GRADUACIÓN:</Text>
              <Text style={styles.infoValue}>
                {userData?.graduationYear ? userData.graduationYear : 'No disponible'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>MIEMBRO DESDE:</Text>
              <Text style={styles.infoValue}>{formatDate(userData?.createdAt)}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Botones de acción */}
        <Animated.View
          style={[
            styles.actionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.8}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionIcon} />
              <Text style={styles.actionText}>EDITAR PERFIL</Text>
              <View style={styles.actionGlow} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButtonSecondary}
            onPress={onRefresh}
            activeOpacity={0.8}
          >
            <View style={styles.actionContent}>
              <Animated.View
                style={[
                  styles.actionIconSecondary,
                  {
                    transform: [{ rotate: spin }],
                  },
                ]}
              />
              <Text style={styles.actionTextSecondary}>ACTUALIZAR</Text>
              <View style={styles.actionGlowSecondary} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        

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
              <Text style={styles.statNumber}>01</Text>
              <Text style={styles.statLabel}>CUENTA ACTIVA</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {userData?.createdAt ? 
                  String(Math.floor((new Date() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24))).padStart(2, '0')
                  : '00'}
              </Text>
              <Text style={styles.statLabel}>DÍAS ACTIVO</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>∞</Text>
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
    backgroundColor: 'rgba(0, 212, 255, 0.6)',
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
    borderColor: 'rgba(0, 212, 255, 0.3)',
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

  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 70,
  },

  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 212, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
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
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '600',
    letterSpacing: 1,
  },
  logoutButton: {
    position: 'relative',
  },
  logoutContent: {
    backgroundColor: 'rgba(220, 53, 69, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    position: 'relative',
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 1,
    fontSize: 12,
  },
  logoutGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 10,
    backgroundColor: 'rgba(220, 53, 69, 0.3)',
    zIndex: -1,
  },

  // User card
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#00d4ff',
    borderRadius: 10,
  },
  avatarRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    borderStyle: 'dashed',
  },
  avatarRing2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  userInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    flex: 2,
    textAlign: 'right',
    fontWeight: '500',
  },

  // Action buttons
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    position: 'relative',
  },
  actionButtonSecondary: {
    flex: 1,
    position: 'relative',
  },
  actionContent: {
    backgroundColor: 'rgba(0, 212, 255, 0.8)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  actionIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#000000',
    borderRadius: 10,
    marginBottom: 8,
  },
  actionIconSecondary: {
    width: 20,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 8,
  },
  actionText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actionTextSecondary: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actionGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    zIndex: -1,
  },
  actionGlowSecondary: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: -1,
  },

  // Management section
  managementSection: {
    marginBottom: 20,
  },
  managementHeader: {
    marginBottom: 16,
  },
  managementTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  managementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00d4ff',
    marginRight: 8,
  },
  managementTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    textAlign: 'center',
  },
  managementGrid: {
    gap: 12,
  },
  managementCard: {
    position: 'relative',
  },
  managementCardContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  managementIcon: {
    width: 30,
    height: 30,
    backgroundColor: '#00d4ff',
    borderRadius: 15,
    marginRight: 12,
  },
  managementIconSecondary: {
    width: 30,
    height: 30,
    backgroundColor: '#10b981',
    borderRadius: 15,
    marginRight: 12,
  },
  managementIconTertiary: {
    width: 30,
    height: 30,
    backgroundColor: '#a855f7',
    borderRadius: 15,
    marginRight: 12,
  },
  managementCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
    flex: 1,
  },
  managementCardSubtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute',
    bottom: 8,
    left: 58,
  },
  managementCardGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    zIndex: -1,
  },
  managementCardGlowSecondary: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 13,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    zIndex: -1,
  },
  managementCardGlowTertiary: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 13,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    zIndex: -1,
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
    backgroundColor: '#00d4ff',
    marginRight: 8,
  },
  statsPanelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00d4ff',
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
    color: '#00d4ff',
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