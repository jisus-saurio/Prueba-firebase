import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const AuthFormWrapper = ({
  children,
  fadeAnim,
  slideAnim,
  backgroundColor = 'rgba(255, 255, 255, 0.02)',
  borderColor = 'rgba(255, 255, 255, 0.1)',
  padding = 30
}) => {
  return (
    <Animated.View
      style={[
        styles.formContainer,
        {
          backgroundColor,
          borderColor,
          padding,
          opacity: fadeAnim,
          transform: slideAnim ? [{ translateY: slideAnim }] : [],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const AuthDivider = ({ 
  dotColor = 'rgba(255, 255, 255, 0.3)',
  lineColor = 'rgba(255, 255, 255, 0.1)'
}) => (
  <View style={styles.dividerContainer}>
    <View style={[styles.dividerLine, { backgroundColor: lineColor }]} />
    <View style={[styles.dividerDot, { backgroundColor: dotColor }]} />
    <View style={[styles.dividerLine, { backgroundColor: lineColor }]} />
  </View>
);

const DecorativeLines = ({ 
  lineColor = 'rgba(0, 212, 255, 0.5)',
  dotColor = '#00d4ff'
}) => (
  <View style={styles.decorativeLines}>
    <View style={[styles.line, { backgroundColor: lineColor }]} />
    <View style={[styles.centerDot, { backgroundColor: dotColor }]} />
    <View style={[styles.line, { backgroundColor: lineColor }]} />
  </View>
);

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Separador
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Líneas decorativas
  decorativeLines: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  line: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(0, 212, 255, 0.5)',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00d4ff',
  },
});

// Exportar componente principal y subcomponentes
AuthFormWrapper.Divider = AuthDivider;
AuthFormWrapper.DecorativeLines = DecorativeLines;

export default AuthFormWrapper;