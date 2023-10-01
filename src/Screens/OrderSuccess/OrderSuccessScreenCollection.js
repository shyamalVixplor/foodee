import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import checkIcon from '../../../assets/images/check.png';
import constant from '../../constant/constant';
import {useFocusEffect, useRoute} from '@react-navigation/native';

const OrderSuccessScreen = ({navigation, route}) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (route.name === 'OrderSuccessScreen') {
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [route]),
  );
  const orderID = route.params.data;
 //console.log('777777777777777777Order Id', route.params);
  return (
    <View style={styles.container}>
      <View style={styles.checkView}>
        <Image source={checkIcon} style={styles.checkStyle} />
      </View>
      <Text
        style={{
          fontSize: 24,
          fontFamily: 'Poppins-Bold',
          color: constant.boldTxt,
          marginTop: 20,
        }}>
        Success
      </Text>
      <View style={{width: '75%', marginTop: 10, height: 85}}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Poppins-Regular',
            color: constant.regularTxt,
          }}>
          Your order has been placed and is on it’s way to being processed.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('TrackOrder', {data: orderID});
          // navigation.jumpTo('HomeStackNavigator', {
          //   screen: 'TrackOrder2',
          //   params: { data: orderID }
          // });
          navigation.navigate('TrackOrder2-collection', {data: orderID});
        }}
        style={styles.trackBtn}>
        <Text style={styles.trackBtnTxt}>Track order</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.jumpTo('HomeStackNavigator', {
            screen: 'HomeScreen',
          });
        }}
        style={styles.backHomeBtn}>
        <Text style={styles.backHomeBtnTxt}>Back Home</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkView: {
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: constant.BgPrimary,
  },
  checkStyle: {
    height: 25,
    width: 25,
    alignSelf: 'center',
    tintColor: '#ffffff',
  },
  trackBtn: {
    marginTop: 5,
    height: 50,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: constant.BgPrimary,
    borderRadius: 25,
  },
  trackBtnTxt: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
  backHomeBtn: {
    marginTop: 20,
    height: 50,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: constant.BgPrimary,
  },
  backHomeBtnTxt: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: constant.BgPrimary,
  },
});
export default OrderSuccessScreen;
