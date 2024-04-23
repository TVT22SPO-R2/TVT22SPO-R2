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
          email: this.props.route.params?.email,
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

