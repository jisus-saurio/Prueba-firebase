import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const EmptyState = ({
  fadeAnim,
  slideAnim,
  rotateAnim,
  title = "NO HAY ELEMENTOS",
  subtitle = "Aún no hay contenido disponible.\nDesliza hacia abajo para actualizar.",
  iconColor = 'rgba(168, 85, 247, 0.3)',
  backgroundColor = 'rgba(255, 255, 255, 0.02)',
  borderColor = 'rgba(255, 255, 255, 0.1)'
}) => {
  const spin = rotateAnim ? rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  }) : '0deg';

  return (
    <Animated.View
      style={[
        styles.emptyContainer,
        {
          backgroundColor,
          borderColor,
          opacity: fadeAnim,
          transform: slideAnim ? [{ translateY: slideAnim }] : [],
        },
      ]}
    >
      <View style={styles.emptyContent}>
        <Animated.View
          style={[
            styles.emptyIcon,
            rotateAnim && {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <View style={[styles.emptyIconInner, { backgroundColor: iconColor }]} />
        </Animated.View>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtitle}>{subtitle}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
});

export default EmptyState;