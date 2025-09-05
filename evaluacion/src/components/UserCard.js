import React from 'react';
import { View, Text, TouchableOpacity, Animated, Alert, StyleSheet } from 'react-native';

const UserCard = ({ 
  user, 
  onEdit, 
  onDelete, 
  fadeAnim, 
  pulseAnim,
  cardColor = 'rgba(168, 85, 247, 0.2)',
  ringColor = 'rgba(168, 85, 247, 0.3)',
  statusColor = '#10b981'
}) => {
  
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
              backgroundColor: cardColor,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={[styles.avatarInner, { backgroundColor: cardColor }]}>
            <Text style={styles.avatarText}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={[styles.avatarRing, { borderColor: ringColor }]} />
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
                  backgroundColor: statusColor,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>ACTIVO</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarInner: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
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
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default UserCard;

//Esto es un cambio