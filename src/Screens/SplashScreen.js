import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import splashIcon from '../../assets/images/splash_screen.png';

const SplashScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image source={splashIcon} resizeMode="cover" style={styles.imgSplash} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgSplash: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
});
