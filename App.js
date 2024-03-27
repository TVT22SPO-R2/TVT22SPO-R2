import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Auth';
import HomeScreen from './screens/homeScreen';
import { auth } from './firebase/Config';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomNavigator from './components/BottomNavigator';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe; // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const onLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser); // This can be improved depending on how you manage your user's session
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Tab.Screen name="Settings" component={BottomNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const StackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;