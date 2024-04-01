import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { firestore, collection, addDoc } from '../firebase/Config';

const MapApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY; 

export default function AddSpot() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState(null);
    const [images, setImages] = useState([]);
    const [showInputs, setShowInputs] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });
    
        if (!result.cancelled) {
            // Filter out undefined and cancelled images
            const filteredImages = result.uris.filter(uri => uri);
            setImages([...images, ...filteredImages]);
        }
    };
    
    const handleSubmit = async () => {
        try {
            const formattedPrice = price + '€';

            const spotData = {
                firstName,
                lastName,
                price: formattedPrice,
                description,
                location,
                createdAt: new Date(),
            };
            console.log('Spot data:', spotData);
            await addDoc(collection(firestore, 'Spots'), spotData);
            console.log('Spot added successfully!');

            
            setFirstName('');
            setLastName('');
            setPrice('');
            setDescription('');
            setLocation(null);
            setImages([]);
            setShowInputs(false);

            Alert.alert(
                'Spot Submitted',
                'Your spot has been submitted successfully.',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
            );
        } catch (error) {
            console.error('Error adding spot: ', error);
        }
    };

    const handlePlaceSelect = (data, details = null) => {
        setLocation(details.geometry.location);
        setShowInputs(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Start by typing the address</Text>
            <GooglePlacesAutocomplete
                placeholder='Search'
                fetchDetails
                onPress={handlePlaceSelect}
                query={{
                    key: MapApiKey,
                    language: 'en',
                }}
                styles={{
                    textInputContainer: {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        marginVertical: 10,
                    },
                    textInput: {
                        height: 48,
                        color: '#5d5d5d',
                        fontSize: 16,
                    },
                }}
            />
            {showInputs && (
                <View style={styles.View}>
                    <TextInput style={styles.input} placeholder="First Name" onChangeText={setFirstName} value={firstName} />
                    <TextInput style={styles.input} placeholder="Last Name" onChangeText={setLastName} value={lastName} />
                    <TextInput style={styles.input} placeholder="Price in €" onChangeText={setPrice} value={price} keyboardType="numeric" />
                    <TextInput style={styles.input} placeholder="Description" onChangeText={setDescription} value={description} multiline />
                    <Button title="Add Photo" onPress={pickImage} />
                    {images.map((image, index) => (
                        <Text key={index}>{image}</Text>
                    ))}
                    <Button title="Submit Spot" onPress={handleSubmit} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    View: {
        flex: 1,
        marginBottom: 250,
    },
    text: {
        fontSize: 15,
    },
});
