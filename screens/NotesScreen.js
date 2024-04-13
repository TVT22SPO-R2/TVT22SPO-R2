import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useUser } from '../components/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { firestore, addDoc, collection, query, where, getDocs, deleteDoc, doc } from '../firebase/Config';

const STORAGE_KEY = '@user_notes';

const NotesScreen = () => {
  const { user } = useUser(); // Use the user from context
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  const saveToFirebase = async () => {
    if (!note.trim()) {
      Alert.alert('Invalid Input', 'Note cannot be empty.');
      return;
    }
  
    if (user && user.uid) {
      const newItem = {
        text: note,
        createdAt: new Date().toISOString(),
        userId: user.uid,
        source: 'firebase' // Set source as 'firebase'
      };
  
      try {
        const docRef = await addDoc(collection(firestore, "user_notes"), newItem);
        newItem.id = docRef.id; // Setting the document ID after successful creation
        setNotes(prevNotes => [...prevNotes, newItem]); // Add the new note to the state
        setNote('');
        Alert.alert('Success', 'Note saved to Firebase.');
      } catch (ex) {
        console.error("Error saving note to Firebase:", ex);
        Alert.alert('Error', 'Failed to save note to Firebase.');
      }
    } else {
      Alert.alert('Error', 'Unable to save note to Firebase because user information is not available.');
    }
  };

  const fetchNotesFromFirestore = async () => {
    const notesArray = [];
    if (user && user.uid) {
      const querySnapshot = await getDocs(collection(firestore, "user_notes"));
      querySnapshot.forEach((doc) => {
        const note = doc.data();
        note.id = doc.id;
        note.source = 'firebase'; // Set source as 'firebase'
        notesArray.push(note);
      });
      setNotes(notesArray);
    }
  };

  const deleteNoteFromFirebase = async (noteId) => {
    if (user && user.uid) {
      try {
        await deleteDoc(doc(firestore, "user_notes", noteId));
        Alert.alert('Success', 'Note deleted from Firebase.');
      } catch (error) {
        console.error("Error deleting note from Firebase:", error);
        Alert.alert('Error', 'Failed to delete note from Firebase.');
      }
    }
  };

  const fetchNotesFromLocalStorage = async () => {
    if (user) {
      const localNotes = await AsyncStorage.getItem(`${STORAGE_KEY}_${user.uid}`);
      const parsedNotes = JSON.parse(localNotes) || [];
      parsedNotes.forEach(note => note.source = 'local'); // Set source as 'local'
      setNotes(parsedNotes);
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
  
    const newNote = {
      id: Date.now().toString(),
      text: note,
      createdAt: new Date().toISOString(),
      source: 'local' // Set source as 'local'
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes); // Immediately add to state with the correct source
    await storeData(updatedNotes); // Save updated notes list to local storage
    setNote('');
  };

  const deleteNoteLocally = async (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
  
    if (user) {
      try {
        await AsyncStorage.setItem(`${STORAGE_KEY}_${user.uid}`, JSON.stringify(updatedNotes));
        Alert.alert('Success', 'Note deleted locally.');
      } catch (error) {
        console.error("Error deleting note locally:", error);
        Alert.alert('Error', 'Failed to delete note locally.');
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write a note..."
        value={note}
        onChangeText={setNote}
      />
      <Text style={styles.title}>Save Notes to Database</Text>
      <Button title="Add note..." onPress={saveToFirebase} />
      <Button title="Fetch Notes..." onPress={fetchNotesFromFirestore} />
      <Text style={styles.title}>Save Notes Locally</Text>
      <Button title="Add note..." onPress={saveNote} />
      <Button title="Fetch Notes..." onPress={fetchNotesFromLocalStorage} />
      
      <ScrollView style={styles.notesContainer}>
      {notes.map((note) => (
  <View key={note.id} style={styles.noteContainer}>
    <Text style={styles.noteText}>{note.text}</Text>
    <View style={styles.buttonsContainer}>
      {note.source === 'firebase' && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNoteFromFirebase(note.id)}>
          <Text style={styles.deleteButtonText}>x</Text>
        </TouchableOpacity>
      )}
      {note.source === 'local' && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNoteLocally(note.id)}>
          <Text style={styles.deleteButtonText}>x</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
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
  title: {
    marginTop: 20,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  notesContainer: {
    marginTop: 20,
  },
  note: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default NotesScreen;