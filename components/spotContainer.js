import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

/**/

const ItemContainer = ({ items }) => {

    const spotsForSale = [
        { id: '1', address: '1234 Main St', price: '$100,000', description: 'This is a great spot!' },
        { id: '2', address: '5678 Elm St', price: '$200,000', description: 'This is a great spot!' },
        { id: '3', address: '91011 Oak St', price: '$300,000', description: 'This is a great spot!' },
        { id: '4', address: '121314 Pine St', price: '$400,000', description: 'This is a great spot!' },
        { id: '5', address: '151617 Maple St', price: '$500,000', description: 'This is a great spot!' },
        { id: '6', address: '181920 Cedar St', price: '$600,000', description: 'This is a great spot!' },
        { id: '7', address: '212223 Birch St', price: '$700,000', description: 'This is a great spot!' },
        { id: '8', address: '242526 Spruce St', price: '$800,000', description: 'This is a great spot!' },
        { id: '9', address: '272829 Fir St', price: '$900,000', description: 'This is a great spot!' },
        { id: '10', address: '303132 Pine St', price: '$1,000,000', description: 'This is a great spot!' },
    ];
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









