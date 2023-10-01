import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  ToastAndroid,
  FlatList,
  Keyboard,
  Alert,
} from 'react-native';
import bgImage from '../../../assets/images/bgImage.png';
import {useNavigation} from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import AuthService from '../../Services/AuthService';
import constant from '../../constant/constant';
import Feather from 'react-native-vector-icons/Feather';
import Spinner from 'react-native-loading-spinner-overlay';
import AlertService from '../../Services/AlertService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import UserService from '../../Services/UserService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ApiLoader from '../../components/ApiLoader';

const Address = ({navigation}) => {
  const [Address, setAddress] = useState([]);
  const [Loader, setLoader] = useState(false);
  const {authContext, AppUserData} = useContext(AuthContext);
  const [AddressData, setAddressData] = useState();
  // [
  //   {
  //     id: 1,
  //     address1: '44 Simone Weil Avenue',
  //     address2: '44 Simone Weil Avenue',
  //     city: 'WATNALL',
  //     postalCode: 'NG16 5ZZ',
  //     isSelected: false,
  //   },
  //   {
  //     id: 2,
  //     address1: '47 South Western Terrace',
  //     address2: '44 Simone Weil Avenue',
  //     city: 'MILTON COMBE',
  //     postalCode: 'PL20 3BW',
  //     isSelected: false,
  //   },
  //   {
  //     id: 3,
  //     address1: '50 Prestwick Road',
  //     address2: '44 Simone Weil Avenue',
  //     city: 'INGLEBY GREENHOW',
  //     postalCode: 'TS9 8UQ',
  //     isSelected: false,
  //   },
  //   {
  //     id: 4,
  //     address1: '24 London Road',
  //     address2: '44 Simone Weil Avenue',
  //     city: 'COLNEY STREET',
  //     postalCode: 'AL2 4NN',
  //     isSelected: false,
  //   },
  //   {
  //     id: 5,
  //     address1: '38 Bury Rd',
  //     address2: '44 Simone Weil Avenue',
  //     city: 'HAMMERPOT',
  //     postalCode: 'BN16 0JQ',
  //     isSelected: false,
  //   },
  // ]

  const AlertOccurred = (title, body, btnTxt) => {
    Alert.alert(title, body, [
      {
        text: btnTxt,
        onPress: () => {
          console.log(title);
        },
      },
    ]);
  };

  useEffect(() => {
    getUserAddress();
  }, []);

  const getUserAddress = () => {
    let token = AppUserData.token;
    console.log('App User Token', token);
    setLoader(true);
    UserService.Post('user/user-address', {}, token)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          let responseData = response.data.address;
          setAddressData(responseData);
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          setAddressData([]);
          console.log('Error', response.message);
          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
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

  const DeleteAddress = id => {
    let data = {
      addressId: id,
    };

    let token = AppUserData.token;
    console.log('App User Token', token);
    setLoader(true);
    UserService.Post('user/delete-address', data, token)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          getUserAddress();
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          AlertService.dangerAlert(response.message);
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

  const renderAddresses = ({item, index}) => {
    return (
      <View
        style={{
          marginVertical: 8,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '92%',
            padding: 8,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderRadius: 10,
          }}>
          <Image
            source={require('../../../assets/images/location.png')}
            style={{height: 40, width: 40}}
          />
          <View style={{width: '70%'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: constant.regularTxt,
                }}>
                {item.address1}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                  color: constant.normalTxt,
                }}>
                {item.city}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                  color: constant.normalTxt,
                }}>
                {item.postcode}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              DeleteAddress(item.id);
            }}>
            <Ionicons
              name="trash-outline"
              color={constant.BgPrimary}
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    Loader == true ? (
      <ApiLoader />):<ImageBackground source={bgImage} style={styles.bgImageStyle}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back"
              size={25}
              color={constant.txtColor}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>User Address</Text>
          {/* <TouchableOpacity>
              <Ionicons name="ios-heart-outline" size={25} color="#fff" />
            </TouchableOpacity> */}
        </View>

        <FlatList
          style={{marginTop: 15}}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          data={AddressData}
          renderItem={renderAddresses}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Address;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  bgImageStyle: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  heading: {
    width: '80%',
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    fontWeight: '700',
    textAlign: 'center',
    alignSelf: 'center',
    color: constant.boldTxt,
  },
  subHeading: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
    color: constant.txtColor,
  },
  outerViewStyle: {
    flexDirection: 'row',
    paddingVertical: 4,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 50,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  inputStyle: {
    color: '#666666',
    height: 45,
    width: '93%',
    paddingLeft: 12,
    fontFamily: 'Poppins-Regular',
  },
  checkIconStyle: {
    height: 18,
    width: 18,
    tintColor: '#FDB100',
    alignSelf: 'center',
  },
  loginBtn: {
    paddingVertical: 13,
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: constant.BgPrimary,
    borderRadius: 50,
    marginTop: 30,
  },
  loginBtnTxt: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Poppins-Regular',
    color: 'white',
    textAlign: 'center',
  },
  forgotBtn: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  forgotBtnTxt: {
    fontSize: 16,
    fontWeight: '500',
    color: constant.BgPrimary,
  },
  accBtn: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  accBtnTxt: {
    fontSize: 14,
    fontWeight: '500',
    color: constant.txtColor,
  },
  orStyleView: {
    marginTop: 10,
    height: 40,
    width: 40,
    borderRadius: 20,
    // backgroundColor: '#FDB100',
    backgroundColor: constant.BgPrimary,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  orStyleText: {
    fontSize: 15,
    fontWeight: '400',
    color: 'white',
  },
  socialIconStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
    marginTop: 10,
  },
  fabView: {
    flexDirection: 'row',
    height: 45,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    color: constant.txtColor,
  },
  googleView: {
    flexDirection: 'row',
    height: 45,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabIconStyle: {
    height: 23,
    width: 23,
    alignSelf: 'center',
    right: 4,
  },
  googleIconStyle: {
    height: 23,
    width: 23,
    alignSelf: 'center',
    right: 4,
  },
  errorLabel: {
    color: constant.error,
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  loginTxt: {
    fontSize: 14,
    fontWeight: '400',
    color: constant.txtColor,
    textAlign: 'center',
    marginTop: 20,
  },
});
