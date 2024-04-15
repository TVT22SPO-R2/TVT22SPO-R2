import React from 'react';
import { Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const AddToCartButton = ({ item, onPress }) => {
    const navigation = useNavigation();

    const handleAddToCart = () => {
        Alert.alert(
            'Add to Shopping Cart',
            `Do you want to move ${item.firstName} ${item.lastName} to the shopping cart?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        // Navigate to ShoppingCart screen with the spot information
                        onPress(item);
                        navigation.setParams({selectedSpots: [item] });
                        console.log("nappi lähetää", item)
                        
                    }
                }
            ]
        );
    };

    return (
        <Button title="Move to Shopping Cart" onPress={handleAddToCart} />
    );
};

export default AddToCartButton;