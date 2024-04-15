import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/Config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import AddToCartButton from '../components/addToCartButton';

const MapApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const SearchScreen = () => {
  const [searchFilters, setSearchFilters] = useState({
    address: '',
    price: '',
    description: '',
    name: ''
  });

  const [searchResults, setSearchResults] = useState([]);
  const [showAlert, setShowAlert] = useState(false); 
  const [selectedSpots, setSelectedSpots] = useState([]);

  const handleSearch = async () => {
    setShowAlert(false);
  
    const { address, price, description, name } = searchFilters;
  
    // Array to store all the filter queries
    const filters = [];
  
    // Reset search results
    setSearchResults([]);
  
    try {
      // Address filter
      if (address && address !== searchFilters.prevAddress) {
        const response = await Location.geocodeAsync(address);
        if (response.length > 0) {
          const { latitude, longitude } = response[0];
  
          const latQuery = query(collection(firestore, 'Spots'), where('location.latitude', '==', latitude));
          const lngQuery = query(collection(firestore, 'Spots'), where('location.longitude', '==', longitude));
  
          const [latSnapshot, lngSnapshot] = await Promise.all([getDocs(latQuery), getDocs(lngQuery)]);
  
          const results = [
            ...latSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
            ...lngSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          ];
  
          filters.push(...results);
  
          setSearchFilters(prevState => ({
            ...prevState,
            prevAddress: address // Remember the address for future comparison
          }));
        } else {
          console.error('No location found for the provided address');
          setShowAlert(true);
        }
      }
  
      // Price filter
      if (price) {
        const priceWithEuroSymbol = parseFloat(price) + '€';
        const priceQuery = query(collection(firestore, 'Spots'), where('price', '==', priceWithEuroSymbol));
        const priceSnapshot = await getDocs(priceQuery);
        filters.push(...priceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
      
      // Description filter
      if (description) {
        const descriptionQuery = query(collection(firestore, 'Spots'), where('description', '==', description));
        const descriptionSnapshot = await getDocs(descriptionQuery);
        filters.push(...descriptionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
  
      // Name filter
      if (name) {
        const firstNameQuery = query(
          collection(firestore, 'Spots'),
          where('firstName', '==', name)
        );
        const lastNameQuery = query(
          collection(firestore, 'Spots'),
          where('lastName', '==', name)
        );
        const [firstNameSnapshot, lastNameSnapshot] = await Promise.all([getDocs(firstNameQuery), getDocs(lastNameQuery)]);
        const combinedResults = [...firstNameSnapshot.docs, ...lastNameSnapshot.docs];
        filters.push(...combinedResults.map(doc => ({ id: doc.id, ...doc.data() })));
      }
  
      // Merge all filter results
      const mergedResults = filters.reduce((acc, cur) => acc.concat(cur), []);
  
      // Perform reverse geocoding for each result
      const addressPromises = mergedResults.map(async result => {
        if (result.location && result.location.latitude) {
          const reverseGeocodeResponse = await Location.reverseGeocodeAsync({ latitude: result.location.latitude, longitude: result.location.longitude });
          const formattedAddress = reverseGeocodeResponse[0].name + ', ' + reverseGeocodeResponse[0].city + ', ' + reverseGeocodeResponse[0].country;
          return { ...result, address: formattedAddress };
        } else {
          return result; // Return the result without reverse geocoding if latitude is undefined
        }
      });
      
      const resultsWithAddresses = await Promise.all(addressPromises);
      setSearchResults(resultsWithAddresses);
      setShowAlert(resultsWithAddresses.length === 0);
    } catch (error) {
      console.error("Error executing query:", error);
      setShowAlert(true);
    }
  };

  const handlePlaceSelect = (data, details = null) => {
    if (details) {
      setSearchFilters(prevState => ({
        ...prevState,
        address: details.formatted_address,
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng
      }));
    }
  };

  const handleAddToCart = (item) => {
    // Add the selected spot to the list
    setSelectedSpots([...selectedSpots, item]);
};

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder='Search by Address'
        fetchDetails
        onPress={handlePlaceSelect}
        query={{
          key: MapApiKey,
          language: 'en',
        }}
        styles={{
          textInputContainer: {
            backgroundColor: '#fff',
            padding: 10,
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
      <TextInput
        style={styles.input}
        placeholder="Price"
        onChangeText={text => setSearchFilters({...searchFilters, price: text})}
        value={searchFilters.price}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        onChangeText={text => setSearchFilters({...searchFilters, description: text})}
        value={searchFilters.description}
      />
      <TextInput
        style={styles.input}
        placeholder="First and/or Last Name"
        onChangeText={text => setSearchFilters({...searchFilters, name: text})}
        value={searchFilters.name}
      />
      <Button title="Search" onPress={handleSearch} />
      {showAlert && (
        <Text style={styles.alertText}>No spots found with the provided filters</Text>
      )}
      <FlatList
    data={searchResults}
    renderItem={({ item }) => {
        return (
            <View style={styles.spotContainer}>
                <Text style={styles.spotText}>Address: {item.address}</Text>
                <Text style={styles.spotText}>Price: {item.price}</Text>
                <Text style={styles.spotText}>Description: {item.description}</Text>
                <Text style={styles.spotText}>Name: {item.firstName} {item.lastName}</Text>
                <AddToCartButton item={item} onPress={handleAddToCart} /> 
            </View>
        );
    }}
    keyExtractor={(item, index) => item.id + index.toString()}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10
  },
  alertText: {
    color: 'red',
    marginTop: 10
  },
  spotContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  },
  spotText: {
    fontSize: 16,
    marginBottom: 5
  },
});

export default SearchScreen;