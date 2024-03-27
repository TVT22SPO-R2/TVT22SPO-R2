import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../components/UserContext'; // Adjust the path as necessary
import { auth } from "../firebase/Config";

const HomeScreen = () => {
  const { setUser } = useUser();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null); // Update the context to reflect that the user has logged out
      navigation.navigate("Login"); // Optionally navigate to the login screen
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Map" onPress={() => navigation.navigate("Map")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;