import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { firestore, collection, addDoc, updateDoc } from '../firebase/Config';
import { storage } from '../firebase/Config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase/Config';


const MapApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;


export default function AddSpot() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [showInputs, setShowInputs] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  
  const getPermissionAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await getPermissionAsync();
    if (!hasPermission) {
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    console.log('Image Picker Result:', result);
  
    // Check if the user canceled the operation or no image selected
    if (result.cancelled || !result.assets) {
      return; // Do nothing if the user canceled or no image selected
    }
  
    // If image selection was successful, update the state
    setImages(prevImages => [...prevImages, result.assets[0].uri]);
  };
  
  
  console.log("images1:",images);
  
  const handleSubmit = async () => {
    const user = auth.currentUser; // Get the current logged-in user
    if (!user) {
      Alert.alert('Not logged in', 'You must be logged in to submit a spot.');
      return;
    }
  
    if (!firstName || !lastName || !price || !description || !location || images.length === 0) {
      Alert.alert('Missing fields', 'Please fill all the fields and add at least one image.');
      return;
    }

    try {
      const spotRef = await addDoc(collection(firestore, 'Spots'), {
        userId, // Include the userId in the document
        firstName,
        lastName,
        price: price + '€',
        description,
        location,
        createdAt: new Date(),
      });
      
      console.log('Spot added with ID: ', spotRef.id);
  
      const uploadPromises = images.map(async (imageUri, index) => {
        console.log("imageUri:", imageUri);
        try {
          console.log(`Uploading image ${index + 1} of ${images.length}...`);
          const response = await fetch(imageUri);
          console.log("response:", response);
          if (!response.ok) {
            throw new Error('Failed to fetch image from URI');
          }
          const blob = await response.blob();
          const fileName = `image_${index}`;
          const fileRef = storageRef(storage, `spots/${spotRef.id}/${fileName}`);
          await uploadBytes(fileRef, blob);
          const downloadUrl = await getDownloadURL(fileRef);
          console.log(`Image ${index + 1} uploaded successfully`);
          return downloadUrl;
        } catch (error) {
          console.error(`Error uploading image ${index + 1}: `, error);
          throw error;
        }
      });
  
      const imageUrls = await Promise.all(uploadPromises);
      console.log('Images uploaded to Firebase Storage', imageUrls);
  
      // Update Firestore document with image URLs
      await updateDoc(spotRef, { images: imageUrls });
  
      Alert.alert('Spot Submitted', 'Your spot has been submitted successfully.');
      // Reset form state
      setFirstName('');
      setLastName('');
      setPrice('');
      setDescription('');
      setLocation(null);
      setImages([]);
      setShowInputs(false);
      setSearchValue('');
    } catch (error) {
      console.error('Error adding spot or uploading images: ', error);
      Alert.alert('Error', 'There was an error submitting your spot.');
    }
  };
  
  
  const handlePlaceSelect = (data, details = null) => {
    setLocation(details.geometry.location);
    setShowInputs(true);
    setSearchValue(data.description);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Start by typing the address</Text>
      <GooglePlacesAutocomplete
        placeholder="Search"
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
        value={searchValue}
        onChangeText={setSearchValue}
      />
      {showInputs && (
        <View style={styles.View}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={setFirstName}
            value={firstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={setLastName}
            value={lastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Price in €"
            onChangeText={setPrice}
            value={price}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={setDescription}
            value={description}
            multiline
          />
          <Button title="Add Photo" onPress={pickImage} />
          <View style={styles.imageContainer}>
            {images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.thumbnail} /> // Display image as small thumbnail
            ))}
          </View>
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
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 5,
  },
});