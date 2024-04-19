import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

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
              Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
            },
          }
        );

        console.log('Confirmation email sent successfully', response.data);

        // Navigate to the PayPal part after the confirmation email is sent
        navigation.navigate('Paypal page', { totalAmount });
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    };

    // Call sendEmailConfirmation function when component mounts
    sendEmailConfirmation();
  }, [email, navigation, totalAmount]);

  return (
    <View>
      <Text>Order Confirmation UI</Text>
      {/* You can add more UI elements here as needed */}
    </View>
  );
};

export default OrderConfirmation;
