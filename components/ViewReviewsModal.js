import React from 'react';
import { Modal, View, Text, FlatList, StyleSheet } from 'react-native';

export default function ViewReviewsModal({ isVisible, onClose, reviews }) {
  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text>{item.comment}</Text>
      <Text>Rating: {item.rating}</Text>
    </View>
  );

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Reviews</Text>
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <Button title="Close" onPress={onClose} />
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
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  reviewItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
