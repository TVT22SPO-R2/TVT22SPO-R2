import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShoppingCart from '../screens/shoppingCart';
import OrderForm from '../screens/orderForm';

import OrderConfirmation from '../screens/OrderConfirmation';

//import PaymentPage from '../screens/paymentPage';
import Paypal from '../components/PaypalPayment';

const Stack = createStackNavigator();

export default function ShoppingCartStack() {
  return (
    <Stack.Navigator initialRouteName="ShoppingCart">
      <Stack.Screen name="ShoppingCart" component={ShoppingCart} />
      <Stack.Screen name="OrderForm" component={OrderForm} />
      <Stack.Screen name="Paypal page" component={Paypal} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} />
    </Stack.Navigator>
  );
}
