import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import AddUserScreen from './src/screens/AddUserScreen';

const Stack = createNativeStackNavigator();

export default function App() {
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
          // Usuario autenticado
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{ 
                headerShown: true, 
                title: 'Editar Perfil',
                headerStyle: {
                  backgroundColor: '#f8fafc',
                },
                headerTintColor: '#1e293b',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="AddUser" 
              component={AddUserScreen}
              options={{ 
                headerShown: true, 
                title: 'Agregar Usuario',
                headerStyle: {
                  backgroundColor: '#f1f5f9',
                },
                headerTintColor: '#1e293b',
                headerTitleStyle: {
                  fontWeight: 'bold',
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
                  backgroundColor: '#f8fafc',
                },
                headerTintColor: '#1e293b',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}