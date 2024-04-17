// auth.js
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase/Config';
import { useUser } from './UserContext'; // Adjust the path as necessary
import { useNavigation } from '@react-navigation/native'; // Import useNavigation



export default function Login() {
  const [email, setEmail] = useState('testi@jkjk.com');
  const [password, setPassword] = useState('testitesti');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const { setUser } = useUser(); // Use the context

  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);
      setUser(userCredential.user); // Update user state using context
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user);
      setUser(userCredential.user); // Update user state using context
      navigation.navigate('ParKing');
    } catch (error) {
      console.error(error);
      setError(error.message);
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
      <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: '#a8d5e2' }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: '#ffd449' }]} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
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
    backgroundColor: '#F8F8F8', // Set a background color
  },
  input: {
    width: '100%', // Make input take the full width of the container
    marginVertical: 10, // Add some vertical margin for each input
    padding: 15, // Add some padding inside the input
    borderWidth: 1, // Add a border to the input
    borderColor: 'gray', // Set the border color
    borderRadius: 5, // Round the corners of the input fields
    backgroundColor: '#F8F8F8',
  },
  buttonStyle: {
    minWidth: 200,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'black', // Button text color
  },
  errorText: {
    color: 'red',
    marginBottom: 10, // Add some bottom margin to the error text
  },

});