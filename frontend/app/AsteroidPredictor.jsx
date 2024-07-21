import { View, Text, TextInput, TouchableOpacity, Linking , Alert, Image} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Config from 'react-native-config';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AsteroidPredictor = () => {
  const [input, setInput] = useState('');
  const [features, setFeatures] = useState([]);
  const [publicURL, setPublicURL] = useState('');
  const [showPlayButton, setShowPlayButton] = useState(false); // Track button visibility

  const fetchAsteroidId = async () => {
    try {
      const response = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/${input}?api_key=${Config.NASA_API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const closeApproachData = data['close_approach_data'];
      if (closeApproachData) {
        const newFeatures = closeApproachData.map(data => ({
          date: data['close_approach_date'],
          velocity: data['relative_velocity']['kilometers_per_second']
        }));
        setFeatures(newFeatures);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAudio = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ features })
      });
      if (!response.ok) {
        Alert.alert(`Audio ID not found`);
      }
      const data = await response.json();
      setPublicURL(data['public_url']);
      setShowPlayButton(true); // Show the button after fetching the URL
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (features.length > 0) {
      fetchAudio();
    }
  }, [features]);

  const playAudio = async () => {
    if (publicURL) {
      try {
        await Linking.openURL(publicURL);
        setShowPlayButton(false); // Hide the button after clicking
      } catch (err) {
        console.error("Couldn't load page", err);
      }
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>Asteroid Predictor</Text>
      <Image source={require('../assets/asteroid.png')} style={{ width: 400, height: 360, margin: 50 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%' }}>
        <TextInput 
          placeholder="Enter Asteroid ID" 
          value={input}
          onChangeText={setInput}
          style={{ flex: 1, height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#fff' }}
        />
        <TouchableOpacity onPress={fetchAsteroidId}>
          <Icon name="search" size={30} color="#0066ff" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
      {showPlayButton && 
        <TouchableOpacity style={{ marginTop: 20, backgroundColor:'#1a8cff', padding:16, borderRadius:30 }} 
          onPress={playAudio}>
          <Text style={{ fontSize: 18, color: 'white' }}>Play the Audio</Text>
        </TouchableOpacity>
      }
    </View>
  );
};

export default AsteroidPredictor;
