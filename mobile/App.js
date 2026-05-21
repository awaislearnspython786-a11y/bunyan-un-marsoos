import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import SplashScreen from './src/screens/SplashScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import LoginScreen from './src/screens/LoginScreen';
import TeacherSignupScreen from './src/screens/TeacherSignupScreen';
import StudentSignupScreen from './src/screens/StudentSignupScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import TeacherDashboardScreen from './src/screens/TeacherDashboardScreen';

import HomeScreen from './src/screens/HomeScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import TeacherProfileScreen from './src/screens/TeacherProfileScreen';
import BookingScreen from './src/screens/BookingScreen';
import ConfirmationScreen from './src/screens/ConfirmationScreen';
import AgentLogsScreen from './src/screens/AgentLogsScreen';
import DisputeScreen from './src/screens/DisputeScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#01411C',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingBottom: 5, paddingTop: 5, height: 60 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dhundho') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Masla') iconName = focused ? 'warning' : 'warning-outline';
          else if (route.name === 'AILogs') iconName = focused ? 'terminal' : 'terminal-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dhundho" component={HomeScreen} options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen name="Masla" component={DisputeScreen} options={{ tabBarLabel: 'Disputes' }} />
      <Tab.Screen name="AILogs" component={AgentLogsScreen} options={{ tabBarLabel: 'AI Logs' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        {/* Initialization */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        
        {/* Auth Flow */}
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="TeacherSignup" component={TeacherSignupScreen} />
        <Stack.Screen name="StudentSignup" component={StudentSignupScreen} />
        
        {/* Role Dashboards */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} />

        {/* Student Flow */}
        <Stack.Screen name="HomeTabs" component={MainTabs} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="TeacherProfile" component={TeacherProfileScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
