import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import { useAuthStore } from './src/context/authStore';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import FarmerDashboard from './src/screens/farmer/FarmerDashboard';
import LogTreatmentScreen from './src/screens/farmer/LogTreatmentScreen';
import TreatmentHistoryScreen from './src/screens/farmer/TreatmentHistoryScreen';
import FarmerAlertsScreen from './src/screens/farmer/FarmerAlertsScreen';
import VetDashboard from './src/screens/vet/VetDashboard';
import IssuePrescriptionScreen from './src/screens/vet/IssuePrescriptionScreen';
import AdminDashboard from './src/screens/admin/AdminDashboard';
import Toast from 'react-native-toast-message';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const FarmerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tab.Screen name="DashboardTab" component={FarmerDashboard} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="HistoryTab" component={TreatmentHistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="AlertsTab" component={FarmerAlertsScreen} options={{ title: 'Alerts' }} />
    </Tab.Navigator>
  );
};

const VetNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tab.Screen name="DashboardTab" component={VetDashboard} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="PrescribeTab" component={IssuePrescriptionScreen} options={{ title: 'Prescribe' }} />
    </Tab.Navigator>
  );
};

export default function App() {
  const { user, hydrate } = useAuthStore();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      Toast.show({
        type: 'info',
        text1: notification.request.content.title,
        text2: notification.request.content.body,
        duration: 3000,
      });
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      // Handle notification response
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user.role === 'farmer' ? (
          <>
            <Stack.Screen name="FarmerHome" component={FarmerNavigator} />
            <Stack.Screen name="LogTreatment" component={LogTreatmentScreen} options={{ title: 'Log Treatment' }} />
          </>
        ) : user.role === 'vet' ? (
          <Stack.Screen name="VetHome" component={VetNavigator} />
        ) : (
          <Stack.Screen name="AdminHome" component={AdminDashboard} />
        )}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
