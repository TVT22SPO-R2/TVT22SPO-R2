import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import ChangePassword from '../components/ChangePassword'; 
import { useUser } from '../components/UserContext'; // Käytetään UserContext koukkua
import { useNavigation } from '@react-navigation/native'; 
import { auth, firestore, addDoc, collection, query, where, getDocs, deleteDoc } from '../firebase/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import { NotesScreen } from "./NotesScreen";


const STORAGE_KEY = '@user_notes';

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

    const deleteUserNotes = async (userId) => {
        const notesRef = collection(firestore, "user_notes");
        // Make sure the field name inside where() matches the field name in the documents
        const q = query(notesRef, where("userId", "==", userId));
        
        try {
          const querySnapshot = await getDocs(q);
          console.log(`Found ${querySnapshot.docs.length} notes for user ${userId}.`); // For debugging
      
          if (querySnapshot.docs.length === 0) {
            console.log("No notes to delete."); // For debugging
            return;
          }
      
          const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
          await Promise.all(deletePromises);
          console.log("All user notes have been successfully deleted.");
        } catch (error) {
          console.error("Error deleting user notes: ", error);
        }
      };
      
    const deleteUserAccount = async () => {
        const user = auth.currentUser;
        if (user) {
          try {
            await deleteUserNotes(user.uid); // Ensure notes are deleted first
            await user.delete(); // Delete the user account
            Alert.alert("Account deleted", "Your account and all associated data have been deleted.");
            // Handle post-account deletion (e.g., navigate to a login screen)
          } catch (error) {
            console.error("Error deleting user account:", error);
            Alert.alert("Error", "Failed to delete account.");
          }
        }
      };

    return (
        <View style={styles.container}>
            {user ? (
                <>
                    <Text>Signed in as: {user ? user.email : 'Guest'}!</Text>
                    <ChangePassword />
                    <Button title="Sign Out" onPress={handleSignOut} color="red" />
                    <Button
                    title="Go to Notes"
                    onPress={() => navigation.navigate('Notes')}
                    />
                    <Button title="Delete Account" onPress={deleteUserAccount} />
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