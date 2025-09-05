import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const StatsPanel = ({
  fadeAnim,
  slideAnim,
  title = "ESTADÍSTICAS DEL SISTEMA",
  stats = [],
  dotColor = "#a855f7",
  titleColor = "#a855f7",
  backgroundColor = 'rgba(255, 255, 255, 0.02)',
  borderColor = 'rgba(255, 255, 255, 0.1)'
}) => {
  return (
    <Animated.View
      style={[
        styles.statsPanel,
        {
          backgroundColor,
          borderColor,
          opacity: fadeAnim,
          transform: slideAnim ? [{ translateY: slideAnim }] : [],
        },
      ]}
    >
      <View style={styles.statsPanelHeader}>
        <View style={[styles.statsDot, { backgroundColor: dotColor }]} />
        <Text style={[styles.statsPanelTitle, { color: titleColor }]}>{title}</Text>
      </View>
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            number={stat.number}
            label={stat.label}
            color={stat.color || titleColor}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const StatItem = ({ number, label, color = "#a855f7" }) => (
  <View style={styles.statItem}>
    <Text style={[styles.statNumber, { color }]}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
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

export default StatsPanel;