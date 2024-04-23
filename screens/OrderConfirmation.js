import React, { useEffect } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, Button } from 'react-native';

const OrderConfirmation = ({ route, navigation }) => {
  const { totalAmount, email } = route.params;

  useEffect(() => {
    const sendEmailConfirmation = async () => {
      try {
        // Send confirmation email using SendGrid API
        const response = await axios.post(
          'https://api.sendgrid.com/v3/mail/send',
          {
            personalizations: [
              {
                to: [{ email: email }],
              },
            ],
            from: { email: 'parkingbnb1@gmail.com' },
            subject: 'Order Confirmation',
            content: [
              {
                type: 'text/plain',
                value: `Thank you for your purchase! Enjoy your parking spot.`,
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.EXPO_PUBLIC_SENDGRID_API_KEY}`,
            },
          }
        );

        console.log('Confirmation email sent successfully', response.data);

        // Navigate to the PayPal part after the confirmation email is sent
        //navigation.navigate('Paypal page', { totalAmount });
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    };

    // Call sendEmailConfirmation function when component mounts
    sendEmailConfirmation();
  }, [email, navigation, totalAmount]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmation</Text>
      <Text style={styles.text}>Thank you for your purchase!</Text>

      {/* Render totalAmount received from the payment screen */}
      <Text style={styles.text}>Amount Paid: {totalAmount} USD</Text>
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