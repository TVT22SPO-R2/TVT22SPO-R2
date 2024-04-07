// import { Alert } from 'react-native';
// import base64 from 'react-native-base64';

// const initiateOpPayment = async () => {
//   const apiKey = process.env.EXPO_PUBLIC_OP_BANK_API_KEY;
//   const apiSecret = process.env.EXPO_PUBLIC_OP_BANK_API_SECRET;
//   const opPaymentUrl = 'https://api.op.fi/payments/';
//   const authorizationToken =

//   const base64Credentials = base64.encode(`${apiKey}:${apiSecret}:${authorizationToken}`);

//   try {
//     const response = await fetch(opPaymentUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${base64Credentials}`,
//       },
//       body: JSON.stringify({
//         amount: 0.10,
//         currency: 'EUR',
//       }),
//     });

//     if (!response.ok) throw new Error(`Payment initiation failed with status: ${response.status}`);

//     Alert.alert('Success', 'Payment initiated successfully');
//   } catch (error) {
//     console.error('Payment initiation error:', error);
//     Alert.alert('Error', 'Failed to initiate payment');
//   }
// };

// export default initiateOpPayment;