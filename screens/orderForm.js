import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Formik } from 'formik';
import { theme } from '../components/themeComponent';
import { firestore, collection, addDoc, getDocs } from '../firebase/Config';

import { useNavigation, useRoute } from '@react-navigation/native';

const OrderForm = () => {

  const navigation = useNavigation();
  const route = useRoute();
  // Extract totalAmount from route.params
  const { totalAmount } = route.params;

  // Function to create the "Orders" collection if it doesn't exist
  const createOrdersCollectionIfNeeded = async () => {
    const ordersRef = collection(firestore, 'Orders');

    try {

      await getDocs(ordersRef);
    } catch (error) {

      if (error.code === 'not-found') {
        try {

          await addDoc(ordersRef, { dummy: 'data' });
          console.log("Orders collection created successfully");
        } catch (addError) {
          console.error("Error creating Orders collection:", addError);
        }
      } else {
        console.error("Error checking Orders collection:", error);
      }
    }
  };

  useEffect(() => {
    createOrdersCollectionIfNeeded();
  }, []);

  const submitFormToFirestore = async (values, resetForm) => {
    try {
      const docRef = await addDoc(collection(firestore, 'Orders'), values);
      console.log("Document written with ID: ", docRef.id);
      console.log("Form data sent to Firestore: ", values);
      resetForm();
      // Navigate to PayPal page with totalAmount
      navigation.navigate('Paypal page', { totalAmount });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };


  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.colors.background }]} behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{ firstName: '', lastName: '', address: '', phone: '', email: '' }}
          onSubmit={(values, { resetForm }) => {
            console.log("Values3", values);
            submitFormToFirestore(values, resetForm);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View style={styles.formContainer}>
              <Text style={styles.label2}>Please enter your details</Text>
              <Text style={styles.label}>First Name</Text>
              <Input
                placeholder="Enter your first name"
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName}
                style={styles.input}
                underlineColorAndroid="transparent"
                inputContainerStyle={styles.inputContainer}
              />
              <Text style={styles.label}>Last Name</Text>
              <Input
                placeholder="Enter your last name"
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName}
                style={styles.input}
                inputContainerStyle={styles.inputContainer}
              />
              <Text style={styles.label}>Address</Text>
              <Input
                placeholder="Enter your address"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
                style={styles.input}
                inputContainerStyle={styles.inputContainer}
              />
              <Text style={styles.label}>Phone Number</Text>
              <Input
                placeholder="Enter your phone number"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                keyboardType='phone-pad'
                style={styles.input}
                inputContainerStyle={styles.inputContainer}
              />
              <Text style={styles.label}>Email</Text>
              <Input
                placeholder="Enter your email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType='email-address'
                style={styles.input}
                inputContainerStyle={styles.inputContainer}
              />
              <Button
                title="Submit"
                onPress={handleSubmit}
                buttonStyle={styles.submitButton}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  input: {
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD449',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  inputContainer: {
    borderBottomWidth: 0,
  },
  submitButton: {
    backgroundColor: '#FFA500',
    marginTop: 20,
    borderRadius: 10,
  },
  label2: {
    marginBottom: 25,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA500',
  },
});

export default OrderForm;
