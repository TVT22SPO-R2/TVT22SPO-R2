import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/Config";
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar } from "react-native-calendars";

export default function CheckAvailability() {
    const [availability, setAvailability] = useState([]);
    const [fetchData, setFetchData] = useState(false); // State to trigger data fetch
    const [selectedDates, setSelectedDates] = useState({}); // State to store selected dates
    const navigation = useNavigation();
    const route = useRoute();
    const { product } = route.params;

    console.log('Product:', product);



    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                console.log('Fetching availability...');
                const spotDocRef = doc(firestore, 'Spots', product.id); // Reference to the document
                const availabilityCollectionRef = collection(spotDocRef, 'availability'); // Reference to the availability collection within the document
                const querySnapshot = await getDocs(availabilityCollectionRef);

                // Log the path to ensure it's correct
                console.log('Availability collection reference:', availabilityCollectionRef.path);

                if (!querySnapshot.empty) {
                    const fetchedAvailability = querySnapshot.docs.map(doc => ({
                        availabilityId: doc.id,
                        ...doc.data()
                    }));

                    // Update state with fetched data
                    setAvailability(fetchedAvailability);
                    console.log('Fetched availability:', fetchedAvailability);
                } else {
                    console.log('No documents found in the availability collection.');
                }
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };

        if (fetchData) {
            fetchAvailability();
            setFetchData(false); // Reset the state after fetching data
        }
    }, [fetchData]); // useEffect will re-run whenever fetchData state changes


    const clearSelectedDates = () => {
        setSelectedDates({});
    }

    const clearFetchedDates = () => {
        setAvailability([]);
    }

    const handleDayPress = (date) => {
        setSelectedDates(prevDates => {
            const updatedDates = { ...prevDates, [date.dateString]: true };
            console.log('Selected dates:', updatedDates);
            return updatedDates;
        });
    };

    const handleSaveDates = () => {
        const selectedDatesArray = Object.keys(selectedDates);
        const updatedProduct = { ...product, selectedDates: selectedDatesArray };
        // Navigate to the next screen with the updated product prop
        navigation.navigate('Cart', { updatedProduct });
        console.log('Selected dates:', selectedDatesArray);
        console.log('Updated product:', updatedProduct);
        console.log('Product:', product)
        console.log('Navigating to Cart screen...');
    };

    const handleFetchAvailability = () => {
        clearSelectedDates();
        clearFetchedDates();
        setFetchData(true);
    };

    return (
        <View style={styles.container}>
            <Text> Check availability </Text>
            <TouchableOpacity onPress={handleFetchAvailability}>
                <Text> Fetch availability of {product.address} </Text>
            </TouchableOpacity>
            <Text>Rented on:</Text>
            <Calendar
                markedDates={availability.reduce((acc, item) => {
                    acc[item.date] = { selected: true, marked: true };
                    return acc;
                }, {})}
                onDayPress={handleDayPress}
            />
            <TouchableOpacity onPress={handleSaveDates}>
                <Text>Save Dates</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});