import React, {useRef, useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import cardIcon from '../../../assets/images/credit-card.png';
import payMethodIcon from '../../../assets/images/payment-methods.png';
import constant from '../../constant/constant';
import {CardField, useStripe} from '@stripe/stripe-react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SecretKey from '../../api/StripeSecretKey';
import PublishableKey from '../../api/StripePublishableKey';
import Spinner from 'react-native-loading-spinner-overlay';
import UserService from '../../Services/UserService';
import AlertService from '../../Services/AlertService';
import AuthContext from '../../context/AuthContext';
import {CartState} from '../../context/CartContext';
import ApiLoader from '../../components/ApiLoader';

const PaymentScreen = ({navigation, route}) => {
  const orderId = route.params.data;
  const userData = route.params.user;
  const time = route.params.time;
  // console.log('previous page data', route.params);
  const formRef = useRef();

  const AlertOccurred = (title, body, btnTxt) => {
    Alert.alert(title, body, [
      {
        text: btnTxt,
        onPress: () => {
          // console.log(title);
          // formRef.current.clear();
        },
      },
    ]);
  };
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
  const [PaymentInfo, setPaymentInfo] = useState({});
  const [Key, setKey] = useState('');
  const {confirmPayment} = useStripe();

  // const emailRef = useRef();
  // const cardHolderRef = useRef();
  // const cardNumberRef = useRef();
  // const expireDateRef = useRef();
  // const cvcRef = useRef();
  const [CardValue, setCardValue] = useState({});
  const [Loader, setLoader] = useState(false);
  const handleCardValue = data => {
    setCardValue(data);
  };

  useEffect(() => {
    AppUserData.token !== undefined || null
      ? createPaymentIntent()
      : createPaymentIntentForGuest();
  }, []);

  // http://observancedev.com/foodee-dev/api/orders/create-payment-intent
  const createPaymentIntent = () => {
    let data = {
      orderId: orderId,
      pickup_delivery_time: time,
    };
    console.log('Order Id', data);
    let token = AppUserData.token;
    // return;
    // setLoader(true);
    UserService.Post('orders/create-payment-intent', data, token)
      .then(res => {
        let resData = res.data.paymentIntent;
        let clientKey = resData.client_secret;
        let customerId = res.data.stripe_customer_id;

        console.log('customerId', customerId);

        // console.log('client key', clientKey);
        setLoader(false);
        console.log('PaymentIntent Response=>', res);
        setPaymentInfo(res.data.paymentIntent);
        setKey(clientKey);
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

  const createPaymentIntentForGuest = () => {
    let data = {
      orderId: orderId,
      pickup_delivery_time: time,
    };
    console.log('Order Id', data);
    let token = AppUserData.token;
    // return;
    // setLoader(true);
    UserService.GuestPost('orders/create-payment-intent', data)
      .then(res => {
        let resData = res.data.paymentIntent;
        let clientKey = resData.client_secret;
        // console.log('Data', resData);
        // console.log('client key', clientKey);
        setLoader(false);
        console.log('PaymentIntent Response=>', res.data.paymentIntent);
        setPaymentInfo(res.data.paymentIntent);
        setKey(clientKey);
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

  const createOrderSuccessMail = () => {
    console.log('createOrderSuccessMail called');
    let data = {
      orderId: orderId,
    };
    console.log('Order Id', data);
    let token = AppUserData.token;
    // return;
    // setLoader(true);
    UserService.Post('orders/order-success-mail', data, token)
      .then(response => {
        if (response.error == false) {
          console.log('response of success mail', response);
          // AlertService.successAlert(response.message);
          // AlertOccurred('Congratulations', response.message, 'ok');
        } else {
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
  const createGuestOrderSuccessMail = () => {
    let data = {
      orderId: orderId,
    };
    console.log('Order Id', data);
    let token = AppUserData.token;
    // return;
    // setLoader(true);
    UserService.GuestPost('orders/order-success-mail', data)
      .then(response => {
        if (response.error == false) {
          console.log('response of success mail', response);
          // AlertService.successAlert(response.message);
          AlertOccurred('Success', response.message, 'ok');
        } else {
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

  // http://localhost/restaurant-mkt/api/orders/order-place
  const handlePayment = async () => {
    setLoader(true);
    console.log('Key', Key);
    console.log('Card Value', CardValue);
    const {error, paymentIntent} = await confirmPayment(Key, {
      type: 'Card',
      billingDetails: {
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
      },
    });

    if (error) {
      setLoader(false);
      // AlertService.dangerAlert(error.message);
      AlertOccurred('Alert', error.message, 'ok');
      console.log('Error Occur', error);
    } else {
      setLoader(false);
      // AlertService.successAlert('Payment Successful');
      AlertOccurred('Success', 'Payment Successful', 'ok');
      // navigation.navigate('Home')
      console.log('paymentIntent', paymentIntent);
      AppUserData.token !== undefined || null
        ? getOrderStatusUpdate(paymentIntent)
        : getGuestOrderStatusUpdate(paymentIntent);
    }
  };

  const getOrderStatusUpdate = values => {
    // return;
    let token = AppUserData.token;
    let data = {payment_status: values, orderId: orderId};
    console.log('Order Status API Data', data);
    setLoader(true);
    UserService.Post('orders/payment-status-update', data, token)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          // AlertService.successAlert(response.message);
          createOrderSuccessMail();
          removeAllItem();
          navigation.navigate('OrderSuccessScreen', {
            data: orderId,
          });
        } else {
          setLoader(false);
          console.log('Error', response.message);

          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', 'response.message', 'ok');
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

  const getGuestOrderStatusUpdate = values => {
    console.log('paymentStatus values ', values);
    let token = AppUserData.token;
    let data = {payment_status: values, orderId: orderId};
    console.log('API Data', data);
    setLoader(true);
    UserService.GuestPost('orders/payment-status-update', data)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          // AlertService.successAlert(response.message);
          AlertOccurred('Success', 'response.message', 'ok');
          createGuestOrderSuccessMail();
          removeAllItem();
          navigation.navigate('OrderSuccessScreen', {
            data: orderId,
          });
        } else {
          setLoader(false);
          console.log('Error', response.message);

          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', 'response.message', 'ok');
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
            <Image source={backIcon} resizeMode={'contain'} style={{}} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Poppins-Medium',
              color: constant.mediumTxt,
            }}>
            Pay and Complete Your Order
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: 22,
          fontFamily: 'Poppins-Bold',
          textAlign: 'center',
          marginTop: 20,
          color: constant.boldTxt,
        }}>
        Pay with Card
      </Text>
      {/* <View style={styles.inputView}>
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          onSubmitEditing={() => cardHolderRef.current.focus()}
          blurOnSubmit={false}
          returnKeyType="next"
          keyboardType="email-address"
          autoCorrect={false}
          autoCapitalize="none"
          placeholderTextColor={constant.normalTxt}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputStyle}
          onSubmitEditing={() => cardNumberRef.current.focus()}
          ref={cardHolderRef}
          blurOnSubmit={false}
          placeholder="Cardholder's Name"
          keyboardType="default"
          returnKeyType="next"
          autoCorrect={false}
          placeholderTextColor={constant.normalTxt}
        />
      </View> */}
      {/* <View style={styles.inputViewCard}>
        <TextInput
          style={styles.inputStyleCard}
          onSubmitEditing={() => expireDateRef.current.focus()}
          ref={cardNumberRef}
          blurOnSubmit={false}
          placeholder="Card Number"
          keyboardType="number-pad"
          returnKeyType="next"
          autoCorrect={false}
          placeholderTextColor={constant.normalTxt}
        />
        <Image source={cardIcon} resizeMode="contain" style={{left: 5}} />
      </View> */}
      {/* <View
        style={{
          flexDirection: 'row',
          width: '85%',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <View style={styles.inputViewDate}>
          <TextInput
            style={styles.inputStyleDate}
            onSubmitEditing={() => cvcRef.current.focus()}
            ref={expireDateRef}
            blurOnSubmit={false}
            placeholder="MM/YY"
            keyboardType="number-pad"
            returnKeyType="next"
            autoCorrect={false}
            placeholderTextColor={constant.normalTxt}
          />
        </View>
        <View style={styles.inputViewCvv}>
          <TextInput
            style={styles.inputStyleCvv}
            ref={cvcRef}
            placeholder="CVC"
            maxLength={3}
            secureTextEntry
            keyboardType="number-pad"
            returnKeyType="next"
            autoCorrect={false}
            placeholderTextColor={constant.normalTxt}
          />
        </View>
      </View> */}
      <View style={styles.inputViewCard}>
        <CardField
          ref={formRef}
          postalCodeEnabled={false}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: '#F2F2F2',
            textColor: '#000000',
            borderRadius: 30,
          }}
          style={{
            width: '100%',
            height: 50,
            marginVertical: 30,
          }}
          onCardChange={cardDetails => {
            console.log('cardDetails', cardDetails);
            handleCardValue(cardDetails);
          }}
          onFocus={focusedField => {
            console.log('focusField', focusedField);
          }}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          handlePayment();
          //
        }}
        style={styles.placeOrderBtn}>
        <Text style={styles.placeOrderBtnTxt}>Place Order</Text>
      </TouchableOpacity>
      <Image
        source={payMethodIcon}
        resizeMode="contain"
        style={{marginTop: 20, alignSelf: 'center'}}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    width: '80%',
  },
  inputView: {
    marginTop: 20,
    height: 50,
    width: '85%',
    backgroundColor: '#F2F2F2',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  inputStyle: {
    height: 50,
    width: '85%',
    borderRadius: 30,
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: constant.regularTxt,
  },
  inputViewCard: {
    marginTop: 20,
    height: 50,
    width: '85%',
    backgroundColor: '#F2F2F2',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    flexDirection: 'row',
  },
  inputStyleCard: {
    height: 50,
    width: '75%',
    borderRadius: 30,
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: constant.regularTxt,
  },
  inputViewDate: {
    marginTop: 20,
    height: 50,
    width: '50%',
    backgroundColor: '#F2F2F2',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  inputStyleDate: {
    height: 50,
    width: '40%',
    borderRadius: 30,
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: constant.regularTxt,
  },
  inputViewCvv: {
    marginTop: 20,
    height: 50,
    width: '40%',
    backgroundColor: '#F2F2F2',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  inputStyleCvv: {
    height: 50,
    width: '40%',
    borderRadius: 30,
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: constant.regularTxt,
  },
  placeOrderBtn: {
    marginTop: 25,
    height: 55,
    width: '85%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: constant.BgPrimary,
    borderRadius: 30,
  },
  placeOrderBtnTxt: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
});
export default PaymentScreen;
