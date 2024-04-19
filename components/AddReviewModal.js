import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, Alert, TextInput, TouchableOpacity } from 'react-native';
import { firestore, collection, addDoc } from '../firebase/Config';
import { Ionicons } from '@expo/vector-icons';

export default function AddReviewModal({ isVisible, onClose, onSubmit, product }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleStarPress = (starNumber) => {
    setRating(starNumber);
  };

  const handleSubmit = async () => {
    try {
      if (!product || !rating || !comment) {
        console.log('Missing values:', { product, rating, comment });
        Alert.alert('Error', 'Please provide both rating and comment.');
        return;
      }

      // Create the review data object
      const reviewData = {
        spotId: product.id, // Use the id from the product prop
        rating: rating,
        comment: comment,
        timestamp: new Date(),
      };

      // Add the review document to the "Reviews" collection
      await addDoc(collection(firestore, 'Reviews'), reviewData);

      // If execution reaches this point, the review has been successfully added
      Alert.alert('Review Submitted', 'Your review has been submitted successfully.');

      // Reset the form state
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error adding review: ', error);
      Alert.alert('Error', 'An error occurred while submitting the review. Please try again later.');
    }
  };

  const Star = ({ filled, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name={filled ? 'star' : 'star-outline'} size={40} color={filled ? '#ffc107' : '#ccc'} />
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.label}>Rating:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((starNumber) => (
            <Star
              key={starNumber}
              filled={starNumber <= rating}
              onPress={() => handleStarPress(starNumber)}
            />
          ))}
        </View>

        <Text style={styles.label}>Comment:</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Enter your comment"
          value={comment}
          onChangeText={text => setComment(text)}
          multiline
        />

        <Button title="Submit Review" onPress={handleSubmit} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});
