import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';



export default function ShoppingCart() {
    
    const navigation = useNavigation();
    
    return (
        <View>
            <Text>Shopping Cart</Text>
            <Button title="Continue to order." onPress={() => navigation.navigate("OrderForm")} />
        </View>
    );
}
