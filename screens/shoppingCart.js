import React, { useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ShoppingCart() {
    const navigation = useNavigation();
    const route = useRoute();
    const  selectedSpots  = route.params?.selectedSpots; // Use optional chaining to avoid errors if route.params is undefined
    console.log("routeparamssi", route.params)
    console.log("Selected Spots:", selectedSpots); // Log selectedSpots to check if it's undefined or not

    useEffect(() => {
        console.log('Selected Spots:', selectedSpots);
    }, [selectedSpots]);

    const convertPriceToNumber = (priceString) => {
        // Remove euro symbol and convert to number
        const priceNumber = parseFloat(priceString.replace('€', '').trim());
        console.log("Price Number:", priceNumber);
        return priceNumber;
    };

    const calculateTotalAmount = (spots) => {
        // If spots is undefined or not an array, return 0
        if (!spots) return 0;
        
        // If spots is a single spot object, convert it to an array
        if (!Array.isArray(spots)) spots = [spots];
        
        console.log("Spots:", spots); // Log spots to check if it's an array and contains the correct data
        
        // Sum up the prices of all spots
        const totalAmount = spots.reduce((total, spot) => {
            const price = convertPriceToNumber(spot.price);
            console.log("Price:", price); // Log each price to check if it's correctly parsed
            return total + price;
        }, 0);
    
        console.log("Total Amount:", totalAmount); // Log the total amount
        return totalAmount;
    };

    const totalAmount = calculateTotalAmount(selectedSpots);

    console.log("Total Amount:", totalAmount);

    const handleContinueToOrder = () => {
        // Navigate to OrderForm screen with spot information
        navigation.navigate('OrderForm', { totalAmount });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={selectedSpots ? [selectedSpots] : []} // Ensure selectedSpots is an array for consistency with SearchScreen
                renderItem={({ item }) => (
                    <View style={styles.spotContainer}>
                        <Text style={styles.spotText}>Address: {item.address}</Text>
                        <Text style={styles.spotText}>Price: {item.price}</Text>
                        <Text style={styles.spotText}>Description: {item.description}</Text>
                        <Text style={styles.spotText}>Name: {item.firstName} {item.lastName}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <Button
                title="Continue to Order"
                onPress={handleContinueToOrder}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spotContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  },
  spotText: {
    fontSize: 16,
    marginBottom: 5
  },
});
