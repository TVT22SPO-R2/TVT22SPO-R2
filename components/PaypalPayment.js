import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import axios from 'axios';

import { PAYPAL_CLIENT_ID, PAYPAL_SECRET } from '@env';
import { encode as btoa } from 'base-64';

const PAYPAL_API = 'https://api.sandbox.paypal.com';

export default class Paypal extends Component {
  state = {
    accessToken: null,
    approvalUrl: null,
    paymentId: null,
  };

  componentDidMount() {
    const { totalAmount } = this.props.route.params;

    const base64Credentials = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${base64Credentials}`,
    };

    axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', { headers })
      .then(response => {
        this.setState({ accessToken: response.data.access_token });
        this.createPayment(totalAmount, response.data.access_token);
      })
      .catch(err => {
        console.error('Error getting access token:', err);
      });
  }

  createPayment = (totalAmount, accessToken) => {
    const paymentData = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "transactions": [{
        "amount": {
          "total": totalAmount,
          "currency": "USD",
          "details": {
            "subtotal": totalAmount,
            "tax": "0",
            "shipping": "0",
            "handling_fee": "0",
            "shipping_discount": "0",
            "insurance": "0"
          }
        }
      }],
      "redirect_urls": {
        "return_url": "https://example.com/success",
        "cancel_url": "https://example.com/cancel"
      }
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };
    
    axios.post('https://api.sandbox.paypal.com/v1/payments/payment', paymentData, { headers })
    .then(response => {
      const { id, links } = response.data;
      const approvalUrl = links.find(link => link.rel === 'approval_url').href;
      this.setState({
        paymentId: id,
        approvalUrl: approvalUrl
      });
    })
    .catch(error => {
      console.error('Payment creation error:', error);
    });
};

onNavigationStateChange = (webViewState) => {
  console.log('Navigated to URL:', webViewState.url);

  if (webViewState.url.includes("https://example.com/success")) {
      console.log('Success URL reached:', webViewState.url);
      this.setState({ approvalUrl: null });

      // Navigate to the OrderConfirmation screen with any relevant data
      this.props.navigation.navigate('OrderConfirmation', {
          paymentId: this.state.paymentId,
          // Assuming totalAmount is also relevant for the success scenario
          totalAmount: this.props.route.params?.totalAmount,
      });
  } else if (webViewState.url.includes("https://example.com/cancel")) {
      console.log('Cancel URL reached:', webViewState.url);
      this.setState({ approvalUrl: null });

      // When navigating back to OrderForm on cancel, ensure totalAmount is included
      // This assumes that OrderForm is expecting to receive totalAmount as a parameter
      this.props.navigation.navigate('OrderForm', {
          totalAmount: this.props.route.params?.totalAmount,
      });
  }
};

//   onNavigationStateChange = (webViewState) => {
//     console.log('webViewState:', webViewState.url);
//     if (webViewState.url.includes('https://example.com/cancel')) {
//       this.props.onCancelPayment(); // This prop function is to be defined in AppContent
//     }
//   };


  render() {
    const { approvalUrl } = this.state;
    return (
      <View style={styles.container}>
        {approvalUrl ? (
          <WebView

          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
          }}

            style={styles.webView}
            source={{ uri: approvalUrl }}
            onNavigationStateChange={this.onNavigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          />
        ) : (
          <View style={styles.centerView}>
            <Text style={styles.infoText}>
              Do not press back or refresh page.
            </Text>
            <ActivityIndicator size="large" color="black" />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    height: '100%',
    width: '100%',
    marginTop: 40,
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: 'black',
    fontSize: 24,
    alignSelf: 'center',
    marginBottom: 20,
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});



//------------------




// import React, { Component } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import { WebView } from 'react-native-webview';
// import axios from 'axios';

// const PaypalClientID = process.env.EXPO_PUBLIC_PAYPAL_CLIENTID;
// const PaypalSecret = process.env.EXPO_PUBLIC_PAYPAL_SECRET;


// export default class Paypal extends Component {
//   state = {
//     accessToken: null,
//     approvalUrl: null,
//     paymentId: null,
//   };

//   componentDidMount() {
//     this.getAccessToken();
//   }

//   getAccessToken = () => {
//     axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
//         auth: {
//           username: PaypalClientID,
//           password: PaypalSecret,
//         },
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       data: 'grant_type=client_credentials',
//     })
//     .then(response => {
//       this.setState({ accessToken: response.data.access_token });
//       this.createPayment(response.data.access_token);
//     })
//     .catch(err => {
//       console.error('Error getting access token: ', err);
//       Alert.alert('Error', 'Could not get access token. Please try again.');
//     });
//   }

//   createPayment = (accessToken) => {
//     const dataDetail = {
//       intent: 'sale',
//       payer: { payment_method: 'paypal' },
//       transactions: [{
//         amount: {
//           total: '0.01',
//           currency: 'USD',
//           details: {
//             subtotal: '0.01',
//             tax: '0',
//             shipping: '0',
//             handling_fee: '0',
//             shipping_discount: '0',
//             insurance: '0'
//           }
//         }
//       }],
//       // Make sure to add the correct return URL
//       redirect_urls: {
//         return_url: 'Your return URL here',
//         cancel_url: 'Your cancel URL here',
//       },
//     };

//     axios.post('https://api.sandbox.paypal.com/v1/payments/payment', dataDetail, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`,
//       },
//     })
//     .then(response => {
//       const { id, links } = response.data;
//       const approvalUrl = links.find(data => data.rel === 'approval_url').href;
//       this.setState({ paymentId: id, approvalUrl });
//     })
//     .catch(err => {
//       console.error('Payment creation error: ', err);
//       Alert.alert('Error', 'Payment creation failed. Please try again.');
//     });
//   }

//   onNavigationStateChange = (webViewState) => {
//     if (webViewState.url.includes('https://example.com/')) { // Replace with your return URL
//       const url = webViewState.url;
//       // Extract the Payer ID from the URL here if needed
//       this.setState({ approvalUrl: null });
//       this.executePayment(this.state.paymentId, accessToken); // Pass the correct accessToken
//     }
//   }

//   executePayment = (paymentId, payerId, accessToken) => {
//     axios.post(`https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`, {
//       payer_id: payerId,
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`,
//       },
//     })
//     .then(response => {
//       if (response.data.state === 'approved') {
//         Alert.alert('Payment Success', 'Your payment was successful!');
//         this.setState({ paymentId: null, accessToken: null });
//         // Navigate to a success page or back to your app
//       } else {
//         throw new Error('Payment not approved');
//       }
//     })
//     .catch(err => {
//       console.error('Payment execution error: ', err);
//       Alert.alert('Payment Failed', 'Your payment could not be processed. Please try again.');
//       this.setState({ paymentId: null, accessToken: null });
//     });
//   }

//   render() {
//     const { approvalUrl } = this.state;
//     return (
//       <View style={{ flex: 1 }}>
//         {approvalUrl ? (
//           <WebView
//             source={{ uri: approvalUrl }}
//             style={{ flex: 1 }}
//             onNavigationStateChange={this.onNavigationStateChange}
//             startInLoadingState={true}
//             renderLoading={() => (
//               <ActivityIndicator color="black" size="large" style={styles.activityIndicator} />
//             )}
//           />
//         ) : (
//           <View style={styles.centeredView}>
//             <Text style={styles.loadingText}>Loading...</Text>
//           </View>
//         )}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 20,
//   },
//   activityIndicator: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });