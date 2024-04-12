import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const LocationMiniMap = ({ coordinates }) => {
    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}>
                <Marker coordinate={coordinates} />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 350,
        height: 150,
        borderRadius: 10,
        borderColor: '#ffd449',
        borderWidth: 1,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
});

export default LocationMiniMap;
