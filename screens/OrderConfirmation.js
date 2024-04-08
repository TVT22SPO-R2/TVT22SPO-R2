import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const OrderConfirmation = ({ route, navigation }) => {
  // Accessing totalAmount from the route parameters
  const { totalAmount } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmation</Text>
      <Text style={styles.text}>Thank you for your purchase!</Text>
  
      {/* Render totalAmount received from the payment screen */}
      <Text style={styles.text}>Amount Paid: {totalAmount} USD</Text>
    
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')} // Assuming 'Home' is the name of your home screen in navigation
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default OrderConfirmation;