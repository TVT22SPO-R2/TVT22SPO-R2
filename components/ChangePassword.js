import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { auth, updatePassword } from '../firebase/Config'; // Ensure this path is correct

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      await updatePassword(auth.currentUser, newPassword);
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={[styles.button, {backgroundColor: '#a8d5e2'}]} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Submit New Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  button: {
    width: '90%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center', // Center the text inside the button
  },
  buttonText: {
    color: 'black', // Ensure the text inside the button is easily readable
  },
});