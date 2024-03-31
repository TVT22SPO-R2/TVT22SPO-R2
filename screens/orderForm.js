import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Formik } from 'formik';
import { theme } from '../components/themeComponent';
import { firestore, collection, addDoc, getDocs } from '../firebase/Config';

import { useNavigation } from '@react-navigation/native';

const OrderForm = () => {
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
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };


  const navigation = useNavigation(); 

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.colors.tertiary } ]} behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{ firstName: '', lastName: '', address: '', phone: '', email: '' }}
          onSubmit={(values, { resetForm }) => {
            console.log("Values3", values);
            submitFormToFirestore(values, resetForm);
            navigation.navigate('PaymentPage'); 
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View style={styles.formContainer}>
              <Text style={styles.label}>First Name</Text>
              <Input
                placeholder="Enter your first name"
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName}
                style={styles.input}
              />
              <Text style={styles.label}>Last Name</Text>
              <Input
                placeholder="Enter your last name"
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName}
                style={styles.input}
              />
              <Text style={styles.label}>Address</Text>
              <Input
                placeholder="Enter your address"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
                style={styles.input}
              />
              <Text style={styles.label}>Phone Number</Text>
              <Input
                placeholder="Enter your phone number"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                keyboardType='phone-pad'
                style={styles.input}
              />
              <Text style={styles.label}>Email</Text>
              <Input
                placeholder="Enter your email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType='email-address'
                style={styles.input}
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
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    marginTop: 20,
  },
});

export default OrderForm;
