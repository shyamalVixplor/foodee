import React, {useState, useEffect, useRef} from 'react';
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
  Keyboard,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import checkIcon from '../../../assets/images/check.png';
import eyeIcon from '../../../assets/images/eye.png';
import fabIcon from '../../../assets/images/fbIcon.png';
import googleIcon from '../../../assets/images/google.png';
import appleIcon from '../../../assets/images/apple.png';
import bgImage from '../../../assets/images/bgImage.png';
import {useNavigation} from '@react-navigation/native';
import {Formik, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import jwt_decode from 'jwt-decode';
import AuthContext from '../../context/AuthContext';
import constant from '../../constant/constant';
import Feather from 'react-native-vector-icons/Feather';
import Spinner from 'react-native-loading-spinner-overlay';
import AlertService from '../../Services/AlertService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthService from '../../Services/AuthService';
import {CartState} from '../../context/CartContext';
import UserService from '../../Services/UserService';
import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import ApiLoader from '../../components/ApiLoader';

const LoginScreen = ({navigation, route}) => {
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
  const FBLogin = resCallBack => {
    LoginManager.logOut();
    return LoginManager.logInWithPermissions(['email', 'public_profile']).then(
      result => {
        console.log('FB result===>', result);
        if (
          result.declinedPermissions &&
          result.declinedPermissions.includes('email')
        ) {
          resCallBack({message: 'Email is required'});
        }
        if (result.isCancelled) {
          console.log('error');
        } else {
          const infoRequest = new GraphRequest(
            '/me?fields=email,name,picture',
            null,
            resCallBack,
          );

          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      function (error) {
        console.log('Login Failed with error', error);
      },
    );
  };

  const onFBLogin = async () => {
    try {
      await FBLogin(_responseInfoCallBack);
    } catch (error) {
      console.log('Error Raised', error);
    }
  };

  const _responseInfoCallBack = async (error, result) => {
    if (error) {
      console.log('Error On Top', err);
      return;
    } else {
      const userFBData = result;
      console.log('User FB Data', userFBData);
      handleFBLogin(userFBData);
    }
  };
  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  const GoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info Found==>', userInfo);
      handleGoogleLogin(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Error During Google Login', error);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Error During Google Login', error);
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Error During Google Login', error);
        // play services not available or outdated
      } else {
        console.log('Error During Google Login', error);
        // some other error happened
      }
    }
  };

  const handleGoogleLogin = values => {
    setLoader(true);
    let userIfo = values.user;
    console.log('Google Values', userIfo);
    let data = {
      givenName: userIfo.givenName,
      familyName: userIfo.familyName,
      email: userIfo.email,
    };
    console.log('handleGoogleLogin Data', data);
    AuthService.Post('general/googleuser-check', data)
      .then(res => {
        setLoader(false);
        console.log('Google LOGIN=>', res);
        console.log('Google LOGIN User Token=>', res.data.token);
        // console.log('Google LOGIN User Data=>', res.data.user_details.id);
        if (res.error == false) {
          authContext.signIn({
            token: res.data.token,
          });
          // AlertService.successAlert(res.message);
          OrderPlace(res.data.token, res.data.user_details.id);
          // navigation.navigate('HomeStackNavigator', {
          //   screen: 'Home',
          // });
        } else {
          setLoader(false);
          console.log('Error==>', res.message);

          // AlertService.dangerAlert(res.message);
          AlertOccurred('Alert', res.message, 'ok');
        }
      })
      .catch(error => {
        setLoader(false);
        // return;
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

  const handleFBLogin = values => {
    setLoader(true);
    let nameArray = values.name.split(' ');
    console.log('nameArray', nameArray);
    let data = {
      first_name: nameArray[0],
      last_name: nameArray[1],
      email: values.email,
    };
    console.log('handleFBLogin Data', data);
    // return;
    AuthService.Post('general/fbuser-check', data)
      .then(res => {
        setLoader(false);
        console.log('FB user response', res);
        console.log('FB LOGIN User Token=>', res.data.token);
        console.log('FB LOGIN User ID=>', res.data.user_details.id);
        // return;
        if (res.error == false) {
          authContext.signIn({
            token: res.data.token,
          });
          OrderPlace(res.data.token, res.data.user_details.id);
          // navigation.navigate('HomeStackNavigator', {
          //   screen: 'Home',
          // });
        } else {
          setLoader(false);
          console.log('Error==>', res.message);

          // AlertService.dangerAlert(res.message);
          AlertOccurred('Alert', 'res.message', 'ok');
        }
      })
      .catch(error => {
        setLoader(false);
        // return;
        console.log('response data error', error);
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

  async function AppleLogin() {
    const appleRes = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    console.log('Apple Login response', appleRes);
    if (appleRes.email == null) {
      const jwtDecode = jwt_decode(appleRes.identityToken);
      // console.log('jwtDecode', jwtDecode);
      // AlertOccurred('Alert', `${jwtDecode.email}`, 'ok');
      let RequestObj = {
        first_name: appleRes.fullName?.givenName,
        last_name: appleRes.fullName?.familyName,
        email: jwtDecode.email,
      };

      console.log('Api RequestObj', RequestObj);
      handleAppleLogin(RequestObj);
      return;
    } else {
      let RequestObj = {
        first_name: appleRes.fullName.givenName,
        last_name: appleRes.fullName.familyName,
        email: appleRes.email,
      };

      console.log('Api RequestObj', RequestObj);
      handleAppleLogin(RequestObj);
    }
    // // get current authentication state for user
    // // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    // const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    // // use credentialState response to ensure the user is authenticated
    // if (credentialState === appleAuth.State.AUTHORIZED) {
    //   // user is authenticated
    // }
  }

  const handleAppleLogin = values => {
    setLoader(true);
    let data = values;
    console.log('handleAppleLogin Data', values);
    // return;
    AuthService.Post('general/appleuser-check', data)
      .then(res => {
        setLoader(false);
        console.log('FB user response', res);
        console.log('FB LOGIN User Token=>', res.data.token);
        console.log('FB LOGIN User ID=>', res.data.user_details.id);
        // return;
        if (res.error == false) {
          authContext.signIn({
            token: res.data.token,
          });
          OrderPlace(res.data.token, res.data.user_details.id);
          // navigation.navigate('HomeStackNavigator', {
          //   screen: 'Home',
          // });
        } else {
          setLoader(false);
          console.log('Error==>', res.message);

          // AlertService.dangerAlert(res.message);
          AlertOccurred('Alert', res.message, 'ok');
        }
      })
      .catch(error => {
        setLoader(false);
        // return;
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
  let resID = previousPageData == null ? null : previousPageData.restaurantID;
  const restaurantID = resID == undefined ? null : resID;
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
  const [Loader, setLoader] = useState(false);
  const [Secure, setSecure] = useState(true);
  const FormRef = useRef(null);
  const {cartItem, addItem, increment, decrement, deleteItem, totalPrice} =
    CartState();
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .test('Email', 'Enter a valid email address', values => {
        // console.log(values);
        let emailPattern = new RegExp(
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/,
        );
        if (emailPattern.test(values)) {
          return true;
        } else {
          return false;
        }
      }),
    password: Yup.string()
      .min(5, 'Minimum length 5 characters')
      .required('Password is required'),
  });
  const {authContext, AppUserData} = React.useContext(AuthContext);
  const handleSecureTextEntry = () => {
    setSecure(!Secure);
  };
  const handleLogin = values => {
    let data = {
      email: values.email,
      password: values.password,
    };
    // let email = values.email;
    // let password = values.password;
    // console.log('email', email);
    // console.log('password', password);
    console.log('LoginData', data);

    AuthService.Post('user/user-login', data)
      .then(res => {
        setLoader(false);
        console.log('Response of User Data=>', res);
        if (res.error == false) {
          let token = res.data.token;
          authContext.signIn({
            token: res.data.token,
          });
          getProfileDetails(token);

          // AlertService.successAlert(res.message);
          // navigation.navigate('DetailsCartScreen');
        } else {
          setLoader(false);
          console.log('Error==>', res.message);
          // AlertService.dangerAlert(res.message);
          AlertOccurred('Alert', res.message, 'ok');
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('response data', error);
        if (error.response) {
          // client received an error response (5xx, 4xx)
          // AlertService.dangerAlert(error.response.data.error.message);
          AlertOccurred('Alert', error.response.data.error.message);
        } else if (error.request) {
          // client never received a response, or request never left
          // AlertService.dangerAlert('Network Error');
          AlertOccurred('Alert', 'Network Error', 'ok');
          // console.log("error.request", error.request._response);
        } else {
          // anything else
          // AlertService.dangerAlert('Something Went Wrong');
          AlertOccurred('Alert', 'Something went wrong', 'ok');
        }
      });
  };

  const getProfileDetails = userToken => {
    let token = userToken;
    setLoader(true);
    UserService.Post('user/user-profile', {}, token)
      .then(response => {
        setLoader(false);
        // console.log('Response=>', response);
        if (response.error == false) {
          let profileData = response.data.profile;
          if (userToken && profileData.id) {
            OrderPlace(userToken, profileData.id);
          }
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          // setData({});

          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('response data', error);
        if (error.response) {
          // client received an error response (5xx, 4xx)
          // AlertService.dangerAlert(error.response.data.error.message);
          AlertOccurred('Alert', error.response.data.error.message);
        } else if (error.request) {
          // client never received a response, or request never left
          // AlertService.dangerAlert('Network Error');
          AlertOccurred('Alert', 'Network Error', 'ok');
          // console.log("error.request", error.request._response);
        } else {
          // anything else
          // AlertService.dangerAlert('Something Went Wrong');
          AlertOccurred('Alert', 'Something went wrong', 'ok');
        }
      });
  };
  useEffect(() => {
    console.log('Previous page Data', route.params);
    console.log('Full Cart', cartItem);
  }, []);

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
      restaurant_id:
        previousPageData == null ? null : previousPageData.restaurantID,
      payment_status: 'pending',
      discount_type: DiscountType,
      discount_val: DiscountVal,
      coupon_code: route.params.data.coupon_code,
      coupon_val: CouponVal,
      total_amount: totalPrice,
      amount_payable:
        UpdatedNewTotalPrice == undefined || null
          ? NewTotalPrice
          : UpdatedNewTotalPrice,
      // user_id: userID,
      order_status: 'pending',
      discount_type:
        previousPageData == null ? null : previousPageData.discountType,
      service_type: previousPageData == null ? null : previousPageData.service,
      special_instruction: route.params.data.instruction,
      allergy_info: route.params.data.allergy,
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
            resID: restaurantID,
          };

          console.log('Res123123123ponse=>', data.service_type);

          

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

  const GuestOrderPlace = () => {
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
    console.log('OrderItems', orderItems);
    let data = {
      restaurant_id:
        previousPageData == null ? null : previousPageData.restaurantID,
      payment_status: 'pending',
      discount_type: DiscountType,
      discount_val: DiscountVal,
      coupon_code: route.params.data.coupon_code,
      coupon_val: CouponVal,
      total_amount: totalPrice,
      amount_payable:
        UpdatedNewTotalPrice == undefined || null
          ? NewTotalPrice
          : UpdatedNewTotalPrice,
      order_status: 'pending',
      discount_type:
        previousPageData == null ? null : previousPageData.discountType,
      service_type: previousPageData == null ? null : previousPageData.service,
      special_instruction: route.params.data.instruction,
      allergy_info: route.params.data.allergy,
      order_item: orderItems,
    };
    console.log('Order Place Data', data);
    UserService.GuestPost('orders/order-place', data)
      .then(response => {
        setLoader(false);
        console.log('Guest Order Response =>', response);
        if (response.error == false) {
          let orderDetails = {
            orderID: response.data.OrderId,
            resID: restaurantID,
          };
          
          if (data.service_type == 'pickup') 
          {
           navigation.navigate('DetailsCartScreenCollection', {
             data: orderDetails,
             userType:'Guest',
            })
          }
          else{
            navigation.navigate('DetailsCartScreen', {
              data: orderDetails,
              userType:'Guest',
            })
          }
 

        } else {
          setLoader(false);
          console.log('Error', response.message);

          // AlertService.dangerAlert(response.message);
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

  return (
    <ImageBackground source={bgImage} style={styles.bgImageStyle}>
      {/* <Spinner
        visible={Loader}
        textContent={'Loading...'}
        textSt
        yle={{ color: '#fff' }}
      /> */}
      {Loader == true ? (
        <ApiLoader />
      ) : (
        <SafeAreaView style={styles.container}>
          <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
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
                  Login
                </Text>
              </View>
            </View>
            <View>
              <Formik
                innerRef={FormRef}
                validationSchema={LoginSchema}
                initialValues={{
                  email: '',
                  password: '',
                }}
                onSubmit={values => {
                  handleLogin(values);
                  // console.log('Value Entered', values);
                }}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldTouched,
                  setFieldValue,
                  isValid,
                }) => (
                  <View>
                    <View style={styles.outerViewStyle}>
                      <TextInput
                        placeholder={'Your Email'}
                        keyboardType="email-address"
                        onChangeText={handleChange('email')}
                        value={values.email}
                        placeholderTextColor={constant.txtColor}
                        style={styles.inputStyle}
                        autoCapitalize="none"
                      />
                      {values.email !== '' ? (
                        <Feather
                          name="check"
                          size={20}
                          color={constant.BgPrimary}
                        />
                      ) : null}
                    </View>
                    {errors.email && touched.email ? (
                      <View style={{width: '75%', alignSelf: 'center'}}>
                        <Text style={styles.errorLabel}>{errors.email}</Text>
                      </View>
                    ) : null}
                    <View style={styles.outerViewStyle}>
                      <TextInput
                        placeholder={'Password'}
                        secureTextEntry={Secure}
                        onChangeText={handleChange('password')}
                        value={values.password}
                        placeholderTextColor={constant.txtColor}
                        style={styles.inputStyle}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          handleSecureTextEntry();
                        }}>
                        {Secure ? (
                          <Feather
                            name="eye"
                            size={20}
                            color={constant.BgPrimary}
                          />
                        ) : (
                          <Feather
                            name="eye-off"
                            size={20}
                            color={constant.BgPrimary}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                    {errors.password && touched.password ? (
                      <View style={{width: '75%', alignSelf: 'center'}}>
                        <Text style={styles.errorLabel}>{errors.password}</Text>
                      </View>
                    ) : null}

                    <TouchableOpacity
                      onPress={() => {
                        Keyboard.dismiss();
                        if (route.params.data === 'fromReset') {
                          navigation.navigate('HomeStackNavigator', {
                            screen: 'Home',
                          });
                        } else {
                          handleSubmit();
                        }
                      }}
                      style={styles.loginBtn}>
                      <Text style={styles.loginBtnTxt}>Login</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            </View>
            <TouchableOpacity
              onPress={() => {
                let pageData = {
                  cartData: route.params.data ? route.params.data : null,
                  from: 'FromCart',
                };
                navigation.navigate('ForgotPasswordScreen', {data: pageData});
              }}
              style={styles.forgotBtn}>
              <Text style={styles.forgotBtnTxt}>Forgot Your Password ?</Text>
            </TouchableOpacity>
            <View style={styles.accBtn}>
              <Text style={styles.accBtnTxt}>Create Your Account</Text>
              <TouchableOpacity
                onPress={() => {
                  let AllData = route.params.data;
                  navigation.navigate('RegisterScreen', {data: AllData});
                }}>
                <Text
                  style={[
                    styles.forgotBtnTxt,
                    {color: constant.BgPrimary, marginLeft: 5, fontSize: 14},
                  ]}>
                  Register Now
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.loginTxt}>Login With</Text>
            <View style={styles.socialIconStyle}>
              <TouchableOpacity
                style={styles.fabView}
                onPress={() => {
                  onFBLogin();
                }}>
                <Text style={styles.textStyle}>Facebook</Text>
                <Image
                  source={fabIcon}
                  resizeMode="contain"
                  style={styles.fabIconStyle}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.googleView}
                onPress={() => {
                  GoogleLogin();
                }}>
                <Text style={styles.textStyle}>Google</Text>
                <Image
                  source={googleIcon}
                  resizeMode="contain"
                  style={styles.googleIconStyle}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.appleView}
              onPress={() => {
                AppleLogin();
              }}>
              <Text style={styles.textStyle}>Apple</Text>
              <Image
                source={appleIcon}
                resizeMode="contain"
                style={styles.googleIconStyle}
              />
            </TouchableOpacity>
            <View
              style={{
                width: '90%',
                marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  textAlign: 'center',
                  color: constant.txtColor,
                  fontFamily: 'Poppins-Medium',
                }}>
                By clicking on either facebook or google, you agree to our terms
                and conditions.
              </Text>
            </View>
            <View style={styles.orStyleView}>
              <Text style={styles.orStyleText}>OR</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                GuestOrderPlace();
              }}
              style={styles.loginBtn}>
              <Text style={styles.loginBtnTxt}>Checkout As Guest</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      )}
    </ImageBackground>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImageStyle: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 30,
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
    marginTop: 10,
  },
  inputStyle: {
    color: '#666666',
    height: 45,
    width: '93%',
    paddingLeft: 12,
    fontFamily: 'Poppins-Medium',
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
    marginTop: 10,
  },
  loginBtnTxt: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  forgotBtn: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  forgotBtnTxt: {
    fontSize: 16,
    fontWeight: '500',
    color: constant.BgPrimary,
    fontFamily: 'Poppins-Medium',
  },
  accBtn: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  accBtnTxt: {
    fontSize: 14,
    fontWeight: '500',
    color: constant.txtColor,
    fontFamily: 'Poppins-Medium',
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
    fontFamily: 'Poppins-Regular',
  },
  socialIconStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
    marginVertical: 8,
  },
  fabView: {
    flexDirection: 'row',
    paddingVertical: 11,
    width: '48%',
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
    fontFamily: 'Poppins-Medium',
  },
  googleView: {
    flexDirection: 'row',
    paddingVertical: 11,
    width: '48%',
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
  },
  googleIconStyle: {
    height: 23,
    width: 23,
    alignSelf: 'center',
    left: 4,
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
    marginVertical: 5,
    fontFamily: 'Poppins-Medium',
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
  appleView: {
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    paddingVertical: 11,
    width: '48%',
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
});
