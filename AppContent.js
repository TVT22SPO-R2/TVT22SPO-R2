import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from './components/Auth';
import HomeScreen from './screens/homeScreen';
import BottomNavigator from './components/BottomNavigator';
import MapScreen from './screens/mapScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ShoppingCartStack from './components/shoppingCartStack';
import  {theme}  from './components/themeComponent';
import AddSpot from './screens/addSpot'
import { useUser } from './components/UserContext'; 

const Tab = createBottomTabNavigator();

function AppContent() {
  const { user, setUser, loading } = useUser();
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    
      <View style={styles.container}>
        <Tab.Navigator 
          screenOptions={{
          tabBarStyle: { backgroundColor: theme.colors.primary},
          tabBarActiveTintColor: theme.colors.text,
        }}
        >
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
          <Tab.Screen
            name="Cart"
            component={ShoppingCartStack}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="cart" color={color} size={size} />
              ),
            }}
          />
        <Tab.Screen
            name="AddSpot"
            component={AddSpot} // Import and use the AddSpot screen component
            options={{
            tabBarButton: () => null, // Hide the tab button for the AddSpot screen
            }}
        />
        </Tab.Navigator>
        <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate("AddSpot")}>
          <MaterialCommunityIcons name="plus" color="white" size={30} />
        </TouchableOpacity>
      </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    backgroundColor: 'orange',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppContent;
