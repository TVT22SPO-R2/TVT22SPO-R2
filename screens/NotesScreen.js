import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useUser } from '../components/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { firestore, addDoc, collection } from '../firebase/Config';

const STORAGE_KEY = '@user_notes';

const NotesScreen = () => {
  const { user } = useUser(); // Use the user from context
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  const fetchNotesFromLocalStorage = async () => {
    if (user) { // Make sure to check if user is not null
      const userSpecificStorageKey = `${STORAGE_KEY}_${user.uid}`;
      try {
        const jsonValue = await AsyncStorage.getItem(userSpecificStorageKey);
        jsonValue != null ? setNotes(JSON.parse(jsonValue)) : null;
      } catch (ex) {
        Alert.alert('Error', 'Failed to fetch notes.');
      }
    }
  };

  const saveToFirebase = async () => {
    if (!note.trim()) {
      Alert.alert('Invalid Input', 'Note cannot be empty.');
      return;
    }
  
    // Check if the user object is available and has a uid property
    if (user && user.uid) {
      // Include the userId when creating a new note item
      const newItem = {
        text: note, // Use the 'note' value directly
        createdAt: new Date().toISOString(), // Optional, for timestamping your note
        userId: user.uid, // Include the user's UID
      };
  
      try {
        const itemsRef = collection(firestore, "user_notes");
        await addDoc(itemsRef, newItem);
        Alert.alert('Success', 'Note saved to Firebase.');
        setNote('');
      } catch (ex) {
        console.error("Error saving note to Firebase:", ex);
        Alert.alert('Error', 'Failed to save note to Firebase.');
      }
    } else {
      // Handle the case where the user information is not available
      Alert.alert('Error', 'Unable to save note to Firebase because user information is not available.');
    }
  };


  const storeData = async (newItems) => {
    if(user) { // Check for user existence
      const userSpecificStorageKey = `${STORAGE_KEY}_${user.uid}`;
      try {
        const jsonValue = JSON.stringify(newItems);
        await AsyncStorage.setItem(userSpecificStorageKey, jsonValue);
      } catch (ex) {
        Alert.alert('Error', 'Failed to save items.');
      }
    }
  };

  const saveNote = async () => {
    if (!note.trim()) {
      Alert.alert('Error', 'Note cannot be empty.');
      return;
    }

    const newNote = { id: Date.now().toString(), text: note, createdAt: new Date().toISOString() };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    storeData(updatedNotes);
    setNote('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write a note..."
        value={note}
        onChangeText={setNote}
      />
     
        <Button title="add note firebase" onPress={saveToFirebase} />
      <Button title="Save Note" onPress={saveNote} />
      <Button title="Fetch Notes" onPress={fetchNotesFromLocalStorage} />
      <ScrollView style={styles.notesContainer}>
        {notes.map((note) => (
          <Text key={note.id} style={styles.note}>{note.text}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  notesContainer: {
    marginTop: 20,
  },
  note: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
});

export default NotesScreen;