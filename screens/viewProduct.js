import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import LocationMiniMap from "../components/LocationMiniMap";


export default function ViewProduct({ route }) {

    const { product } = route.params;

    return (

        <View style={styles.container}>
            {/* <Image source={{ uri: product.image }} style={styles.image} />*/}

            <Text style={styles.title}>{product.address}</Text>
            <Text style={styles.price}>{product.price}</Text>
            <Text style={styles.description}>{product.description}</Text>
            <LocationMiniMap coordinates={{ latitude: product.latitude, longitude: product.longitude }} />
        </View>

    );
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: 300,
    },
    title: {
        fontSize: 24,
        marginVertical: 10,
    },
    price: {
        fontSize: 20,
        color: '#888',
    },
    description: {
        fontSize: 18,
        marginVertical: 10,
    },
});