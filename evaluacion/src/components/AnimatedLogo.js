import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const AnimatedLogo = ({
  size = 120,
  rotateAnim,
  scaleAnim,
  fadeAnim,
  innerColor = 'rgba(0, 212, 255, 0.2)',
  iconColor = '#00d4ff',
  ring1Color = 'rgba(0, 212, 255, 0.3)',
  ring2Color = 'rgba(16, 185, 129, 0.2)',
  backgroundColor = 'rgba(255, 255, 255, 0.05)',
  showRings = true,
  iconElement = null
}) => {
  const spin = rotateAnim ? rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  }) : '0deg';

  const logoSize = size;
  const innerSize = size * 0.67; // 80/120 ratio
  const iconSize = size * 0.2; // 24/120 ratio
  const ring1Size = logoSize * 1.17; // 140/120 ratio
  const ring2Size = logoSize * 1.33; // 160/120 ratio

  return (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          transform: [
            ...(rotateAnim ? [{ rotate: spin }] : []),
            ...(scaleAnim ? [{ scale: scaleAnim }] : []),
          ],
          opacity: fadeAnim || 1,
        },
      ]}
    >
      <View style={[
        styles.logoCircle, 
        { 
          width: logoSize, 
          height: logoSize, 
          borderRadius: logoSize / 2,
          backgroundColor 
        }
      ]}>
        <View style={[
          styles.logoInner, 
          { 
            width: innerSize, 
            height: innerSize, 
            borderRadius: innerSize / 2,
            backgroundColor: innerColor 
          }
        ]}>
          {iconElement ? iconElement : (
            <View style={[
              styles.logoIcon, 
              { 
                width: iconSize, 
                height: iconSize, 
                borderRadius: iconSize / 2,
                backgroundColor: iconColor 
              }
            ]} />
          )}
        </View>
        
        {showRings && (
          <>
            <View style={[
              styles.logoRing, 
              { 
                width: ring1Size, 
                height: ring1Size, 
                borderRadius: ring1Size / 2,
                borderColor: ring1Color 
              }
            ]} />
            <View style={[
              styles.logoRing2, 
              { 
                width: ring2Size, 
                height: ring2Size, 
                borderRadius: ring2Size / 2,
                borderColor: ring2Color 
              }
            ]} />
          </>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    position: 'relative',
  },
  logoCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    // Icono por defecto
  },
  logoRing: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  logoRing2: {
    position: 'absolute',
    borderWidth: 1,
  },
});

export default AnimatedLogo;