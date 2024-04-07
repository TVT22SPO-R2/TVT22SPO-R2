import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from './components/Auth';
import HomeScreen from './screens/homeScreen';
import Settings from './screens/Settings';
import MapScreen from './screens/mapScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ShoppingCartStack from './components/shoppingCartStack';
import { theme } from './components/themeComponent';
import AddSpot from './screens/addSpot';
import { useUser } from './components/UserContext';
import ViewProduct from './screens/viewProduct';

import { Alert } from 'react-native';

const Tab = createBottomTabNavigator();

function AppContent() {
  const { user, setUser, loading } = useUser();
  const navigation = useNavigation();
  const [addSpotVisible, setAddSpotVisible] = useState(true);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleAddSpot = () => {
    setAddSpotVisible(false);
  }

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: theme.colors.primary },
          tabBarActiveTintColor: theme.colors.text,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
          listeners={{
            tabPress: () => {
              setAddSpotVisible(true);
            }
          }} />
        <Tab.Screen name="Settings" component={Settings}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cogs" color={color} size={size} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              handleAddSpot();
            }
          })} />
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
                handleAddSpot();
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
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              handleAddSpot();
            }
          })}
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
              //Piilota AddSpot-nappi, kun käyttäjä siirtyy ostoskoriin
              handleAddSpot();
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