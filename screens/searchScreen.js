import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity, ImageBackground,Platform } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/Config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import AddToCartButton from '../components/addToCartButton';
import shared5 from '../assets/shared5.jpg';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();


  const handleSearch = async () => {
    setShowAlert(false);

    const { address, price, description, name} = searchFilters;


    // Array to store all the filter queries
    const filters = [];

    // Reset search results
    setSearchResults([]);

    console.log("Search Filters:", searchFilters);


    try {
      console.log("osote1", address);
      if (address && address !== searchFilters.prevAddress) {
        const response = await Location.geocodeAsync(address);
        console.log("osote", address);
        if (response.length > 0) {
          const { latitude, longitude } = response[0];
      
          const locationQuery = query(collection(firestore, 'Spots'), where('location.lat', '==', latitude), where('location.lng', '==', longitude));
          console.log("locationquery", locationQuery)
      
          const locationSnapshot = await getDocs(locationQuery);
          console.log("snäppi", locationSnapshot);
      
          const results = locationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
          filters.push(...results);
          console.log("tulos", results);
      
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
      console.log("tulos2", resultsWithAddresses)
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
    navigation.navigate('ViewProduct', { product: { ...item, latitude: item.location.lat, longitude: item.location.lng } });
};

  return (
    <ImageBackground source={shared5} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }}>
      <View style={styles.container}>
        <View style={styles.contentContainerTop}>
          <GooglePlacesAutocomplete
          placeholder='Search by Address'
          fetchDetails
          onPress={handlePlaceSelect}
          query={{
            key: MapApiKey,
            language: 'en',
          }}
  styles={{
    container: {
      flex: 0,
      position: 'relative',
      zIndex: 10,
      marginHorizontal: 10, 
      marginBottom: 0,
    },
    textInputContainer: {
      backgroundColor: 'transparent',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      paddingVertical: 20,
      paddingHorizontal: 0,
    },
    textInput: {
      height: 50,
      marginTop: Platform.OS === 'ios' ? 0 : 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#FFD449',
      backgroundColor: 'white',
      borderRadius: 10,
      paddingHorizontal: 10,
      zIndex: 1, 
    },
    listView: {
      backgroundColor: 'white',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#FFD449',
      marginHorizontal: 10,
      zIndex: 9999,
    },
    poweredContainer: {
      display: 'none',
    },
  }}
/>
        </View>
        <View style={styles.contentContainer}>
          <TextInput
            style={styles.input}
            placeholder="Price"
            onChangeText={text => setSearchFilters({ ...searchFilters, price: text })}
            value={searchFilters.price}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={text => setSearchFilters({ ...searchFilters, description: text })}
            value={searchFilters.description}
          />
          <TextInput
            style={styles.input}
            placeholder="First and/or Last Name"
            onChangeText={text => setSearchFilters({ ...searchFilters, name: text })}
            value={searchFilters.name}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: '#a8d5e2' }]} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
          {showAlert && (
            <Text style={styles.alertText}>No spots found with the provided filters</Text>
          )}
        </View>
        {searchResults.length > 0 && (
          <View style={styles.contentContainer}>
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
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    paddingTop: 100
  },
  contentContainerTop: {
    marginBottom: 10,
    backgroundColor: '#FFFFF0',
    paddingBottom: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD449',

  },
  contentContainer: {
    backgroundColor: '#FFFFF0',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD449',
    borderRadius: 10,
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: '#FFD449',
    backgroundColor: 'white',
    borderRadius: 10
  },
  alertText: {
    color: 'red',
    marginTop: 10
  },
  spotContainer: {
    backgroundColor: '#FFFFF0',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD449',
    borderRadius: 10,
  },
  spotText: {
    fontSize: 16,
    marginBottom: 5
  },
  button: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    marginTop: 10,
    borderColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
  },
});

export default SearchScreen;