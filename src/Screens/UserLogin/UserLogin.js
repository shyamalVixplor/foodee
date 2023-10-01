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
  ScrollView,
  Keyboard,
  Alert,
} from 'react-native';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import jwt_decode from 'jwt-decode';
import eyeIcon from '../../../assets/images/eye.png';
import fabIcon from '../../../assets/images/fbIcon.png';
import googleIcon from '../../../assets/images/google.png';
import appleIcon from '../../../assets/images/apple.png';
import bgImage from '../../../assets/images/bgImage.png';
import {useNavigation} from '@react-navigation/native';
import {Formik, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import AuthContext from '../../context/AuthContext';
import constant from '../../constant/constant';
import Feather from 'react-native-vector-icons/Feather';
import Spinner from 'react-native-loading-spinner-overlay';
import AlertService from '../../Services/AlertService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AuthService from '../../Services/AuthService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
import ApiLoader from '../../components/ApiLoader';

const UserLoginScreen = ({navigation}) => {
  const [Loader, setLoader] = useState(false);
  const [Secure, setSecure] = useState(true);
  const {authContext, AppUserData} = React.useContext(AuthContext);

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

  const FormRef = useRef(null);
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

    AuthService.Post('user/user-login', data)
      .then(res => {
        setLoader(false);
        console.log('Response=>', res);
        if (res.error == false) {
          authContext.signIn({
            token: res.data.token,
          });
          // AlertService.successAlert(res.message);
          navigation.navigate('HomeStackNavigator', {
            screen: 'Home',
          });
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
        console.log('response data', JSON.stringify(error));
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
        console.log('FB LOGIN Response=>', res);
        let userToken = res.data.token;
        // console.log('FB LOGIN User Token=>', userToken);
        if (res.error == false) {
          authContext.signIn({
            token: userToken,
          });
          // AlertService.successAlert(res.message);
          navigation.navigate('HomeStackNavigator', {
            screen: 'Home',
          });
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
        first_name: appleRes.fullName?.givenName,
        last_name: appleRes.fullName?.familyName,
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
        console.log('FB LOGIN Response=>', res);
        let userToken = res.data.token;
        // console.log('FB LOGIN User Token=>', userToken);
        if (res.error == false) {
          authContext.signIn({
            token: userToken,
          });
          // AlertService.successAlert(res.message);
          navigation.navigate('HomeStackNavigator', {
            screen: 'Home',
          });
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

  const handleGoogleLogin = values => {
    setLoader(true);
    let userIfo = values.user;
    console.log('Google Values', userIfo);
    let data = {
      givenName: userIfo.givenName,
      familyName: userIfo.familyName,
      email: userIfo.email,
    };
    console.log('handleFBLogin Data', data);
    AuthService.Post('general/googleuser-check', data)
      .then(res => {
        setLoader(false);
        console.log('Google  LOGIN Response=>', res);
        let userToken = res.data.token;
        console.log('FB LOGIN User Token=>', userToken);
        if (res.error == false) {
          authContext.signIn({
            token: userToken,
          });
          // AlertService.successAlert(res.message);
          navigation.navigate('HomeStackNavigator', {
            screen: 'Home',
          });
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

  return Loader == true ? (
    <ApiLoader />
  ) : (
    <ImageBackground source={bgImage} style={styles.bgImageStyle}>
      <SafeAreaView style={styles.container}>
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
        <ScrollView>
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
                      {Secure == false ? (
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
                      // navigation.navigate('BottomTabs');
                      handleSubmit();
                    }}
                    style={styles.loginBtn}>
                    <Text style={styles.loginBtnTxt}>Login</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ForgotPasswordScreen', {data: 'FromProfile'})
            }
            style={styles.forgotBtn}>
            <Text style={styles.forgotBtnTxt}>Forgot Your Password ?</Text>
          </TouchableOpacity>

          <View style={styles.orStyleView}>
            <Text style={styles.orStyleText}>OR</Text>
          </View>
          <View style={styles.accBtn}>
            <Text style={styles.accBtnTxt}>Create Your Account</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('UserRegisterScreen');
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
          {/* <Text style={styles.loginTxt}>Login Via</Text> */}
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
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default UserLoginScreen;
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
    marginTop: 20,
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

  appleView: {
    alignSelf: 'center',
    marginTop: 20,
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
    marginTop: 10,
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