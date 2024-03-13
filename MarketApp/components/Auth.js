import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Text } from 'react-native';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase/Config';



export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);
      onLoginSuccess(userCredential.user);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user);
      onLoginSuccess(userCredential.user); // Call the prop function when login is successful
    } catch (error) {
      console.error(error);
      setError(error.message); // Set error message to display
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <View style={styles.button}>
      <Button title="Login" onPress={handleLogin} />
      </View>
      <View style={styles.button}>
      <Button title="Sign Up" onPress={handleSignUp} />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end', // Adjust to position buttons at the bottom
      alignItems: 'center',
      marginBottom: '30%', // Add some bottom margin
      paddingHorizontal: 20, // Add some horizontal padding
    },
    input: {
      width: '100%', // Make input take the full width of the container
      marginVertical: 10, // Add some vertical margin for each input
      padding: 15, // Add some padding inside the input
      borderWidth: 1, // Add a border to the input
      borderColor: 'gray', // Set the border color
      borderRadius: 5, // Round the corners of the input fields
    },
    button: {
      minWidth: 200, // Ensure buttons have a minimum width
      marginVertical: 10, // Add vertical margin between buttons
    },
    errorText: {
      color: 'red',
      marginBottom: 10, // Add some bottom margin to the error text
    },

  });