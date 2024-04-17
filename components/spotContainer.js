import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
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
            <Text style={styles.price}>{item.price}</Text>
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
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        flex: 0.3,
    },
    title: {
        fontSize: 16,
        marginVertical: 10,
    },
    price: {
        fontSize: 14,
        color: '#888',
    },
    description: {
        fontSize: 16,
        marginVertical: 10,
    },
});

export default ItemContainer;