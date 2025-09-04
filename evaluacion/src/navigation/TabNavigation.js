import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AddUserScreen from '../screens/AddUserScreen';
import ListScreen from '../screens/ListScreen'; // Asumiendo que crearás esta pantalla
import FuturisticTabBar from '../components/Nav/FuturisticTabBar';

const Tab = createBottomTabNavigator();

/**
 * Navegador de tabs principal con diseño futurista
 * 
 * Pantallas incluidas:
 * - Home: Pantalla principal del sistema
 * - AddUser: Agregar nuevos usuarios
 * - List: Lista de usuarios y gestión
 * 
 * Utiliza un tab bar personalizado con animaciones y efectos
 * visuales que coinciden con el diseño futurista de la app.
 */
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      // Configuración específica para bottom tabs
      tabBarHideOnKeyboard: true,
      tabBarStyle: { display: 'none' }, // Ocultamos el tab bar default porque usamos uno custom
    }}
    // Tab bar personalizado con diseño futurista
    tabBar={props => <FuturisticTabBar {...props} />}
  >
    {/* Pantalla principal */}
    <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ 
        title: 'Sistema',
        tabBarLabel: 'INICIO',
      }} 
    />

    {/* Pantalla de agregar usuario */}
    <Tab.Screen 
      name="AddUser" 
      component={AddUserScreen} 
      options={{ 
        title: 'Agregar Usuario',
        tabBarLabel: 'AGREGAR',
      }} 
    />
    
    {/* Pantalla de lista de usuarios */}
    <Tab.Screen 
      name="List" 
      component={ListScreen} 
      options={{ 
        title: 'Lista de Usuarios',
        tabBarLabel: 'LISTA',
      }} 
    />
  </Tab.Navigator>
);

export default TabNavigator;