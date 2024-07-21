import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Linking, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MyCalendar = () => {
    const [asteroids, setAsteroids] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    const fetchAsteroids = async () => {
        try {
            const startDate = selectedDate;
            const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${startDate}&api_key=${Config.NASA_API_KEY}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const objects = data['near_earth_objects'][selectedDate];
            if (objects) {
                const newAsteroids = objects.map(object => {
                    const estimatedDiameter = object['estimated_diameter']?.['meters'];
                    if (estimatedDiameter === undefined || estimatedDiameter['estimated_diameter_min'] === null) {
                        return null;
                    }

                    const asteroidId = object['id'];
                    const asteroidName = object['name']?.replace(/\(.*\)/, '') || 'Unknown';
                    const asteroidMaxDiameter = estimatedDiameter['estimated_diameter_max'] || 'N/A';
                    const velocity = object['close_approach_data']?.[0]?.['relative_velocity']?.['kilometers_per_hour'] || 'N/A';
                    const link = object['nasa_jpl_url'] || '#';

                    return { id: asteroidId, name: asteroidName, asteroidMaxDiameter, velocity, link };
                }).filter(item => item !== null);

                setAsteroids(newAsteroids);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenLink = (url) => {
        Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
    };

    useEffect(() => {
        if (selectedDate) {
            fetchAsteroids();
        }
    }, [selectedDate]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                    <Text style={{ fontSize: 26, margin: 8, fontWeight: 'bold', textAlign: 'center' }}>Asteroids Landing</Text>
                    <TouchableOpacity style={{ backgroundColor: '#0066ff', padding: 10, borderRadius: 20, margin: 10 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Click on any date to get more information!</Text>
                    </TouchableOpacity>
                </View>

                <Calendar
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    markedDates={{
                        [selectedDate]: { selected: true, selectedColor: 'red' }
                    }}
                />
                <View>
                    {asteroids.map((asteroid) => (
                        <View key={asteroid.id} style={{ display: 'flex', flexDirection: 'column', margin: 10, padding: 10, backgroundColor: '#e6f0ff', borderRadius: 10 }}>
                            <View style={{ backgroundColor: '#0047b3', padding: 3, borderRadius: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="keyboard-arrow-right" size={24} color="white" style={{ marginLeft: 10 }} />
                                <Text style={{ fontSize: 15, margin: 7, fontWeight: 'bold', color: 'white' }}>ID: {asteroid.id}</Text>
                            </View>
                            <Text style={{ fontSize: 13, margin: 5 }}>Name: {asteroid.name}</Text>
                            <Text style={{ fontSize: 13, margin: 5 }}>Max Diameter: {asteroid.asteroidMaxDiameter} meters</Text>
                            <Text style={{ fontSize: 13, margin: 5 }}>Velocity: {asteroid.velocity} km/h</Text>
                            <TouchableOpacity
                                style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' }}
                                onPress={() => handleOpenLink(asteroid.link)}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Open Details</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <Image source={require('../assets/calendar.png')} style={{ width: 400, height: 400, alignSelf: 'center' }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MyCalendar;
