import React from "react";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import LocationMiniMap from "../components/LocationMiniMap";
import { useNavigation } from '@react-navigation/native';

export default function ViewProduct({ route, navigation }) {
    const { product } = route.params;

    const handleBooking = () => {
        navigation.navigate('CheckAvailability', { product: product })
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>{product.address}</Text>
            <ImageBackground source={{ uri: product.images[0] }} style={styles.image}>
                <View style={styles.overlay}>
                    <Text style={styles.price}>{product.price}</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </View>
            </ImageBackground>
            <LocationMiniMap coordinates={{ latitude: product.latitude, longitude: product.longitude }} />
            <TouchableOpacity
                style={styles.button}
                onPress={handleBooking}
            >
                <Text style={styles.buttonText}>Check availability & book now!</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 350,
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 0,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginVertical: 10,
    },
    price: {
        fontSize: 20,
        color: '#f9a620',
        textAlign: 'center',
    },
    description: {
        fontSize: 18,
        color: '#f9a620',
    },
    button: {
        marginVertical: 10,
        padding: 10,
        borderRadius: 5,
        width: 350,
        backgroundColor: '#a8d5e2'
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
