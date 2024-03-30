import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const PaymentPage = ({ navigation }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const handlePayment = async () => {
    // Placeholder for payment processing logic
    // MobilePay's SDK or API calls here
    // For demonstration purposes, let's simulate a successful payment after a delay
    setTimeout(() => {
      setPaymentStatus('success');
      Alert.alert('Payment Successful', 'Your payment has been processed successfully.');
      //Navigate to the payment success page?
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Page</Text>
      <Text style={styles.instructions}>Click below to proceed with MobilePay</Text>
      
      <Button
        title="Pay with MobilePay"
        onPress={handlePayment}
        color="#007BFF"
      />

      {/* Optionally display payment status */}
      {paymentStatus !== 'pending' && (
        <Text style={styles.status}>Payment Status: {paymentStatus}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default PaymentPage;