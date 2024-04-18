import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ChangePassword from '../components/ChangePassword';
import { useUser } from '../components/UserContext'; // Käytetään UserContext koukkua
import { useNavigation, CommonActions } from '@react-navigation/native';
import { auth, firestore, addDoc, collection, query, where, getDocs, deleteDoc } from '../firebase/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";


const STORAGE_KEY = '@user_notes';

export default function Settings() {
  const { user, setUser } = useUser(); // Hanki käyttäjän tila ja setUser funktio
  const navigation = useNavigation(); // Käytä navigointia kirjautumissivulle siirtymiseen

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null); // Update context to reflect that the user has logged out

      // Reset the navigation stack and navigate to the login screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const deleteUserNotes = async (userId) => {
    try {
      const notesRef = collection(firestore, "user_notes", userId, "notes");
      const querySnapshot = await getDocs(notesRef);
      const deletionPromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletionPromises);
    } catch (error) {
      console.error("Error deleting user notes:", error);
      throw new Error("Failed to delete user's notes.");
    }
  };

  const deleteUserAccount = () => {
    const user = auth.currentUser;
    if (user) {
      Alert.alert(
        "Delete Account", // Title
        "Are you sure you want to delete your account? This action cannot be undone.", // Message
        [
          // Array of buttons
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              try {
                // Delete user spots
                const spotsRef = collection(firestore, 'Spots');
                const spotsQuery = query(spotsRef, where('userId', '==', user.uid));
                const spotsSnapshot = await getDocs(spotsQuery);
                const spotsDeletionPromises = spotsSnapshot.docs.map(doc => deleteDoc(doc.ref));
                await Promise.all(spotsDeletionPromises);

                //
                // Tähän voi jatkaa muiden käyttäjän tietojen poistamista
                // ...

              } catch (error) {
                console.error("Error deleting user spots:", error);
                Alert.alert("Error", "Failed to delete user's spots.");
              }

              try {
                await deleteUserNotes(user.uid); // Ensure notes are deleted first
                await user.delete(); // Delete the user account

                // Clear local storage
                await AsyncStorage.removeItem(`${STORAGE_KEY}_${user.uid}`);

                // Notify user of deletion
                Alert.alert("Account deleted", "Your account and all associated data have been deleted.");

                // Set user context to null or handle it as logged out
                setUser(null);

                // Navigate to the login (or auth) screen
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });

              } catch (error) {
                console.error("Error deleting user account:", error);
                Alert.alert("Error", "Failed to delete account.");
              }
            },
            style: "destructive",
          },
        ],
        { cancelable: false } // This prevents the alert from being dismissed by tapping outside of the alert dialog.
      );
    }
  };
  return (
    <View style={styles.container}>
      <ChangePassword />
      <View style={styles.contentContainer}>
        {user ? (
          <>
            <Text style={styles.userInfoText}>Signed in as: {user ? user.email : 'Guest'}!</Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#a8d5e2' }]} onPress={() => navigation.navigate('Notes')}>
              <Text style={styles.buttonText}>Go to Notes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#ffd449' }]} onPress={handleSignOut}>
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#ffd449' }]} onPress={deleteUserAccount}>
              <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.userInfoText}>Please log in to modify your page</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  contentContainer: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fffff0',
    maxWidth: 400,
    width: '90%',
    borderWidth: 1,
    borderColor: '#ffd449',
    marginTop: 20,
  },
  button: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    marginTop: 10,
    borderColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
  },
  userInfoText: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

});