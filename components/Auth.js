// auth.js
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase/Config';
import { useUser } from './UserContext'; // Adjust the path as necessary
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import shared5 from '../assets/shared5.jpg';



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
    <ImageBackground source={shared5} style={{ width: '100%', height: '100%', position: 'absolute' }} >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  contentContainer: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fffff0',
    width: '80%',
    maxWidth: 400,
    borderColor: '#ffd449',
    borderWidth: 1,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ffd449',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  buttonStyle: {
    minWidth: 200,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});