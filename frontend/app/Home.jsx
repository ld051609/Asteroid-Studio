import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const Home = () => {
  const navigation = useNavigation();

  return (
    <ScrollView>

    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#f5f5f5', margin: 14}}>
      <Text style={{fontSize: 28, fontWeight:'bold', marginBottom: 10, color:'#333'}}>Welcome to Asteroid Studio</Text>
      <Text style={{fontSize:14, color:'#666', marginBottom:30, textAlign:'center', marginHorizontal:30}}>Your one-stop app for asteroid tracking and audio features.</Text>
      <Image source={require('../assets/home3.png')} style={{width: 400, height: 360, marginBottom:20}} />
      <TouchableOpacity 
        style={{backgroundColor:'#1a8cff', padding: 15, paddingHorizontal: 30, borderRadius: 30}}
        onPress={() => navigation.navigate('AsteroidPredictor')}
      >
        <Text style={{fontSize:18, color:'white', fontWeight:'bold'}}>Go to Asteroid Predictor</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{backgroundColor:'#1a8cff', padding: 15, paddingHorizontal: 30, borderRadius: 30, marginTop: 20}}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Text style={{fontSize:18, fontWeight:'bold', color:'white'}}>Go to Asteroid Landings</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </ScrollView>
  )
}

export default Home