import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { DashboardScreen } from '@/screens/Dashboard';
import { AppListScreen } from '@/screens/AppList';
import { SettingsScreen } from '@/screens/Settings';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DashboardHome"
      component={DashboardScreen}
      options={{ headerTitle: 'App Usage Tracker' }}
    />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AppList"
      component={AppListScreen}
      options={{ headerTitle: 'All Apps' }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SettingsHome"
      component={SettingsScreen}
      options={{ headerTitle: 'Settings' }}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'help-outline';

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Apps') {
              iconName = focused ? 'apps' : 'apps-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardStack} />
        <Tab.Screen name="Apps" component={AppStack} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};