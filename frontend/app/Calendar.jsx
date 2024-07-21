import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Linking } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Config from 'react-native-config';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
                    if (object['estimated_diameter']['meters']['estimated_diameter_min'] === null) {
                        return null;
                    }
                    const asteroidId = object['id'];
                    const asteroidName = object['name'].replace(/\(.*\)/, ''); // Remove parentheses
                    const asteroidMaxDiameter = object['estimated_diameter']['meters']['estimated_diameter_max'];
                    const velocity = object['close_approach_data'][0]['relative_velocity']['kilometers_per_hour'];
                    const link = object['nasa_jpl_url'];
                    return { id: asteroidId, name: asteroidName, asteroidMaxDiameter, velocity, link };
                }).filter(item => item !== null);

                setAsteroids(newAsteroids);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            fetchAsteroids();
        }
    }, [selectedDate]);

    const handleSwipeableOpen = (url) => {
        Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
    };

    const renderRightActions = (url) => (
        <TouchableOpacity
            style={{
                backgroundColor: 'blue',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                padding: 10,
                flexDirection: 'row',
            }}
            onPress={() => handleSwipeableOpen(url)}
        >
            <Icon name="info" size={24} color="white" />
            <Text style={{ color: 'white', marginLeft: 5 }}>Open</Text>
        </TouchableOpacity>
    );

    return (
        <GestureHandlerRootView style={{ backgroundColor: 'white', flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
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
                        {asteroids && (asteroids.map((asteroid) => {
                            return (
                                <Swipeable
                                    key={asteroid.id}
                                    renderRightActions={() => renderRightActions(asteroid.link)}
                                >
                                    <View style={{ display: 'flex', flexDirection: 'column', margin: 10, padding: 10, backgroundColor: '#e6f0ff', borderRadius: 10 }}>
                                        <View style={{ backgroundColor: '#0047b3', padding: 3, borderRadius: 20, display: 'flex', flexDirection:'row', alignItems:'center'}}>
                                            <Icon name="keyboard-arrow-right" size={24} color="white" style={{ marginLeft: 10 }} />
                                            <Text style={{ fontSize: 15, margin: 7, fontWeight: 'bold', color: 'white' }}>ID: {asteroid.id}</Text>

                                        </View>
                                        <Text style={{ fontSize: 13, margin: 5 }}>Name: {asteroid.name}</Text>
                                        <Text style={{ fontSize: 13, margin: 5 }}>Max Diameter: {asteroid.asteroidMaxDiameter} meters</Text>
                                        <Text style={{ fontSize: 13, margin: 5 }}>Velocity: {asteroid.velocity} km/h</Text>
                                    </View>
                                </Swipeable>
                            )
                        }))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default MyCalendar;
