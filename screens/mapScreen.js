import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getLocationAsync } from '../components/locationServices';
import { MaterialIcons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { firestore, collection, getDocs } from '../firebase/Config';

const MapApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const MapScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [lastSelectedLocation, setLastSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const coordinates = await getLocationAsync();
        setUserLocation(coordinates);
        if (!currentRegion) {
          setCurrentRegion({
            ...coordinates,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setLastSelectedLocation(coordinates);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchUserLocation();
  }, [currentRegion]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsCollection = collection(firestore, 'Spots');
        const querySnapshot = await getDocs(locationsCollection);
        const fetchedLocations = [];

        for (const doc of querySnapshot.docs) {
          const { price, description, location } = doc.data();
          const latitude = location.lat;
          const longitude = location.lng;

          const address = await fetchAddressFromCoords(latitude, longitude);
          fetchedLocations.push({ latitude, longitude, price, description, address });
        }

        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };  

    fetchLocations();
  }, []);

  const fetchAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MapApiKey}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return null;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };
  
  const handleMarkerPress = (marker) => {
    console.log('Marker pressed:', marker);
  };

  const handlePlaceSelected = useCallback(async (data) => {
    console.log('Selected Place Data:', data);
  
    try {
      const placeDetails = await fetchPlaceDetails(data.place_id);
      console.log('Place Details:', placeDetails);
  
      if (placeDetails && placeDetails.geometry && placeDetails.geometry.location) {
        const { lat, lng } = placeDetails.geometry.location;
        setSearchedLocation({ latitude: lat, longitude: lng });
        setCurrentRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        console.warn('Failed to retrieve location details for the selected place:', placeDetails);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  }, []);
  

  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${MapApiKey}`);
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  const handleGPSButtonPress = () => {
    if (userLocation) {
      setCurrentRegion({
        ...userLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const toggleSearchVisibility = () => {
    setSearchVisible(!searchVisible);
  };

  const handleCancelSearch = () => {
    setSearchedLocation(null);
    searchRef.current?.setAddressText('');
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={{ position: 'absolute', top: 5, right: 20, zIndex: 2 }} onPress={toggleSearchVisibility}>
        <MaterialIcons name="search" size={24} color="#000" />
      </TouchableOpacity>
      {searchVisible && (
        <GooglePlacesAutocomplete
          placeholder='Search'
          onPress={(data) => handlePlaceSelected(data)}
          onFail={(error) => console.error('GooglePlacesAutocomplete Error:', error)}
          query={{
            key: MapApiKey,
            language: 'en',
          }}
          styles={{
            container: {
              position: 'absolute',
              top: 0,
              width: '100%',
              zIndex: 1,
            },
            textInputContainer: {
              backgroundColor: 'rgba(0,0,0,0)',
              borderTopWidth: 0,
              borderBottomWidth: 0,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
            },
            textInput: {
              flex: 1,
              marginLeft: 10,
              marginRight: 0,
              height: 38,
              color: '#5d5d5d',
              fontSize: 16,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
        />
      )}
      <MapView
        style={{ flex: 1 }}
        region={currentRegion}
      >
      {locations.map((location, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title={location.address || 'Unknown Address'}
          description={`${location.price}, ${location.description}`}
          pinColor="green"
          onPress={() => handleMarkerPress(location)}
        />
      ))}
        {searchedLocation && (
          <Marker
            coordinate={{
              latitude: searchedLocation.latitude,
              longitude: searchedLocation.longitude,
            }}
            title="Searched Location"
            description="Location searched by user"
            pinColor="blue"
          />
        )}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            description="You are here"
            pinColor="red"
          />
        )}
      </MapView>
      <TouchableOpacity style={{ position: 'absolute', left: 20, bottom: 20 }} onPress={handleGPSButtonPress}>
        <MaterialIcons name="gps-fixed" size={32} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default MapScreen;
