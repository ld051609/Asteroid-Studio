import { View, Text } from 'react-native'
import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Home from './Home'
import MyCalendar from './Calendar'
import AsteroidPredictor from './AsteroidPredictor'
const Tab = createBottomTabNavigator();
const index = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Home" component={Home} /> 
      <Tab.Screen name="Calendar" component={MyCalendar} /> 
      <Tab.Screen name="AsteroidPredictor" component={AsteroidPredictor} />
    </Tab.Navigator>
  )
}

export default index