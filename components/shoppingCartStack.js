import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShoppingCart from '../screens/shoppingCart';
import OrderForm from '../screens/orderForm';

const Stack = createStackNavigator();

export default function ShoppingCartStack() {
  return (
    <Stack.Navigator initialRouteName="ShoppingCart">
      <Stack.Screen name="ShoppingCart" component={ShoppingCart} />
      <Stack.Screen name="OrderForm" component={OrderForm} />
    </Stack.Navigator>
  );
}
