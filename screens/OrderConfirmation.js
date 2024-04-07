import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const OrderConfirmation = ({ navigation }) => {
  // Placeholder data - you might want to replace this with actual data passed from the payment process
  const orderDetails = {
 
    amountPaid: '0.01 USD',

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmation</Text>
      <Text style={styles.text}>Thank you for your purchase!</Text>
  
      <Text style={styles.text}>Amount Paid: {orderDetails.amountPaid}</Text>
    
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
});

export default OrderConfirmation;