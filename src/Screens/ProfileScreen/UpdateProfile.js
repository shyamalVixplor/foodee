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
  Keyboard,
  Alert,
} from 'react-native';
import checkIcon from '../../../assets/images/check.png';
import eyeIcon from '../../../assets/images/eye.png';
import fabIcon from '../../../assets/images/fbIcon.png';
import googleIcon from '../../../assets/images/google.png';
import bgImage from '../../../assets/images/bgImage.png';
import {useNavigation} from '@react-navigation/native';
import {Formik, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
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

const UpdateProfile = ({navigation}) => {
  const FormRef = useRef(null);
  const LoginSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(3, 'Minimum length 5 characters')
      .required('First name is required'),
    lastname: Yup.string()
      .min(3, 'Minimum length 5 characters')
      .required('Last name is required'),
    email: Yup.string()
      .required('Email address is required')
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
      phone: Yup.string()
      .required('Phone number is required')
      .max(11, 'Phone number max length should be of 11')
      .min(10, 'Phone number min length should be of 10'),
  });
  const [Secure, setSecure] = useState(true);

  useEffect(() => {
    getProfileDetails();
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

  const getProfileDetails = () => {
    let token = AppUserData.token;
    console.log('App User Token', token);
    setLoader(true);
    UserService.Post('user/user-profile', {}, token)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          let responseData = response.data.profile;
          //   setProfileData(response.data.profile);
          let firstname = responseData.firstname;
          let lastname = responseData.lastname;
          let email = responseData.email;
          let phone = responseData.phone;
          // console.log('phone ', phone);
          FormRef.current.setFieldValue(
            'firstname',
            firstname ? firstname.toString() : '',
          );
          FormRef.current.setFieldValue('email', email ? email.toString() : '');
          FormRef.current.setFieldValue(
            'lastname',
            lastname ? lastname.toString() : '',
          );
          FormRef.current.setFieldValue('phone', phone ? phone.toString() : '');
          // AlertService.successAlert(response.message);
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

  const ProfileUpdate = values => {
    let token = AppUserData.token;
    setLoader(true);
    let data = {
      firstname: values.firstname,
      lastname: values.lastname,
      phone: values.phone,
      email: values.email,
    };
    console.log('New Data', data);
    console.log('token', token);
    UserService.Post('user/update-user-profile', data, token)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          navigation.navigate('ProfileScreen');
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);

          // AlertService.dangerAlert(JSON.stringify(response.message.email));
          AlertOccurred('Alert', response.message.email, 'ok');
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
    // signIn(email, password);
  };
  const [Loader, setLoader] = useState(false);
  const {authContext, AppUserData} = useContext(AuthContext);
  const updateSecureTextEntry = () => {
    setSecure(!Secure);
  };

  return (
    Loader == true ? (
      <ApiLoader />):<ImageBackground source={bgImage} style={styles.bgImageStyle}>
      <KeyboardAwareScrollView>
        <SafeAreaView style={styles.container}>
          <View style={styles.headerView}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back"
                size={25}
                color={constant.txtColor}
              />
            </TouchableOpacity>
            <Text style={styles.heading}>Update Profile</Text>
            {/* <TouchableOpacity>
              <Ionicons name="ios-heart-outline" size={25} color="#fff" />
            </TouchableOpacity> */}
          </View>
          <Text style={styles.subHeading}>
            Add your details to update your profile.
          </Text>
          <View style={{marginTop: 30}}>
            <Formik
              innerRef={FormRef}
              validationSchema={LoginSchema}
              initialValues={{
                firstname: '',
                lastname: '',
                email: '',
                phone: '',
              }}
              onSubmit={values => {
                ProfileUpdate(values);
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
                      placeholder={'First Name'}
                      onChangeText={handleChange('firstname')}
                      value={values.firstname}
                      placeholderTextColor={constant.txtColor}
                      style={styles.inputStyle}
                    />
                  </View>
                  {errors.firstname && touched.firstname ? (
                    <View style={{width: '75%', alignSelf: 'center'}}>
                      <Text style={styles.errorLabel}>{errors.firstname}</Text>
                    </View>
                  ) : null}

                  <View style={styles.outerViewStyle}>
                    <TextInput
                      placeholder={'Last Name'}
                      onChangeText={handleChange('lastname')}
                      value={values.lastname}
                      placeholderTextColor={constant.txtColor}
                      style={styles.inputStyle}
                    />
                  </View>
                  {errors.lastname && touched.lastname ? (
                    <View style={{width: '75%', alignSelf: 'center'}}>
                      <Text style={styles.errorLabel}>{errors.lastname}</Text>
                    </View>
                  ) : null}

                  <View style={styles.outerViewStyle}>
                    <TextInput
                      placeholder={'Email'}
                      keyboardType="email-address"
                      onChangeText={handleChange('email')}
                      value={values.email}
                      placeholderTextColor={constant.txtColor}
                      style={styles.inputStyle}
                    />
                  </View>
                  {errors.email && touched.email ? (
                    <View style={{width: '75%', alignSelf: 'center'}}>
                      <Text style={styles.errorLabel}>{errors.email}</Text>
                    </View>
                  ) : null}

                  <View style={styles.outerViewStyle}>
                    <TextInput
                      placeholder={'Phone'}
                      keyboardType="phone-pad"
                      onChangeText={handleChange('phone')}
                      value={values.phone}
                      placeholderTextColor={constant.txtColor}
                      style={styles.inputStyle}
                      maxLength={11}                    />
                  </View>
                  {errors.phone && touched.phone ? (
                    <View style={{width: '75%', alignSelf: 'center'}}>
                      <Text style={styles.errorLabel}>{errors.phone}</Text>
                    </View>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => {
                      // navigation.navigate('BottomTabs');
                      handleSubmit();
                    }}
                    style={styles.loginBtn}>
                    <Text style={styles.loginBtnTxt}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default UpdateProfile;
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
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    textAlign: 'center',
    alignSelf: 'center',
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
