import React from 'react';
import { Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const AddToCartButton = ({ item, onPress }) => {
    const navigation = useNavigation();

    const handleAddToCart = () => {
        Alert.alert(
            'Add to Shopping Cart',
            `Do you want to move ${item.address} to the shopping cart?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        onPress(item);
                        navigation.setParams({selectedSpots: [item] });
                        console.log("nappi lähetää", item)
                        
                    }
                }
            ]
        );
    };

    return (
        <Button title="View details and book" onPress={handleAddToCart} />
    );
};

export default AddToCartButton;