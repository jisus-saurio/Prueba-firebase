import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const FuturisticButton = ({
  onPress,
  title,
  variant = 'primary', // 'primary', 'secondary', 'danger'
  disabled = false,
  loading = false,
  flex = 1,
  activeOpacity = 0.8,
  icon = null,
  style = {}
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          glowColor: 'rgba(16, 185, 129, 0.3)',
          textColor: '#000000',
          borderColor: 'rgba(16, 185, 129, 0.3)',
        };
      case 'secondary':
        return {
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          glowColor: 'rgba(59, 130, 246, 0.3)',
          textColor: '#000000',
          borderColor: 'rgba(59, 130, 246, 0.3)',
        };
      case 'danger':
        return {
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          glowColor: 'rgba(220, 53, 69, 0.1)',
          textColor: '#dc3545',
          borderColor: 'rgba(220, 53, 69, 0.3)',
        };
      case 'outline':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          glowColor: 'rgba(255, 255, 255, 0.1)',
          textColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
        };
      default:
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          glowColor: 'rgba(16, 185, 129, 0.3)',
          textColor: '#000000',
          borderColor: 'rgba(16, 185, 129, 0.3)',
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <TouchableOpacity 
      style={[styles.button, { flex }, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
    >
      <View style={[
        styles.buttonContent,
        { 
          backgroundColor: buttonStyles.backgroundColor,
          borderColor: buttonStyles.borderColor 
        }
      ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.buttonText, { color: buttonStyles.textColor }]}>
          {loading ? 'PROCESANDO...' : title}
        </Text>
        <View style={[
          styles.buttonGlow, 
          { backgroundColor: buttonStyles.glowColor }
        ]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'relative',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  buttonGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    zIndex: -1,
  },
  iconContainer: {
    marginRight: 8,
  },
});

export default FuturisticButton;