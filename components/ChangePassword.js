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
      <View style={styles.contentContainer}>
        <TextInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: '#a8d5e2' }]} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Submit New Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentContainer: {
    borderRadius: 10,
    width: '90%',
    backgroundColor: '#fffff0',
    maxWidth: 400,
    paddingLeft: 80,
    paddingRight: 80,
    paddingTop: 20,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: '#ffd449',
  },
  input: {
    width: '100',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ffd449',
    borderRadius: 10,
    backgroundColor: 'white',
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
});