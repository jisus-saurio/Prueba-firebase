import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoPanel = ({ 
  title = "INFORMACIÓN", 
  children, 
  dotColor = "#10b981",
  backgroundColor = "rgba(255, 255, 255, 0.02)",
  borderColor = "rgba(255, 255, 255, 0.05)",
  titleColor = "#10b981"
}) => (
  <View style={[styles.infoPanel, { 
    backgroundColor, 
    borderColor 
  }]}>
    <View style={styles.infoPanelHeader}>
      <View style={[styles.infoDot, { backgroundColor: dotColor }]} />
      <Text style={[styles.infoPanelTitle, { color: titleColor }]}>{title}</Text>
    </View>
    {children}
  </View>
);

const InfoText = ({ children }) => (
  <Text style={styles.infoText}>{children}</Text>
);

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  infoPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  infoPanelTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: 1,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
});

// Exportar tanto el componente principal como los subcomponentes
InfoPanel.Text = InfoText;
InfoPanel.Row = InfoRow;

export default InfoPanel;