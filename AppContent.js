import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { NavigationContainer, useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from './components/Auth';
import HomeScreen from './screens/homeScreen';
import Settings from './screens/Settings';
import MapScreen from './screens/mapScreen';
import SearchScreen from './screens/searchScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ShoppingCartStack from './components/shoppingCartStack';
import { theme } from './components/themeComponent';
import AddSpot from './screens/addSpot';
import { useUser } from './components/UserContext';
import ViewProduct from './screens/viewProduct';
import CheckAvailability from './screens/checkAvailability';
import { Alert } from 'react-native';

import NotesScreen from './screens/NotesScreen';

const Tab = createBottomTabNavigator();

function AppContent() {
  const { user, setUser, loading } = useUser();
  const navigation = useNavigation();
  const [addSpotVisible, setAddSpotVisible] = useState(true);
  const isHomeFocused = useIsFocused();



  useFocusEffect(
    useCallback(() => {
      console.log("Focus changed");
      const unsubscribe = navigation.addListener('state', () => {
        const currentRoute = navigation.getCurrentRoute();
        console.log("Current route:", currentRoute.name);
        if (currentRoute.name === 'ParKing') {
          setAddSpotVisible(true);
        } else {
          setAddSpotVisible(false);
        }
      });

      return unsubscribe;
    }, [navigation])
  );


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
          tabBarStyle: { backgroundColor: theme.colors.primary },
          tabBarActiveTintColor: theme.colors.text,
          headerStyle: { backgroundColor: 'transparent' }, // Set the header background color to transparent
          headerTransparent: true, // Make the header transparent

        }}
      >
        <Tab.Screen name="ParKing" component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen name="Settings" component={Settings}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cogs" color={color} size={size} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
            }
          })} />
        <Tab.Screen
          name="Notes"
          component={NotesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="notebook" color={color} size={size} />
            ),
            tabBarButton: () => null,
          }}
        />
        {!user && (
          <Tab.Screen
            name="Login"
            children={() => <Login onLoginSuccess={setUser} />}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="login" color={color} size={size} />
              ),
              headerShown: false
            }}
            listeners={({ navigation }) => ({
              tabPress: (e) => {

              }
            })}
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
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={size} />
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
          listeners={({ navigation }) => ({
            tabPress: e => {
              // Estä välilehden vaihto
              e.preventDefault();
              // Tarkista, onko käyttäjä kirjautunut sisään
              if (!user) {
                // Näytä Alert-ikkuna
                Alert.alert(
                  "Kirjaudu sisään", // Otsikko
                  "Kirjaudu sisään käyttääksesi ostoskoria", // Viesti
                  [
                    {
                      text: "Peruuta",
                      style: "cancel"
                    },
                    { text: "Kirjaudu", onPress: () => navigation.navigate("Login") }
                  ]
                );
              } else {
                // Salli välilehden vaihto, jos käyttäjä on kirjautunut sisään
                navigation.navigate("Cart");
              }
            },
          })}
        />
        <Tab.Screen
          name="AddSpot"
          component={AddSpot}
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          name="ViewProduct"
          component={ViewProduct}
          options={{
            tabBarButton: () => null,
            headerShown: false
          }}
        />
        <Tab.Screen
          name="CheckAvailability"
          component={CheckAvailability}
          options={{
            tabBarButton: () => null,
          }}
        />
      </Tab.Navigator>
      {addSpotVisible && (
        <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate("AddSpot")}>
          <MaterialCommunityIcons name="plus" color="white" size={30} />
        </TouchableOpacity>
      )}
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
    bottom: Dimensions.get('window').height * 0.1,
    right: Dimensions.get('window').width * 0.05,
    backgroundColor: 'orange',
    borderRadius: 30,
    width: Dimensions.get('window').width * 0.15,
    height: Dimensions.get('window').width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppContent;