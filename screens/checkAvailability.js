import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CheckAvailability() {

    return (
        <View style={styles.container}>
            <Text> Check availability</Text>
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