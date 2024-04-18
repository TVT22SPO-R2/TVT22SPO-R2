import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ItemContainer from '../components/spotContainer';

const HomeScreen = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>From empty parking spot to extra income. ParKing turns your parking spot into money!</Text>
      <Text style={styles.text2}> Parking spots for rent currently </Text>
      <ItemContainer navigation={navigation} />
      <Text style={styles.text2}> Park easier, earn smarter. </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: '#f9a620',
    textAlign: 'center',
    marginBottom: 20,
  },
  text2: {
    fontSize: 16,
    color: '#f9a620',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default HomeScreen;