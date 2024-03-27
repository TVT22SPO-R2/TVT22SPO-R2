import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from './components/Auth';
import HomeScreen from './screens/homeScreen';
import BottomNavigator from './components/BottomNavigator';
import MapScreen from './screens/mapScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { UserProvider, useUser } from './components/UserContext'; // Assuming useUser is exported from UserContext

const Tab = createBottomTabNavigator();

// Define a separate component to use the context
function AppContent() {
  const { user, setUser, loading } = useUser(); // Adjust according to your UserContext

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={BottomNavigator} />
        {!user && (
          <Tab.Screen 
            name="Login" 
            children={() => <Login onLoginSuccess={setUser} />} 
            options={{ headerShown: false }}
          />
        )}
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="map" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Wrap the AppContent with UserProvider at the top level
const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;