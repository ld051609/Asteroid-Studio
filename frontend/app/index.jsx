import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import MyCalendar from './Calendar';
import AsteroidPredictor from './AsteroidPredictor';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or FontAwesome, Ionicons, etc.

const Tab = createBottomTabNavigator();

const Index = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Calendar" 
        component={MyCalendar}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-today" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="AsteroidPredictor" 
        component={AsteroidPredictor}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="star" color={color} size={size} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

export default Index;
