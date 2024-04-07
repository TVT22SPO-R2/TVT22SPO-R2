import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function ShoppingCart() {
    const navigation = useNavigation();
    
    // Example of shopping cart data
    const shoppingCartData = {
        items: [
            { id: 1, name: 'Product A', price: 10.00, quantity: 2 },
            { id: 2, name: 'Product B', price: 15.00, quantity: 1 },
        ]
    };

    // Function to calculate total amount
    const calculateTotalAmount = () => {
        return shoppingCartData.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    // Total amount to be passed to OrderForm
    const totalAmount = calculateTotalAmount();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Shopping Cart</Text>
            <Button
                title="Continue to order"
                onPress={() => navigation.navigate("OrderForm", { totalAmount })}
            />
        </View>
    );
}