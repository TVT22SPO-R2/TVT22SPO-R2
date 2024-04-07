// import React from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';

// const PaymentPage = ({ navigation }) => {

//   const handlePaypalPayment = () => {
//     // Navigate to the PayPal component directly without conditional rendering
//     navigation.navigate('PaypalPayment');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Payment Page</Text>
//       <Button
//         title="Pay with PayPal"
//         onPress={handlePaypalPayment}
//         color="#007BFF"
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
// });

// export default PaymentPage;


//
//OP payment method 
// 

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';

// import initiateOpPayment from '../components/OpPayment'; 

// const PaymentPage = ({ navigation }) => {
//   const [paymentStatus, setPaymentStatus] = useState('pending');

//   const handleOpPayment = async () => {
//     // Call the OP payment function when the OP payment button is pressed
//     await initiateOpPayment();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Payment Page</Text>
      
//       <Button
//         title="Pay with OP"
//         onPress={handleOpPayment}
//         color="#007BFF"
//       />

//       {paymentStatus !== 'pending' && (
//         <Text style={styles.status}>Payment Status: {paymentStatus}</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   status: {
//     marginTop: 20,
//     fontSize: 16,
//   },
// });

// export default PaymentPage;


//
// Mobilepay payment method
//

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Button, Alert, Linking } from 'react-native';

// const PaymentPage = ({ navigation }) => {
//   const [paymentStatus, setPaymentStatus] = useState('pending');

//   const handlePayment = async () => {
//     // Check if the device supports the MobilePay app's URL scheme
//     const canOpen = await Linking.canOpenURL('mobilepay://');

//     if (canOpen) {
//       // Attempt to open the MobilePay app without starting a payment
//       const mobilePayUrl = 'mobilepay://';
      
//       // Open the MobilePay app
//       Linking.openURL(mobilePayUrl).catch(err => {
//         console.error('Failed to open MobilePay:', err);
//         // Update the state to reflect that there was an attempt to open MobilePay
//         setPaymentStatus('checking');
//         Alert.alert('MobilePay Opened', 'Please complete any transactions within the MobilePay app.');
//       });
//     } else {
//       Alert.alert('MobilePay Not Available', 'Please install the MobilePay app to proceed.');
//     }
//   };

//   // Modify the rendering to account for the new 'checking' state
//   const renderPaymentStatus = () => {
//     switch (paymentStatus) {
//       case 'pending':
//         return <Text style={styles.status}>Click below to open MobilePay.</Text>;
//       case 'checking':
//         return <Text style={styles.status}>Please check MobilePay for any ongoing transactions.</Text>;
//       case 'failed':
//         return <Text style={styles.status}>Payment Status: Failed</Text>;
//       // You can add more cases for other statuses (like 'success') as needed
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Payment Page</Text>
//       <Text style={styles.instructions}>Click below to open MobilePay</Text>
      
//       <Button
//         title="Open MobilePay"
//         onPress={handlePayment}
//         color="#007BFF"
//       />

//       {renderPaymentStatus()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   instructions: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   status: {
//     marginTop: 20,
//     fontSize: 16,
//   },
// });

// export default PaymentPage;
