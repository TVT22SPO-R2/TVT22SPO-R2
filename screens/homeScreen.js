import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { theme } from '../components/themeComponent';

const HomeScreen = () => {
 
  const navigation = useNavigation();


  return (
    <View style={styles.container}>
      <Text style={{ color: theme.colors.text }}>Welcome to the Home Screen!</Text>
    
      <Button color={theme.colors.primary} title="Map" onPress={() => navigation.navigate("Map")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;