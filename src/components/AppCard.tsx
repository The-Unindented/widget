import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { AppUsage } from '@/types';

interface AppCardProps {
  app: AppUsage;
  rank?: number;
  onPress?: (app: AppUsage) => void;
  style?: ViewStyle;
}

export const AppCard: React.FC<AppCardProps> = ({ app, rank, onPress, style }) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, style]}
      onPress={() => onPress?.(app)}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.rankContainer}>
        {rank && (
          <Text style={styles.rank}>#{rank}</Text>
        )}
        <View style={styles.iconContainer}>
          {app.icon ? (
            <Image source={{ uri: app.icon }} style={styles.icon} />
          ) : (
            <View style={[styles.icon, styles.iconPlaceholder]}>
              <Text style={styles.iconText}>
                {app.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.details}>
        <Text style={styles.appName} numberOfLines={1}>
          {app.name}
        </Text>
        <Text style={styles.clickCount}>
          {app.clickCount} {app.clickCount === 1 ? 'click' : 'clicks'}
        </Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 12,
    minWidth: 24,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  details: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  clickCount: {
    fontSize: 14,
    color: '#666',
  },
});