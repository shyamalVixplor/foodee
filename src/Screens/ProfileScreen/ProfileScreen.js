import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import bgIcon from '../../../assets/images/demo.png';
import rightIcon from '../../../assets/images/right_arrow_nrml.png';
import heartIcon from '../../../assets/images/newHeart.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import AuthContext from '../../context/AuthContext';
import constant from '../../constant/constant';
import Spinner from 'react-native-loading-spinner-overlay';
import UserService from '../../Services/UserService';
import AlertService from '../../Services/AlertService';
import {CartState} from '../../context/CartContext';
import {CommonActions, NavigationAction} from '@react-navigation/native';
import ApiLoader from '../../components/ApiLoader';

const ProfileScreen = ({navigation}) => {
  const {
    cartItem,
    addItem,
    increment,
    decrement,
    deleteItem,
    totalPrice,
    removeAllItem,
  } = CartState();
  const {authContext, AppUserData} = useContext(AuthContext);
  const [Data, setData] = useState({});
  const [Loader, setLoader] = useState(false);
  // console.log('App User Data', AppUserData.token);

  // useEffect(() => {
  //   getProfileDetails();
  // }, []);

  const AlertOccurred = (title, body, btnTxt, btnTxt2) => {
    Alert.alert(title, body, [
      {
        text: btnTxt,
        onPress: () => {
          removeAllItem();
          DeleteAccount();
          reset();
        },
      },
      {
        text: btnTxt2,
        onPress: () => {
          console.log('No Pressed');
        },
      },
    ]);
  };
  const reset = () => {
    return navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'HomeStackNavigator'}],
      }),
      CommonActions.navigate({
        name: 'HomeStackNavigator',
      }),
    );
  };
  const LogOutAlertOccurred = (title, body, btnTxt, btnTxt2) => {
    Alert.alert(title, body, [
      {
        text: btnTxt,
        onPress: () => {
          authContext.signOut();
          removeAllItem();
          console.log('AppUserData', AppUserData);
          reset();
        },
      },
      {
        text: btnTxt2,
        onPress: () => {
          console.log('No Pressed');
        },
      },
    ]);
  };

  const NormalAlertOccurred = (title, body, btnTxt) => {
    Alert.alert(title, body, [
      {
        text: btnTxt,
        onPress: () => {
          console.log(title);
        },
      },
    ]);
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('App User Token', AppUserData.token);
      Object.keys(AppUserData).length === 0 ? null : getProfileDetails();
    }, []),
  );
  const getProfileDetails = () => {
    let token = AppUserData.token;
    setLoader(true);
    UserService.Post('user/user-profile', {}, token)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          setData(response.data.profile);
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setData({});

          // AlertService.dangerAlert(response.message);
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('response data', error);
        if (error.response) {
          // client received an error response (5xx, 4xx)
          AlertService.dangerAlert(error.response.data.error.message);
        } else if (error.request) {
          // client never received a response, or request never left
          AlertService.dangerAlert('Network Error');
          // console.log("error.request", error.request._response);
        } else {
          // anything else
          AlertService.dangerAlert('Something Went Wrong');
        }
      });
  };

  const DeleteAccount = () => {
    let token = AppUserData.token;
    console.log('App User Token', token);
    setLoader(true);
    UserService.Post('user/delete-user', {}, token)
      .then(response => {
        setLoader(false);
        console.log('DeleteAccount Response=>', response);
        if (response.error == false) {
          authContext.signOut();
          navigation.navigate('HomeStackNavigator', {
            screen: 'Home',
          });
          AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);

          NormalAlertOccurred('Alert', response.message, 'ok');
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('response data', error);
        if (error.response) {
          // client received an error response (5xx, 4xx)
          AlertService.dangerAlert(error.response.data.error.message);
        } else if (error.request) {
          // client never received a response, or request never left
          AlertService.dangerAlert('Network Error');
          // console.log("error.request", error.request._response);
        } else {
          // anything else
          AlertService.dangerAlert('Something Went Wrong');
        }
      });
  };

  return (
    Loader == true ? (
      <ApiLoader />):<SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back"
              size={25}
              color={constant.boldTxt}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Poppins-Medium',
              color: constant.boldTxt,
            }}>
            User Profile
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#fff',
          width: '100%',
        }}>
        <View style={styles.nameView}>
          <ImageBackground source={bgIcon} style={styles.imgStyle}>
            {Data !== undefined &&
            Data.firstname !== undefined &&
            Data.lastname !== undefined ? (
              <Text style={styles.textStyle}>{`${Data.firstname.substring(
                0,
                1,
              )}${Data.lastname.substring(0, 1)}`}</Text>
            ) : (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Poppins-Medium',
                    color: constant.BgPrimary,
                  }}>
                  Not
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Poppins-Medium',
                    color: constant.BgPrimary,
                  }}>
                  Found
                </Text>
              </View>
            )}
          </ImageBackground>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Poppins-Medium',
              color: constant.mediumTxt,
              marginTop: 10,
            }}>
            {`${Data.firstname} ${Data.lastname}`}
          </Text>
          {Data.phone == '' || undefined || null ? (
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: constant.BgPrimary,
                marginTop: 8,
              }}>
              Mobile Number is missing !
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: constant.mediumTxt,
                marginTop: 8,
              }}>
              {`${Data.phone}`}
            </Text>
          )}
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Poppins-Regular',
              color: constant.mediumTxt,
              marginTop: 8,
            }}>
            {`${Data.email}`}
          </Text>
          <TouchableOpacity
            style={styles.editBtnView}
            onPress={() => {
              navigation.navigate('UpdateProfile');
            }}>
            <Text style={styles.editBtnTxt}>Update Profile</Text>
            <Image
              source={rightIcon}
              resizeMode="contain"
              style={{left: 5, tintColor: '#ffffff', height: 10, width: 10}}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={[styles.layoutView, {marginTop: 30}]}
          showsVerticalScrollIndicator={false}>
          {/* <View style={styles.feature}>
          <View style={{flexDirection: 'row'}}>
            <Ionicons
              name="ios-heart-outline"
              color={constant.mediumTxt}
              size={25}
            />
            <Text style={styles.featureTxt}>Favourites</Text>
          </View>
          <Ionicons
            name="ios-chevron-forward"
            color={constant.mediumTxt}
            size={25}
          />
        </View> */}
          <TouchableOpacity
            style={styles.feature}
            onPress={() => {
              navigation.navigate('Address', {data: Data.id});
            }}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="reader-outline"
                color={constant.mediumTxt}
                size={25}
              />
              <Text style={styles.featureTxt}>Address</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              color={constant.mediumTxt}
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.feature}
            onPress={() => {
              // navigation.navigate('AuthNavigator', {
              //   screen: 'ResetPasswordScreen',
              //   params: {Back: false},
              //   initial: false,
              // });
              navigation.navigate('ForgotPasswordScreen', {
                data: 'FromProfile',
              });
            }}>
            <View style={{flexDirection: 'row'}}>
              <Foundation name="key" color={constant.mediumTxt} size={25} />
              <Text style={styles.featureTxt}>Reset Password</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              color={constant.mediumTxt}
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.feature}
            onPress={() => {
              navigation.navigate('OrderHistory', {data: Data.id});
            }}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="clipboard-outline"
                color={constant.mediumTxt}
                size={25}
              />
              <Text style={styles.featureTxt}>Order History</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              color={constant.mediumTxt}
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.feature}
            onPress={() => {
              LogOutAlertOccurred('Warning', 'Are You Sure?', 'yes', 'No');
            }}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="log-out-outline"
                color={constant.mediumTxt}
                size={25}
              />
              <Text style={styles.featureTxt}>Log Out</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              color={constant.mediumTxt}
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.feature}
            onPress={() => {
              // removeAllItem();
              // DeleteAccount();
              AlertOccurred('Warning', 'Are You Sure?', 'yes', 'No');
            }}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="trash-outline"
                color={constant.mediumTxt}
                size={25}
              />
              <Text style={styles.featureTxt}>Delete Account</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              color={constant.mediumTxt}
              size={25}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    // justifyContent:'center',
    alignItems: 'center',
  },
  nameView: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
    width: '100%',
  },
  imgStyle: {
    height: 90,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
    color: '#CB1F2C',
  },
  editBtnView: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 10,
    backgroundColor: '#CB1F2C',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  editBtnTxt: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  layoutView: {
    // alignItems:'center',
    padding: 25,
    width: '90%',
    height: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  feature: {
    paddingVertical: 10,
    // backgroundColor: '#e6e6e6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  featureTxt: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginHorizontal: 25,
    color: constant.mediumTxt,
  },
  headerView: {
    height: 40,
    width: '100%',
    paddingHorizontal: 25,
    marginTop: Platform.OS === 'android' ? 15 : 10,
  },
  navItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '55%',
  },
});
export default ProfileScreen;
