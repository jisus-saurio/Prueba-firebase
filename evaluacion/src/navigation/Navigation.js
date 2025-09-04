import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabNavigator from './TabNavigation';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Timer para el splash screen (3 segundos)
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    // Listener para el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Solo ocultar el loading después de que termine el splash
      if (!showSplash) {
        setIsLoading(false);
      }
    });

    // Limpiar el loading cuando termine el splash
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(loadingTimer);
      unsubscribe();
    };
  }, [showSplash]);

  // Mostrar splash screen durante los primeros 3 segundos
  if (showSplash || isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Usuario autenticado - Usar TabNavigator
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{ 
                headerShown: true, 
                title: 'Editar Perfil',
                headerStyle: {
                  backgroundColor: '#0a0a0a',
                },
                headerTintColor: '#00d4ff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  color: '#ffffff',
                },
              }}
            />
          </>
        ) : (
          // Usuario no autenticado
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ 
                headerShown: true, 
                title: 'Crear Cuenta',
                headerStyle: {
                  backgroundColor: '#0a0a0a',
                },
                headerTintColor: '#00d4ff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  color: '#ffffff',
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}