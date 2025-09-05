import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const FuturisticInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  focused, 
  onFocus, 
  onBlur, 
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  multiline = false,
  editable = true,
  helpText = null
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[
      styles.inputContainer,
      focused && styles.inputContainerFocused,
      !editable && styles.inputContainerDisabled
    ]}>
      <TextInput
        style={[
          styles.input, 
          multiline && styles.inputMultiline,
          !editable && styles.inputDisabled
        ]}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.4)"
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
        editable={editable}
      />
      {focused && editable && <View style={styles.inputGlow} />}
      {!editable && <View style={styles.disabledOverlay} />}
    </View>
    {helpText && <Text style={styles.helpText}>{helpText}</Text>}
  </View>
);

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  inputContainerFocused: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  inputContainerDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  inputGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 13,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    zIndex: -1,
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  helpText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 5,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
});

export default FuturisticInput;