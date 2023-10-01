import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  ScrollView,
  FlatList,
  Alert,
  Keyboard,
} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import down_Icon from '../../../assets/images/down_arrow_nrml.png';
import cancelIcon from '../../../assets/images/crossIcon.png';
import constant from '../../constant/constant';
import GlobalColor from '../../constant/constant';
import CheckBox from '@react-native-community/checkbox';
import {Formik, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import Spinner from 'react-native-loading-spinner-overlay';
import UserService from '../../Services/UserService';
import AlertService from '../../Services/AlertService';
import AuthContext from '../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ApiLoader from '../../components/ApiLoader';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsCartScreen = ({navigation, route}) => {
  const restaurantID = route.params.data.resID;
  const orderID = route.params.data.orderID;
  const userType = route.params.userType;
  // console.log('ORder ID', orderID);
  const [MultipleAddress, setMultipleAddress] = useState([]);
  const [UserDetails, setUserDetails] = useState({});
  const [Loader, setLoader] = useState(false);
  const {authContext, AppUserData} = useContext(AuthContext);
  const [ProfileData, setProfileData] = useState({});
  const [DisplayModal, setDisplayModal] = useState(false);
  const FormRef = useRef(null);
  const [AddressData, setAddressData] = useState([]);
  const [DeliveryCharges, setDeliveryCharges] = useState([]);
  const [OrderData, setOrderData] = useState([]);
  const [OrderItem, setOrderItem] = useState([]);
  const [locationitem, setlocationitem] = useState([]);
  const [locationpostcode, setlocationpostcode] = useState([]);

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

  const showLoader = () => {
    if (!Loader) {
      setLoader(true);
    }
  };

  const stopLoader = () => {
    setLoader(false);
  };

  const getOrderDetails = () => {
    // let token = AppUserData.token;
    let data = {
      orderId: orderID,
      // orderId: 58,
    };
    console.log('Data', data);
    showLoader();
    UserService.Post('user/order-details', data)
      .then(response => {
        stopLoader();
        console.log('Order Details=>', response);
        // return;
        if (response.error == false) {
          setOrderData(response.data.order);
          setOrderItem(response.data.order_items);
          // AlertService.successAlert(response.message);
        } else {
          stopLoader();
          console.log('Error', response.message);
          setOrderData([]);
          setOrderItem([]);

          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
        }
      })
      .catch(error => {
        stopLoader();
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
  useEffect(() => {
    console.log('Order Data', route.params); 
    //AppUserData.token !== undefined ? getProfileDetails() : null; 
    getProfileDetails() ; 
    AppUserData.token !== undefined ? getUserAddress() : null; 
    getDeliveryCharges();
    getOrderDetails(); 
   
  }, []);

  const MakeWord = values => {
   
    let word = values;
    let wordArray = word.split(' ');
    let newWord;
    if (wordArray.length == 1) {
      let newPostcode = word
        .replace(/(\d{2})/g, '$1 ')
        .replace(/(^\s+|\s+$)/, '');

      let codeArray = newPostcode.split(' ');
      newWord = codeArray[0] + codeArray[1].charAt(0);
      console.log('newPostcode', newPostcode);
      console.log('codeArray', codeArray);
      console.log('newWord1', newWord);
    } else {
      newWord = wordArray[0] + wordArray[1].charAt(0);
      console.log('newWord2', newWord);
    }
    // console.log('newWord', newWord);
    return newWord;
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('locationitem');
      const valuepostcode = await AsyncStorage.getItem('locationpostcode');

      setlocationpostcode(valuepostcode); 
      setlocationitem(value); 

    } catch(e) {
      console.log(e);
       
    }
  }
 

  const getProfileDetails = async values => {

    const locationitem = await AsyncStorage.getItem('locationitem');
    const locationpostcode = await AsyncStorage.getItem('locationpostcode'); 

    let address1="";
    let address2="";
    let city="";
    let postalCode="";
    if(locationitem!=null)
    {
     let tmparry=locationitem.split(','); 
     console.log(tmparry);
     address1=tmparry.length==3?tmparry[0]:tmparry[0]
     address2=tmparry.length==3?'':tmparry[1]
     city=tmparry.length==3?tmparry[1]:tmparry[2]
     //postalCode=tmparry.length==3?tmparry[2]:tmparry[3]

     postalCode=locationpostcode.toUpperCase();
      

    } 
    
    let token = AppUserData.token;

    showLoader();
    if (token == undefined) {
      stopLoader(); 
     
      FormRef.current.setFieldValue(
        'address1',
        address1 ? address1.toString() : '',
      );
      FormRef.current.setFieldValue(
        'address2',
        address2 ? address2.toString() : '',
      );
      FormRef.current.setFieldValue(
        'city',
        city ? city.toString() : '',
      );
      FormRef.current.setFieldValue(
        'postalCode',
        postalCode ? postalCode.toString() : '',
      ); 

      return;
    } else {
      UserService.Post('user/user-profile', {}, token)
        .then(response => {
          stopLoader();
          console.log('Response=>', response);
          if (response.error == false) {
            let responseData = response.data.profile;
            setProfileData(response.data.profile);
            let name = responseData.firstname + ' ' + responseData.lastname;
            let email = responseData.email;
            let mobile = responseData.phone;
            // console.log('Mobile ', mobile);
            setUserDetails({
              email: email,
              name: name,
              phone: mobile,
              address1:address1,
              address2:address2,
              city:city,
              postalCode:postalCode
            });
            FormRef.current.setFieldValue(
              'fullname',
              name ? name.toString() : '',
            );
            FormRef.current.setFieldValue(
              'email',
              email ? email.toString() : '',
            );
            FormRef.current.setFieldValue(
              'phone',
              mobile ? mobile.toString() : '',
            );
            FormRef.current.setFieldValue(
              'address1',
              address1 ? address1.toString() : '',
            );
            FormRef.current.setFieldValue(
              'address2',
              address2 ? address2.toString() : '',
            );
            FormRef.current.setFieldValue(
              'city',
              city ? city.toString() : '',
            );
            FormRef.current.setFieldValue(
              'postalCode',
              postalCode ? postalCode.toString() : '',
            );
            // AlertService.successAlert(response.message);
          } else {
            stopLoader();
            console.log('Error', response.message);
            setProfileData({});

            // AlertService.dangerAlert(response.message);
            AlertOccurred('Alert', response.message, 'ok');
          }
        })
        .catch(error => {
          stopLoader();
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
    }
  };

  const getUserAddress = () => {
    let token = AppUserData.token;
    showLoader();
    UserService.Post('user/user-addresses', {}, token)
      .then(response => {
        stopLoader();
        console.log('Address Response=>', response);
        if (response.error == false) {
          let responseData = response.data;
          setAddressData(responseData);
          // AlertService.successAlert(response.message);
        } else {
          stopLoader();
          setAddressData([]);
          console.log('Error', response.message);
          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
        }
      })
      .catch(error => {
        stopLoader();
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

  const getDeliveryCharges = () => {
 

    let token = AppUserData.token;
    let data = {
      restaurantId: restaurantID,
    };
    showLoader();
    UserService.Post('restaurant/delivery-charges', data, token)
      .then(response => {
        stopLoader();

        
        

               

        if (response.error == false) {
          let responseData = response.data.postcodeList; 

          setDeliveryCharges(responseData);
          // AlertService.successAlert(response.message);
        } else {
          stopLoader();
          setDeliveryCharges([]);
          console.log('Error', response.message);
          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
        }
      })
      .catch(error => {
        stopLoader();
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

  const AddUserAddress = values => {
    console.log('aDDRESS vALUES', values);

    let data = {
      name: values.fullname,
      phone: values.phone,
      email: values.email == null || undefined ? '' : values.email,
      address1: values.address1,
      address2: values.address2,
      address_type: 'Home',
      city: values.city,
      postcode: values.postalCode,

      isNewAddress: 'true',
    };
    let token = AppUserData.token;
    console.log('API Data', data);
    showLoader();
    UserService.Post('user/add-user-address', data, token)
      .then(response => {
        stopLoader();
        console.log('Response=>', response);
        if (response.error == false) {
          let responseData = response.data.profile;
          let AllData = {
            userData: UserDetails,
            restID: restaurantID,
            idOfOrder: orderID,
            address: values,
          };
          let fromData = 'Formik';

          SaveOrderAddress(AllData, fromData);

          // navigation.navigate('OrderPayScreen', {data: AllData});
          // AlertService.successAlert(response.message);
        } else {
          stopLoader();
          console.log('Error', response.message);
          setProfileData({});

          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
        }
      })
      .catch(error => {
        stopLoader();
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

  const SaveOrderAddress = (values, type) => {
    console.log('aDDRESS vALUES', values);
    console.log('Type', type);

    let data = {
      name: values.address.fullname,
      email: values.address.email,
      phone: values.address.phone,
      address1: values.address.address1,
      address2: values.address.address2,
      city: values.address.city,
      postcode: values.address.postalCode,
      orderId: orderID,
    };


    

    let token = AppUserData.token;
    console.log('API Data', data);
    // showLoader()
    UserService.Post('orders/order-address-save', data, token)
      .then(response => {
        stopLoader();
        console.log('Order Address Save1 =>', response);
        if (response.error == false) {

           
          let service = OrderData[0].service_type;
          console.log('Service type', service);

          console.log('Service type1111', values.address.postalCode);

          if (service === 'delivery') {
            let arrayWord;
            
             //let singleWord = MakeWord(values.address.postalCode);

             let singleWord = values.address.postalCode; 
             let str = singleWord;
             let before_="";
             
            if(str.indexOf(' ') > 0)
            {
              before_ = str.substring(0, str.indexOf(' '));
            }
            else 
            {
               if(str.length >= 4)
               {
                before_ = str.substring(0, 4).trim();
               }
               else
               {
                before_ = str.substring(0, 3).trim();
               }
            }
             
           //  let before_ = str;

            let OrderCharge;  

            DeliveryCharges.filter(element => { 
              arrayWord = element.postcode;  
             // arrayWord = element.postcode; 

           

              if ((arrayWord).toLowerCase().toString() == (before_).toLowerCase().toString()) {
                console.log('Matched element', element);
                OrderCharge = element;
              } else {
                console.log('Element not matched');
              }


            }); 


            let AllData = {
              orderCharge: OrderCharge,
              orderAddress: values,
              orderData: OrderData,
              orderItem: OrderItem,
            };
            console.log('All Data for Order Pay', AllData);


            OrderCharge == undefined
              ? AlertOccurred(
                  'Alert',
                  'Post Code is not valid for delivery.',
                  'ok',
                )
              : navigation.navigate('OrderPayScreen', {data: AllData});
          } else {
            let AllData = {
              orderCharge: null,
              orderAddress: values,
              orderData: OrderData,
              orderItem: OrderItem,
            };
            console.log('All Data for Order Pay', AllData);
            navigation.navigate('OrderPayScreen', {data: AllData});
          }
          
        } else {
          stopLoader();
          console.log('Error', response.message);
          // AlertService.dangerAlert(response.message);
        }
      })
      .catch(error => {
        stopLoader();
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

  const SaveGuestOrderAddress = values => {
    console.log('SaveGuestOrderAddress called');
    console.log('aDDRESS vALUES', values);

    let data = {
      name: values.address.fullname,
      email: values.address.email,
      phone: values.address.phone,
      address1: values.address.address1,
      address2: values.address.address2,
      city: values.address.city,
      postcode: values.address.postalCode,
      orderId: orderID,
    };
    let token = AppUserData.token;
    console.log('API Data', data);
    showLoader();
    UserService.GuestPost('orders/order-address-save', data)
      .then(response => {
        stopLoader();
        console.log('Order Address Save =>', response);
        if (response.error == false) {
          // navigation.navigate('OrderPayScreen', {data: values});
          let service = OrderData[0].service_type;
          console.log('Service type', service);
          if (service === 'delivery') {
            let arrayWord;

           // let singleWord = values.address.postalCode; 
            //let str = singleWord;
            //let before_ = str.substring(0, str.indexOf(' '));

            let singleWord = values.address.postalCode; 
            let str = singleWord;
            let before_="";
            
           if(str.indexOf(' ') > 0)
           {
             before_ = str.substring(0, str.indexOf(' '));
           }
           else 
           {
              if(str.length >= 4)
              {
               before_ = str.substring(0, 4).trim();
              }
              else
              {
               before_ = str.substring(0, 3).trim();
              }
           }




           let OrderCharge;  
           
           DeliveryCharges.filter(element => { 
             arrayWord = element.postcode;  
            // arrayWord = element.postcode;
            
             if ((arrayWord).toLowerCase() === (before_).toLowerCase()) {
               console.log('Matched element', element);
               OrderCharge = element;
             } else {
               console.log('Element not matched');
             }
           }); 





           
            let AllData = {
              orderCharge: OrderCharge,
              orderAddress: values,
              orderData: OrderData,
              orderItem: OrderItem,
            };
            console.log('All Data for Order Pay', AllData);
            OrderCharge == undefined
              ? AlertOccurred(
                  'Alert',
                  'Post Code is not valid for delivery.',
                  'ok',
                )
                
              : navigation.navigate('OrderPayScreen', {data: AllData});
          } else {
            let AllData = {
              orderCharge: null,
              orderAddress: values,
              orderData: OrderData,
              orderItem: OrderItem,
            };
            console.log('All Data for Order Pay', AllData);
            navigation.navigate('OrderPayScreenCollection', {data: AllData});
          }

          // AlertService.successAlert(response.message);
        } else {
          stopLoader();
          console.log('Error', response.message);
          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
        }
      })
      
      .catch(error => {
        stopLoader();
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

  const DetailsCartSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(3, 'Minimum length 5 characters')
      .required('First name is required'),

    address1: Yup.string()
      .min(3, 'Minimum length 5 characters')
      .required('Address1 is required'),
    // address2: Yup.string()
    //   .min(3, 'Minimum length 5 characters')
    //   .required('Address2 is required'),
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
      .min(10, 'Minimum length 10 characters')
      .required('Phone number is required'),
    postalCode: Yup.string()
      .min(3, 'Minimum length 3 characters')
      .required('Pin code is required'),
     
    city: Yup.string().required('City is required'),
    // country: Yup.string()
    //   // .min(6, 'Minimum length 6 characters')
    //   .required('Country is required'),
    // addresstype: Yup.string()
    //   // .min(6, 'Minimum length 6 characters')
    //   .required('Address type is required'),
  });
  const renderAddresses = ({item, index}) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          width: '100%',
        }}>
        <TouchableOpacity
          style={styles.addressStyle}
          onPress={() => {
            console.log('item', item);

            let AllData = {
              userData: {
                email: UserDetails.email,
                name: item.name,
                phone: item.phone,
              },

              restID: restaurantID,
              idOfOrder: orderID,
              address: {
                fullname: item.name,
                address1: item.address1,
                address2: item.address2,
                email: UserDetails.email,
                phone: item.phone,
                postalCode: item.postcode,
                city: item.city,
              },
            };

            let from = 'Modal';
            // console.log('All Data', AllData);
            setDisplayModal(false);
            SaveOrderAddress(AllData, from);
            // navigation.navigate('OrderPayScreen', {data: AllData});
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              width: '95%',
              alignItems: 'center',
            }}>
            {item.address1 == null || undefined ? null : (
              <Text style={styles.address}>{item.address1},</Text>
            )}
            {item.address2 == null || undefined ? null : (
              <Text style={styles.address}>{' ' + item.address2},</Text>
            )}
            {item.city == null || undefined ? null : (
              <Text style={styles.address}>{' ' + item.city},</Text>
            )}
            {item.country == null || undefined ? null : (
              <Text style={styles.address}>{' ' + item.country},</Text>
            )}
            {item.postcode == null || undefined ? null : (
              <Text style={styles.address}>{' ' + item.postcode}</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const onPress = id => {
    let selectedAddress = [];
    let newData = [...AddressData];
    newData.forEach(element => {
      element.isSelected = false;
      if (element.id == id) {
        element.isSelected = true;
        selectedAddress.push(element);
      }
    });
    setAddressData(newData);


    FormRef.current.setFieldValue(
      'address1',
      selectedAddress.length > 0 && selectedAddress[0].address1
        ? selectedAddress[0].address1.toString()
        : '',
    );
    FormRef.current.setFieldValue(
      'address2',
      selectedAddress.length > 0 && selectedAddress[0].address2
        ? selectedAddress[0].address2.toString()
        : '',
    );
    FormRef.current.setFieldValue(
      'city',
      selectedAddress.length > 0 && selectedAddress[0].city
        ? selectedAddress[0].city.toString()
        : '',
    );
    FormRef.current.setFieldValue(
      'postalCode',
      selectedAddress.length > 0 && selectedAddress[0].postalCode
        ? selectedAddress[0].postalCode.toString()
        : '',
    );
    console.log('selectedAddress', selectedAddress);
  };
  return Loader == true ? (
    <ApiLoader />
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={backIcon} resizeMode={'contain'} style={{}} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Poppins-Medium',
              color: constant.regularTxt,
            }}>
            Details
          </Text>
        </View>
      </View>
      {AppUserData.token == undefined ? null : (
        <TouchableOpacity
          style={styles.addressView}
          onPress={() => {
            setDisplayModal(true);
          }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Poppins-Medium',
              color: constant.regularTxt,
            }}>
            Select Address
          </Text>
          <TouchableOpacity
            onPress={() => {
              setDisplayModal(true);
            }}>
            <Ionicons
              name="chevron-down"
              size={25}
              color={GlobalColor.boldTxt}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      <Text
        style={{
          fontSize: 20,
          fontFamily: 'Poppins-SemiBold',
          color: constant.mediumTxt,
          marginTop: 20,
          textAlign: 'center',
        }}>
        Add Your New Details
      </Text>
      <KeyboardAwareScrollView
      // contentContainerStyle={{flex:1}}
      // style={{height: '85%'}}
      >
      
        <Formik
          innerRef={FormRef}
          validationSchema={DetailsCartSchema}
          initialValues={{
            fullname: '',
            address1: '',
            address2: '',
            // addresstype: '',
            email: '',
            phone: '',
          //  postalCode: '',
            city: '',
             country: '',
          }}
          onSubmit={values => {

            console.log(values);

            // navigation.navigate('OrderPayScreen', {data: AllData});
            if (AppUserData.token !== undefined || null) {
              AddUserAddress(values);
            } else if (userType === 'Guest') {
              let guestUserDetails = {
                email: values.email,
                name: values.name,
                phone: values.mobile,
              };
              let AllData = {
                userData: guestUserDetails,
                restID: restaurantID,
                idOfOrder: orderID,
                address: values,
              };
              SaveGuestOrderAddress(AllData);
            } else {
              let UserDetails = {
                email: values.email,
                name: values.name,
                phone: values.phone,
              };
              let AllData = {
                userData: UserDetails,
                restID: restaurantID,
                idOfOrder: orderID,
                address: values,
              };
              navigation.navigate('OrderPayScreen', {data: AllData});
            }

            // return;
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
          }) => {
            // console.log('MultipleAddress', MultipleAddress);
            return (
              <View>
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.fullname}
                    onChangeText={handleChange('fullname')}
                    placeholder="Full Name"
                    blurOnSubmit={false}
                    returnKeyType="next"
                    keyboardType="default"
                    autoCorrect={false}
                    placeholderTextColor={constant.regularTxt}
                  />
                </View>
                {errors.fullname && touched.fullname ? (
                  <View style={{width: '75%', alignSelf: 'center'}}>
                    <Text style={styles.errorLabel}>{errors.fullname}</Text>
                  </View>
                ) : null}
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.phone}
                    onChangeText={handleChange('phone')}
                    blurOnSubmit={false}
                    placeholder="Mobile Number"
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    autoCorrect={false}
                    placeholderTextColor={constant.regularTxt}
                    maxLength={11}
                  />
                </View>
                {errors.phone && touched.phone ? (
                  <View style={{width: '75%', alignSelf: 'center'}}>
                    <Text style={styles.errorLabel}>{errors.phone}</Text>
                  </View>
                ) : null}
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.email}
                    onChangeText={
                      handleChange('email')
                    //  AppUserData.token !== undefined
                      //  ? null
                       // : handleChange('email')
                    }
                   // editable={AppUserData.token !== undefined ? false : true}
                    blurOnSubmit={false}
                    placeholder="Email"
                    keyboardType="email-address"
                    returnKeyType="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={constant.regularTxt}
                  />
                </View>
                {errors.email && touched.email ? (
                  <View style={{width: '75%', alignSelf: 'center'}}>
                    <Text style={styles.errorLabel}>{errors.email}</Text>
                  </View>
                ) : null}
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.address1}
 
                   // value={locationitem }
                    
                    onChangeText={handleChange('address1')}
                    blurOnSubmit={false}
                    placeholder="Address 1"
                    keyboardType="default"
                    //  autoCapitalize='none'
                    returnKeyType="next"
                    autoCorrect={false}
                    placeholderTextColor={constant.regularTxt}
                  />



                </View>
                {errors.address1 && touched.address1 ? (
                  <View style={{width: '75%', alignSelf: 'center'}}>
                    <Text style={styles.errorLabel}>{errors.address1}</Text>
                  </View>
                ) : null}
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.address2}
                    onChangeText={handleChange('address2')}
                    blurOnSubmit={false}
                              placeholder="Address 2"
                    keyboardType="default"
                    returnKeyType="next"
                    //  autoCapitalize='none'
                    autoCorrect={false}
                    placeholderTextColor={constant.regularTxt}
                  />
                </View>
                {/* {errors.address2 && touched.address2 ? (
                    <View style={{width: '75%', alignSelf: 'center'}}>
                      <Text style={styles.errorLabel}>{errors.address2}</Text>
                    </View>
                  ) : null} */}

                {/* <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.addresstype}
                    onChangeText={handleChange('addresstype')}
                    blurOnSubmit={false}
                    placeholder="Address type"
                    keyboardType="default"
                    returnKeyType="next"
                    //  autoCapitalize='none'
                    autoCorrect={false}
                    placeholderTextColor={constant.regularTxt}
                  />
                </View>
                {errors.addresstype && touched.addresstype ? (
                  <View style={{width: '75%', alignSelf: 'center'}}>
                    <Text style={styles.errorLabel}>{errors.addresstype}</Text>
                  </View>
                ) : null} */}
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.city}
                    onChangeText={handleChange('city')}
                    blurOnSubmit={false}
                    placeholder="City"
                    keyboardType="default"
                    returnKeyType="next"
                    //  autoCapitalize='none'
                    autoCorrect={false}
                    placeholderTextColor={constant.regularTxt}
                  />
                </View>

                {errors.city && touched.city ? (
                  <View style={{width: '75%', alignSelf: 'center'}}>
                    <Text style={styles.errorLabel}>{errors.city}</Text>
                  </View>
                ) : null}
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputStyle}
                   value={values.postalCode}
                  //  value={locationpostcode}
                  
                    onChangeText={handleChange('postalCode')}
                    //blurOnSubmit={false}
                    placeholder="Post Code"
                    keyboardType="default"
                    //  autoCapitalize='none'
                    autoCorrect={false}
                    placeholderTextColor={constant.regularTxt}
                  />
                </View>
                {errors.postalCode && touched.postalCode ? (
                  <View style={{width: '75%', alignSelf: 'center'}}>
                    <Text style={styles.errorLabel}>{errors.postalCode}</Text>
                  </View>
                ) : null} 
              
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    handleSubmit();
                  }}
                  style={styles.saveBtn}>
                  <Text style={styles.saveBtnTxt}>Save & Proceed</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={DisplayModal}
        onRequestClose={() => {
          alert('Modal has now been closed.');
        }}>
        <View
          style={{height: '100%', width: '100%', backgroundColor: '#00000080'}}>
          <View
            style={{
              width: '100%',
              bottom: 0,
              position: 'absolute',
              height: '55%',
              borderTopRightRadius: 30,
              backgroundColor: 'white',
              paddingHorizontal: 10,
              borderTopLeftRadius: 30,
              paddingBottom: '5%',
            }}>
            <View
              style={{
                marginTop: 30,
                flexDirection: 'row',
                width: '98%',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: 'Poppins-SemiBold',
                  color: constant.boldTxt,
                }}>
                Select Address
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (DisplayModal == true) {
                    setDisplayModal(false);
                  } else {
                    setDisplayModal(true);
                  }
                }}>
                <Ionicons
                  name={'close-circle'}
                  color={GlobalColor.BgPrimary}
                  size={25}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              data={AddressData}
              renderItem={renderAddresses}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  addressView: {
    marginTop: 10,
    height: 40,
    width: '80%',
    backgroundColor: '#F2F2F2',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    flexDirection: 'row',
    borderRadius: 30,
  },
  inputView: {
    marginTop: 20,
    height: 50,
    width: '80%',
    backgroundColor: '#F2F2F2',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  inputStyle: {
    height: 50,
    width: '80%',
    borderRadius: 30,
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: GlobalColor.boldTxt,
  },
  saveBtn: {
    marginVertical: 20,
    height: 50,
    width: '80%',
    backgroundColor: constant.BgPrimary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  saveBtnTxt: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  addressStyle: {
    marginTop: 10,
    height: 40,
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioView: {
    height: 15,
    width: 15,
    borderWidth: 1,
    borderColor: constant.BgPrimary,
    borderRadius: 10,
  },
  errorLabel: {
    color: constant.error,
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  address: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: constant.boldTxt,
  },
});
export default DetailsCartScreen;
