import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import { firestore, collection, getDocs } from '../firebase/Config';
import { useNavigation } from '@react-navigation/native';


const ItemContainer = ({ items, navigation }) => {
    const [spotsForSale, setSpotsForSale] = useState([]);

    useEffect(() => {
        const fetchSpotsForSale = async () => {
            try {
                const spotsCollection = collection(firestore, 'Spots');
                const querySnapshot = await getDocs(spotsCollection);
                const fetchedSpots = [];

                querySnapshot.forEach((doc) => {
                    const { address, price, description, images, location, firstName, lastName } = doc.data();
                    const id = doc.id;
                    const latitude = location.lat;
                    const longitude = location.lng;
                    fetchedSpots.push({ latitude, longitude, id, address, price, description, firstName, lastName, images });
                });
                setSpotsForSale(fetchedSpots);

            } catch (error) {
                console.error('Error fetching spots for sale:', error);
            }
        }
        fetchSpotsForSale();
    }, []);

    const containerPressed = (item) => {
        navigation.navigate('ViewProduct', { product: item });
    }

    const renderItem = ({ item }) => (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => containerPressed(item)}>
                <Text style={styles.title}>{item.address}</Text>
                {item.images && item.images.length > 0 ? (
                    <ImageBackground source={{ uri: item.images[0] }} style={styles.image}>
                    </ImageBackground>
                ) : (
                    <View style={styles.placeholderImage} />
                )}
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <FlatList
            data={spotsForSale}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal={true}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fffff0',
        margin: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffd449',
        height: 'auto',
        maxWidth: 142,
    },
    title: {
        fontSize: 16,
        width: 120,
        marginBottom: 5,
    },
    price: {
        marginTop: 5,
        fontSize: 14,
        color: '#888',
    },
    description: {
        fontSize: 14,
        maxWidth: 120,
        overflow: 'hidden',
    },
    image: {
        width: 120,
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
    },
});

export default ItemContainer;