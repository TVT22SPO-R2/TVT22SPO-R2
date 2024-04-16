import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShoppingCart from '../screens/shoppingCart';
import OrderForm from '../screens/orderForm';
import { useRoute, useNavigation } from '@react-navigation/native';

import OrderConfirmation from '../screens/OrderConfirmation';

//import PaymentPage from '../screens/paymentPage';
import Paypal from '../components/PaypalPayment';

const Stack = createStackNavigator();

export default function ShoppingCartStack() {
  const navigation = useNavigation();
  const route = useRoute();
  const { updatedProduct } = route.params;
  console.log("routeparamssi", route.params)

  return (
    <Stack.Navigator initialRouteName="ShoppingCart">
      <Stack.Screen name="ShoppingCart" component={ShoppingCart} initialParams={{ updatedProduct }} />
      <Stack.Screen name="OrderForm" component={OrderForm} />
      <Stack.Screen name="Paypal page" component={Paypal} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} />
    </Stack.Navigator>
  );
}
