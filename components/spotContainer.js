import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { firestore, collection, getDocs } from '../firebase/Config';

/**/

const ItemContainer = ({ items }) => {
    const [spotsForSale, setSpotsForSale] = useState([]);

    useEffect(() => {
        const fetchSpotsForSale = async () => {
            try {
                const spotsCollection = collection(firestore, 'Spots');
                const querySnapshot = await getDocs(spotsCollection);
                const fetchedSpots = [];

                querySnapshot.forEach((doc) => {
                    const { address, price, description, images } = doc.data();
                    const id = doc.id;
                    fetchedSpots.push({ id, address, price, description, images });
                });
                setSpotsForSale(fetchedSpots);
            } catch (error) {
                console.error('Error fetching spots for sale:', error);
            }
        }
        fetchSpotsForSale();
    }, []);

    const renderItem = ({ item }) => (

        <View style={styles.container}>
            <Text style={styles.title}>{item.address}</Text>
            <ImageBackground source={{ uri: item.images[0] }} style={styles.image}>
                <Text style={styles.price}>{item.price}</Text>
            </ImageBackground>
            <Text style={styles.description}>{item.description}</Text>
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
        backgroundColor: '#a8d5e2',
        margin: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffd449',
        height: 'auto',
    },
    title: {
        fontSize: 16,
        width: 120,
        marginBottom: 5,
    },
    price: {
        fontSize: 14,
        color: '#888',
    },
    description: {
        fontSize: 14,
    },
    image: {
        width: 120,
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
    },
});

export default ItemContainer;