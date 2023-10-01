import React, {useRef,useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ScrollView,
  Keyboard,
  Alert,
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

const OtpScreen = ({navigation, route}) => {
  useEffect(() => {
    return () => {
      console.log('previous page data', route.params);
      console.log('EmailId', route.params.data.email);
      console.log('previous page Flag data', route.params.data.prevData);
      // const EmailId = route.params.data.email;
    };
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

  const OtpSchema = Yup.object().shape({
    otp: Yup.string()
      .min(4, 'Please enter valid OTP')
      .required('Please enter valid OTP'),
  });
  const FormRef = useRef(null);

  const SubmitFrom = values => {
    let email = route.params.data.email;
    let data = {
      email: email,
      otp: values.otp,
    };
    console.log('OTP Verification Data==>', data);
    // return;
    AuthService.Post('user/reset-password-otp', data)
      .then(response => {
        console.log('Response=>', response);
        if (response.error == false) {
          let tempData = {
            email: route.params.data.email,
            flag:
              route.params.data.flag == undefined
                ? route.params.data.prevData
                : route.params.data.flag,
          };
          navigation.navigate('ResetPasswordScreen', {
            data: tempData,
          });
          // AlertService.successAlert(response.message);
        } else {
          console.log('Error', response.message);

          // AlertService.dangerAlert(JSON.stringify(response.message.email));
          AlertOccurred('Alert', response.message, 'ok');
        }
      })
      .catch(error => {
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

  const ResendOTP = () => {
    // setLoader(true);
    let data = {
      email: route.params.data.email,
    };

    console.log('OTP Verification Data==>', data);
    AuthService.Post('user/resendOtp-password', data)
      .then(response => {
        // setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          let tempData = {
            flag: route.params.data,
            email: route.params.data.email,
          };
          navigation.navigate('OtpScreen', {
            data: tempData,
          });
          // AlertService.successAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
        } else {
          // setLoader(false);
          console.log('Error', response.message);

          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
        }
      })
      .catch(error => {
        // setLoader(false);
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
                      //   autoFocus={true}
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
                      //   navigation.navigate('ResetPasswordScreen');
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
              ResendOTP();
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: constant.BgPrimary,
              }}>
              Resend OTP |
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CartScreen');
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
export default OtpScreen;
