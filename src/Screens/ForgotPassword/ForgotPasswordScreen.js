import React, {useState, useEffect, useContext} from 'react';
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
  Keyboard,
  Alert,
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
import UserService from '../../Services/UserService';
import AlertService from '../../Services/AlertService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AuthService from '../../Services/AuthService';
import ApiLoader from '../../components/ApiLoader';

// const apiUrl = URL;
const ForgotPasswordScreen = ({navigation, route}) => {
  const [Loader, setLoader] = useState(false);
  const {authContext, AppUserData} = useContext(AuthContext);
  const [Data, setData] = useState([]);
  const userToken = AppUserData.token;
  useEffect(() => {
    console.log('prevData', route.params);
    console.log('User Token', userToken);
    // getProfileDetails();
  }, []);

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

  // const getProfileDetails = () => {
  //   let token = AppUserData.token;
  //   console.log('token', token);
  //   setLoader(true);
  //   UserService.Post('user/user-profile', {}, token)
  //     .then(response => {
  //       setLoader(false);
  //       console.log('Response=>', response);
  //       if (response.error == false) {
  //         setData(response.data.profile);
  //         // AlertService.successAlert(response.message);
  //       } else {
  //         setLoader(false);
  //         console.log('Error', response.message);
  //         setData({});

  //         // AlertService.dangerAlert(response.message);
  //       }
  //     })
  //     .catch(error => {
  //       setLoader(false);
  //       console.log('response data', error);
  //       if (error.response) {
  //         // client received an error response (5xx, 4xx)
  //         AlertService.dangerAlert(error.response.data.error.message);
  //       } else if (error.request) {
  //         // client never received a response, or request never left
  //         AlertService.dangerAlert('Network Error');
  //         // console.log("error.request", error.request._response);
  //       } else {
  //         // anything else
  //         AlertService.dangerAlert('Something Went Wrong');
  //       }
  //     });
  // };

  const ForgotPasswordSchema = Yup.object().shape({
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
  });
  const SubmitFrom = values => {
    setLoader(true);
    let data = {
      email: values.email,
    };

    console.log('OTP Verification Data==>', data);
    AuthService.Post('user/forget-password', data)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          let tempData = {
            prevData: route.params.data,
            email: values.email,
          };
          navigation.navigate('OtpScreen', {
            data: tempData,
          });
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
      <ApiLoader />):<ImageBackground source={bgImage} style={styles.bgImageStyle}>
      <SafeAreaView style={styles.container}>
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
        <View style={styles.textView}>
          <Text style={styles.textStyle}>Forgot Your</Text>
          <Text style={styles.textStyle}>Password?</Text>
        </View>
        <View style={styles.textViewCheck}>
          <Text style={styles.textStyleCheck}>Check your mail to Reset</Text>
          <Text style={styles.textStyleCheck}>your Password</Text>
        </View>
        <KeyboardAwareScrollView>
          <View>
            <Formik
              // innerRef={FormRef}
              validationSchema={ForgotPasswordSchema}
              initialValues={{
                email: '',
              }}
              onSubmit={values => {
                Keyboard.dismiss();
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
                      placeholder={'Your Email'}
                      keyboardType="email-address"
                      onChangeText={handleChange('email')}
                      value={values.email}
                      placeholderTextColor={constant.txtColor}
                      style={styles.inputStyle}
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
                  <TouchableOpacity
                    onPress={() => {
                      // navigation.navigate('OtpScreen')

                      handleSubmit();
                    }}
                    style={styles.loginBtn}>
                    <Text style={styles.loginBtnTxt}>Recover Password</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </KeyboardAwareScrollView>
        {/* <View style={styles.outerViewStyle}>
          <TextInput
            placeholder={'Enter Your Email'}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            //value={email}
            onChangeText={text => setEmail(text)}
            placeholderTextColor={constant.txtColor}
            style={styles.inputStyle}
          />
          <Image
            source={checkIcon}
            resizeMode="contain"
            style={styles.checkIconStyle}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('OtpScreen')}
          style={styles.loginBtn}>
          <Text style={styles.loginBtnTxt}>Send</Text>
        </TouchableOpacity> */}
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
    fontSize: 20,
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
export default ForgotPasswordScreen;
