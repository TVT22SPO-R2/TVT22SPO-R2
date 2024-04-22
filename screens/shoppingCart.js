import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, ImageBackground, Alert } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import shared5 from '../assets/shared5.jpg';

export default function ShoppingCart({navigation, route }) {
    //const navigation = useNavigation();
    //const route = useRoute();
    const [updatedProduct, setUpdatedProduct] = useState(null);
    const [shouldRenderList, setShouldRenderList] = useState(false);
    console.log("Route params", route.params);


    useFocusEffect(
        React.useCallback(() => {
            if (route.params && route.params.updatedProduct) {
                setUpdatedProduct(route.params.updatedProduct);
                setShouldRenderList(true);
            } else {
                setUpdatedProduct(null);
                setShouldRenderList(false);
            }
        }, [route.params])
    );
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

    //const totalAmount = calculateTotalAmount(selectedSpots);
    const totalAmount = 1.00;

    console.log("Total Amount:", totalAmount);

    const handleContinueToOrder = () => {
        if (updatedProduct) {
            navigation.navigate('OrderForm', { totalAmount });
        } else {
            Alert.alert('No Product Selected', 'Select a product on map or search for a spot in search tab before proceeding to order.');
        }
    };

    return (
        <ImageBackground source={shared5} style={{ width: '100%', height: '100%', position: 'absolute' }} >
            <View style={styles.container}>
                {shouldRenderList && updatedProduct && (
                    <FlatList
                        data={updatedProduct ? [updatedProduct] : []}
                        renderItem={({ item }) => (
                            <View style={styles.spotContainer}>
                                <Text style={styles.spotText}>Address: {item.address}</Text>
                                <Text style={styles.spotText}>Price: {item.price}</Text>
                                <Text style={styles.spotText}>Description: {item.description}</Text>
                                <Text style={styles.spotText}>Name: {item.firstName} {item.lastName}</Text>
                                <Text style={styles.text}>Selected Dates:</Text>
                                {item.selectedDates && item.selectedDates.map((date, index) => (
                                    <Text key={index} style={styles.text}>{date}</Text>
                                ))}
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                )}
                {!shouldRenderList && (
                    <Text>No items in shopping cart</Text>
                )}
                <View style={styles.submitButtonContainer}>
                    <Button
                        title="Continue to Order"
                        onPress={handleContinueToOrder}
                        buttonStyle={styles.submitButton}
                    />
                </View>
            </View>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        paddingHorizontal: 25
    },
    spotContainer: {
        borderRadius: 10,
        padding: 20,
        backgroundColor: '#fffff0',
        maxWidth: 400,
        width: '90%',
        borderWidth: 1,
        borderColor: '#ffd449',
        marginTop: 20,
    },
    spotText: {
        fontSize: 16,
        marginBottom: 5,
    },
    submitButtonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1
    },
    submitButton: {
        backgroundColor: '#FFA500',
        width: 200,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});