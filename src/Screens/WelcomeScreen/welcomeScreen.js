//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import constant from '../../constant/constant';

// create a component
const WelcomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{width: '100%', height: 100}}>
        <Image
          resizeMode="cover"
          source={require('../../../assets/images/welcome.png')}
          style={{height: 200, width: '100%'}}
        />
      </View>
      <View style={{marginTop: 50}}>
        <View style={styles.squareStyle}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={{height: 200, width: '50%', resizeMode:'contain'}}
          />
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.txt}>Discover the best foods from</Text>
            <Text style={styles.txt}>over 1,000 restaurants and fast</Text>
            <Text style={styles.txt}>delivery to your doorstep</Text>
          </View>
          <View
            style={{
              marginVertical: 30,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                navigation.navigate('UserLoginScreen');
              }}>
              <Text style={styles.btnTxt}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.borderBtn}
              onPress={() => {
                navigation.navigate('UserRegisterScreen');
              }}>
              <Text style={[styles.btnTxt, {color: constant.BgPrimary}]}>
                Create an Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.arcStyle} />
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  squareStyle: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: 'white',
    zIndex: 1,
    alignItems: 'center',
  },
  arcStyle: {
    width: '20%',
    height: '100%',
    position: 'absolute',
    top: -25,
    left: '40%',
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    backgroundColor: 'white',
    transform: [{scaleX: 5}, {scaleY: 1}],
  },
  txt: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: constant.regularTxt,
  },
  btn: {
    paddingVertical: 15,
    width: '80%',
    borderRadius: 50,
    backgroundColor: constant.BgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  borderBtn: {
    paddingVertical: 15,
    width: '80%',
    borderRadius: 50,
    borderColor: constant.BgPrimary,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  btnTxt: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#fff',
  },
});

//make this component available to the app
export default WelcomeScreen;
