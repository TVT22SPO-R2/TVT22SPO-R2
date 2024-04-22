import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShoppingCart from '../screens/shoppingCart';
import OrderForm from '../screens/orderForm';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import OrderConfirmation from '../screens/OrderConfirmation';

//import PaymentPage from '../screens/paymentPage';
import Paypal from '../components/PaypalPayment';

const Stack = createStackNavigator();

export default function ShoppingCartStack() {
  const navigation = useNavigation();
  const route = useRoute();
  const  updatedProduct  = route.params?.updatedProduct;
  console.log("routeparamssi", route.params)

  return (
    <Stack.Navigator initialRouteName="ShoppingCart"
      screenOptions={{
        headerStyle: {
          height: 100, // Adjust the height as needed
        },
        headerLeftContainerStyle: {
          marginTop: 60, // Adjust the height as needed
        },
      }}
    >
      <Stack.Screen name="ShoppingCart" component={ShoppingCart} initialParams={{ updatedProduct }}
        options={{
          headerShown: false,
          title: '',
          headerTitleStyle: { color: 'orange' },
        }} />
      <Stack.Screen
        name="OrderForm"
        component={OrderForm}
        options={{
          title: '',
          headerTitleStyle: { color: 'orange' },
        }}
      />
      <Stack.Screen
        name="Paypal page"
        component={Paypal}
        options={{
          title: '',
          headerTitleStyle: { color: 'orange' },
        }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{
          title: '',
          headerTitleStyle: { color: 'orange' },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'orange',
  },
});