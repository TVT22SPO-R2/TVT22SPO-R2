import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../components/themeComponent';
import ItemContainer from '../components/spotContainer';

const HomeScreen = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Make money with your parking spot!</Text>
      <Text styles={styles.text}> Parking spots for rent currently </Text>
      <ItemContainer />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: theme.colors.primary,
  },
});

export default HomeScreen;