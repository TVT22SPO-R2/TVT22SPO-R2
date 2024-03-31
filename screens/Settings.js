import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import ChangePassword from '../components/ChangePassword'; 
import { useUser } from '../components/UserContext'; // Käytetään UserContext koukkua
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { auth } from "../firebase/Config"; // Varmista, että polku firebase-konfiguraatioon on oikein

export default function Settings() {
    const { user, setUser } = useUser(); // Hanki käyttäjän tila ja setUser funktio
    const navigation = useNavigation(); // Käytä navigointia kirjautumissivulle siirtymiseen

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            setUser(null); // Päivitä konteksti heijastamaan, että käyttäjä on kirjautunut ulos
            navigation.navigate("Login"); // Valinnaisesti navigoi kirjautumisnäyttöön
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    return (
        <View style={styles.container}>
            {user ? (
                <>
                    <Text>Welcome back!</Text>
                    <ChangePassword />
                    <Button title="Sign Out" onPress={handleSignOut} color="red" />
                </>
            ) : (
                <Text>Please log in, to modify your page</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8', // Set a background color
    },
    Button: {
        width: '90%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        alignItems: 'center', // Center the text inside the button
    },
    // Voit lisätä lisää tyylejä tarpeen mukaan
});