import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React from 'react';
import GlobalColor from '../../constant/constant';

const ApiLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={GlobalColor.BgPrimary} />
      <Text style={styles.loading}>Loading...</Text>
    </View>
  );
};

export default ApiLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  loading: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
