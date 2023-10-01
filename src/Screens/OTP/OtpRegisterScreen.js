import React, {useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import logoIcon from '../../../assets/images/Insert_block-rafiki.png';
import constant from '../../constant/constant';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import AuthService from '../../Services/AuthService';
import Spinner from 'react-native-loading-spinner-overlay';
import AlertService from '../../Services/AlertService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AuthContext from '../../context/AuthContext';
import ApiLoader from '../../components/ApiLoader';
import {CartState} from '../../context/CartContext';
import UserService from '../../Services/UserService';

const OtpRegisterScreen = ({navigation, route}) => {

  
  const RouteData = route.params.data;
  const {
    state,
    cartItem,
    addItem,
    increment,
    decrement,
    deleteItem,
    totalPrice,
    resID,
    resDis,
    service,
    resCondition,
  } = CartState();


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
  const [Loader, setLoader] = useState(false);

  useEffect(() => {
    return () => {
      console.log('previous page data', route.params.data);
    };
  }, []);
  const OtpSchema = Yup.object().shape({
    otp: Yup.string()
      .min(4, 'Please enter valid OTP')
      .required('Please enter valid OTP'),
  });
  const FormRef = useRef(null);
  const {authContext, AppUserData} = React.useContext(AuthContext);
  const SubmitFrom = values => {
    let data = {
      email:
        route.params.data.email == undefined || null
          ? route.params.data.userData.email
          : route.params.data.email,
      otp: values.otp,
    };

    console.log('OTP Verification Data==>', data);
    AuthService.Post('user/activate-user', data)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        
        if (response.error == false) {

          authContext.signIn({
            token: response.data.token,
            data: route.params.data,
          });

          // authContext.signIn({
          //   token: response.data.token,
          //   data: route.params.data,
          // });
          console.log('000000')
          console.log(route.params.data.from);
          console.log('11111111')

         if (route.params.data.from === 'cart') {
          OrderPlace(response.data.token, response.data.userid);
          } else {
           // navigation.navigate('WelcomeScreen');
            navigation.navigate('HomeStackNavigator', {
              screen: 'Home',
            });
          }

         


        //  if (route.params.data.from === 'cart') {
           // navigation.navigate('LoginScreen', {
           //   data: route.params.data.cartData,
          //  });
        //  } else {
           // navigation.navigate('WelcomeScreen');
         // }

          // AlertService.successAlert(response.message);
          AlertOccurred('Success', response.message, 'ok');
        } else {
          setLoader(false);
          console.log('Error', response.message);

          // AlertService.dangerAlert(JSON.stringify(response.message));
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



  const previousPageData =
    route.params == undefined ? null : route.params.data.productData;
  let resID1 = previousPageData == null ? null : previousPageData.restaurantID;
  const restaurantID = resID1 == undefined ? null : resID1;
  const NewTotalPrice =
    route.params == undefined ? null : route.params.data.amountPayable;
  const UpdatedNewTotalPrice =
    route.params == undefined ? null : route.params.data.newAmountPayable;

  const DiscountType =
    route.params == undefined ? null : route.params.data.discountType;
  const DiscountVal =
    route.params == undefined ? null : route.params.data.discountVal;
  const CouponCode =
    route.params == undefined ? null : route.params.data.couponCode;
  const CouponVal =
    route.params == undefined ? null : route.params.data.couponVal;
   
  const [Secure, setSecure] = useState(true);
 

  const OrderPlace = (userToken, userID) => {
    console.log('User Token', userToken);
    // console.log('User ID', userID);
    setLoader(true);
    if (totalPrice === null || cartItem.length === 0) {
      return;
    }

    let orderItems = [];
    cartItem.map(data => {
      // console.log('Cart Data', data);
      orderItems.push({
        restaurant_name: data.restaurant_name,
        item_name: data.item_name,
        item_price: data.price,
        quantity: data.qty,
        choices: data.choicesAvailable === 'No' ? null : data.choice,
      });
    });
    // console.log('OrderItems', orderItems);

    let data = {
      restaurant_id:route.params.data.cartData.productData.restaurantID,
      payment_status: 'pending',
      discount_type: route.params.data.cartData.discountType,
      discount_val: route.params.data.cartData.discountVal,
      coupon_code: route.params.data.cartData.coupon_code,
      coupon_val: route.params.data.cartData.couponVal,
      total_amount: totalPrice,
      amount_payable:route.params.data.cartData.amountPayable,
      // user_id: userID,
      order_status: 'pending',
      discount_type:route.params.data.cartData.discountType,
      service_type: route.params.data.cartData.productData.service,
      special_instruction: route.params.data.cartData.instruction,
      allergy_info: route.params.data.cartData.allergy,
      order_item: orderItems,
    };
    console.log('Order Place Data', data);
    let token = userToken;
    console.log('API Data', data);
    UserService.Post('orders/order-place', data, token)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          let orderDetails = {
            orderID: response.data.OrderId,
            resID: route.params.data.cartData.productData.restaurantID,
          };

          //console.log('Res123123123ponse=>', data.service_type);

          if (data.service_type == 'pickup') 
          {
           navigation.navigate('DetailsCartScreenCollection', {
             data: orderDetails,
            })
          }
          else{
            navigation.navigate('DetailsCartScreen', {
              data: orderDetails,
            })
          }
         // navigation.navigate('DetailsCartScreen', {
            //data: orderDetails,
          //});
        } else {
          setLoader(false);
          console.log('Error', response.message);

          AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
          // setDiscountCode('');
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




  const ResendOtp = () => {
    setLoader(true);
    let data = {
      email:
        route.params.data.email == undefined || null
          ? route.params.data.userData.email
          : route.params.data.email,
    };

    console.log('OTP Verification Data==>', data);
    AuthService.Post('user/resendOtp-registration', data)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          // AlertService.successAlert(response.message);
          AlertOccurred('Success', response.message, 'ok');
        } else {
          setLoader(false);
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

  return (
    Loader == true ? (
      <ApiLoader />):<SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{paddingLeft: 10, marginTop: 10}}>
          <Ionicons
            name={'chevron-back'}
            color={constant.mediumTxt}
            size={25}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.imgView}>
        <Image
          source={require('../../../assets/images/OTP.png')}
          resizeMode="contain"
          style={styles.logoStyle}
        />
      </View>
      <KeyboardAwareScrollView style={{flex: 1}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            width: '80%',
            paddingHorizontal: 10,
            marginTop: 20,
          }}>
          <Text style={styles.textStyle}>
            Enter 4 digit code sent to your Email
          </Text>
        </View>

        <View>
          <Formik
            innerRef={FormRef}
            validationSchema={OtpSchema}
            initialValues={{otp: ''}}
            onSubmit={values => {
              SubmitFrom(values);
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldTouched,
              isValid,
            }) => (
              <View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={styles.otpContainer}>
                    <SmoothPinCodeInput
                      placeholder=""
                      editable={true}
                      autoFocus={true}
                      cellStyle={{
                        borderBottomWidth: 2,
                        borderColor: 'gray',
                      }}
                      cellStyleFocused={{
                        borderColor: constant.BgPrimary,
                      }}
                      cellSpacing={30}
                      value={values.otp}
                      onTextChange={handleChange('otp')}
                      textStyle={{color: constant.BgPrimary, fontSize: 24}}
                    />
                    {errors.otp && touched.otp ? (
                      <Text style={styles.errorLabel}>{errors.otp}</Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      // console.log('Nothing is happening');
                      handleSubmit();
                    }}
                    style={styles.subBtn}>
                    <Text style={styles.subBtnTxt}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Poppins-Regular',
            textAlign: 'center',
            marginTop: 10,
            color: constant.normalTxt,
          }}>
          Didn’t receive a verification code?
        </Text>
        <View style={styles.codeView}>
          <TouchableOpacity
            onPress={() => {
              ResendOtp();
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: constant.BgPrimary,
              }}>
              Resend code |
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('RegisterScreen');
              navigation.goBack();
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                left: 5,
                color: constant.BgPrimary,
              }}>
              Change Email
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  backIconStyle: {
    marginTop: 20,
  },
  imgView: {
    height: '40%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  logoStyle: {
    height: '60%',
    width: '60%',
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  inputView: {
    marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '80%',
    paddingHorizontal: 10,
  },
  inputStyle: {
    height: 50,
    width: 50,
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  subBtn: {
    marginVertical: 5,
    height: 45,
    width: '80%',
    backgroundColor: '#CB1F2C',
    justifyContent: 'center',
    borderRadius: 25,
    alignSelf: 'center',
    alignItems: 'center',
  },
  subBtnTxt: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    textAlign: 'center',
  },
  codeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },

  otpContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  errorLabel: {
    color: constant.error,
    marginVertical: 5,
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
});
export default OtpRegisterScreen;
