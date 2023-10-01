import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ScrollView,
  Alert,
  Keyboard,
  BackHandler,
} from 'react-native';
import lock from '../../../assets/images/lockIcon.png';
import checkIcon from '../../../assets/images/check.png';
import bgImage from '../../../assets/images/bgImage.png';
import {URL} from '../../api/api';
import constant from '../../constant/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {Formik, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import AlertService from '../../Services/AlertService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AuthService from '../../Services/AuthService';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import ApiLoader from '../../components/ApiLoader';

// const apiUrl = URL;
const ResetPasswordScreen = ({navigation, route}) => {
  console.log('previous page data', route.params.data);
  const [Loader, setLoader] = useState(false);
  const [Secure, setSecure] = useState(true);
  const [SecurePass, setSecurePass] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (route.name === 'ResetPasswordScreen') {
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
  const ForgotPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(5, 'Minimum length 5 characters')
      .required('Password is required'),
    verifypassword: Yup.string()
      .min(5, 'Minimum length 5 characters')
      .required('Confirm password is required'),
  });
  const SubmitFrom = values => {
    let email = route.params.data.email;
    let data = {
      email: email,
      password: values.password,
      verifypassword: values.verifypassword,
    };

    console.log('OTP Verification Data==>', data);
    AuthService.Post('user/reset-password', data)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          navigation.navigate('SuccessScreen', {data: route.params.data.flag});
          // AlertService.successAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
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

  const updateSecureTextEntry = () => {
    setSecure(!Secure);
  };

  const handleSecureTextEntry = () => {
    setSecurePass(!SecurePass);
  };
  return (
    Loader == true ? (
      <ApiLoader />):<ImageBackground source={bgImage} style={styles.bgImageStyle}>
      <SafeAreaView style={styles.container}>
        {/* <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{paddingLeft: 10, marginTop: 10}}>
            <Ionicons
              name={'ios-chevron-back'}
              color={constant.mediumTxt}
              size={25}
            />
          </TouchableOpacity>
        </View> */}
        <View style={styles.imgView}>
          <Image
            source={require('../../../assets/images/OTP.png')}
            resizeMode="contain"
            style={styles.logoStyle}
          />
        </View>
        <View style={styles.textView}>
          <Text style={styles.textStyle}>Reset Your</Text>
          <Text style={styles.textStyle}>Password?</Text>
        </View>
        <View style={styles.textViewCheck}>
          <Text style={styles.textStyleCheck}>
            Enter your registered email below
          </Text>
          {/* <Text style={styles.textStyleCheck}>your Password</Text> */}
        </View>
        <KeyboardAwareScrollView>
          <View>
            <Formik
              // innerRef={FormRef}
              validationSchema={ForgotPasswordSchema}
              initialValues={{password: '', verifypassword: ''}}
              onSubmit={values => {
                SubmitFrom(values);
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
                      placeholder={'Password'}
                      secureTextEntry={Secure}
                      onChangeText={handleChange('password')}
                      value={values.password}
                      placeholderTextColor={constant.txtColor}
                      style={styles.inputStyle}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        updateSecureTextEntry();
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

                  <View style={styles.outerViewStyle}>
                    <TextInput
                      placeholder={'Confirm Password'}
                      secureTextEntry={SecurePass}
                      onChangeText={handleChange('verifypassword')}
                      value={values.verifypassword}
                      placeholderTextColor={constant.txtColor}
                      style={styles.inputStyle}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        handleSecureTextEntry();
                      }}>
                      {SecurePass ? (
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
                  {errors.verifypassword && touched.verifypassword ? (
                    <View style={{width: '75%', alignSelf: 'center'}}>
                      <Text style={styles.errorLabel}>
                        {errors.verifypassword}
                      </Text>
                    </View>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss();
                      // navigation.navigate('BottomTabs');
                      handleSubmit();
                    }}
                    style={styles.loginBtn}>
                    <Text style={styles.loginBtnTxt}>Reset Password</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  bgImageStyle: {
    width: '100%',
    height: '100%',
  },
  imgView: {
    height: '40%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  lockView: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 80,
    width: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    borderWidth: 0.8,
    borderColor: '#d9d9d9',
  },
  logoStyle: {
    height: '60%',
    width: '60%',
    alignSelf: 'center',
  },
  lockIconStyle: {
    height: 30,
    width: 30,
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
  },
  textView: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  textViewCheck: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  textStyleCheck: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
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
    color: constant.txtColor,
    height: 45,
    width: '93%',
    paddingLeft: 12,
  },
  checkIconStyle: {
    height: 18,
    width: 18,
    tintColor: constant.BgPrimary,
    alignSelf: 'center',
  },
  loginBtn: {
    height: 45,
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: constant.BgPrimary,
    borderRadius: 20,
    marginTop: 20,
  },
  loginBtnTxt: {
    fontSize: 17,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
  errorLabel: {
    color: constant.error,
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
});
export default ResetPasswordScreen;
