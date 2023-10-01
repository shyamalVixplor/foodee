//import liraries
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import GlobalColor from '../../constant/constant';
import NetInfo from '@react-native-community/netinfo';
import AlertService from '../../Services/AlertService';

// create a component
const NoConnection = ({navigation}) => {
  useEffect(() => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (state.isConnected == true) {
        navigation.navigate('BottomTabs');
      } else {
        AlertService.dangerAlert('Could not connect to the internet!');
      }
    });
  }, []);
  return (
    <View style={styles.container}>
      <View
        style={{
          height: '60%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../../assets/images/noConnection.png')}
          style={{height: '70%', width: '95%', resizeMode: 'center'}}
        />
      </View>
      <View
        style={{
          width: '90%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '-10%',
        }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: GlobalColor.boldTxt,
            textAlign: 'center',
          }}>
          Not able to connect to the internet. Please check your network.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          NetInfo.fetch().then(state => {
            console.log('Connection type', state.type);
            console.log('Is connected?', state.isConnected);
            if (state.isConnected == true) {
              navigation.navigate('BottomTabs');
            } else {
              AlertService.dangerAlert('Could not connect to the internet!');
            }
          });
        }}>
        <Text style={styles.forgotBtnTxt}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
  },
  forgotBtnTxt: {
    fontSize: 16,
    fontWeight: '500',
    color: GlobalColor.BgPrimary,
    fontFamily: 'Poppins-Medium',
    marginVertical: 10,
  },
});

//make this component available to the app
export default NoConnection;
