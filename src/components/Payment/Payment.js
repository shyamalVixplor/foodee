import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import cardIcon from '../../../assets/images/credit-card.png';
import payMethodIcon from '../../../assets/images/payment-methods.png';
import constant from '../../constant/constant';
import {CardField, useStripe} from '@stripe/stripe-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AlertService from '../../Services/AlertService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SecretKey from '../../api/StripeSecretKey';
import PublishableKey from '../../api/StripePublishableKey';

const PaymentScreen = ({navigation}) => {
  const {confirmPayment} = useStripe();
  // const emailRef = useRef();
  // const cardHolderRef = useRef();
  // const cardNumberRef = useRef();
  // const expireDateRef = useRef();
  // const cvcRef = useRef();
  const [CardValue, setCardValue] = useState({});

  const handleCardValue = data => {
    setCardValue(data);
  };

  // const onSubmit = async () => {
  //   // if (CardValue.valid == false || typeof CardValue.valid == 'undefined') {
  //   //   AlertService.dangerAlert('Invalid Card Details');
  //   //   return false;
  //   // }
  //   let cardToken;
  //   try {
  //     cardToken = await getCardToken(CardValue);
  //     if (cardToken.error) {
  //       AlertService.dangerAlert('Your Card Token is Invalid try again!');
  //     }
  //   } catch (error) {
  //     console.log('Cqard Error', error);
  //     return;
  //   }
  //   const {error} = await subscribeUser(cardToken);
  //   if (error) {
  //     console.log('subscribeUser error', error);
  //   } else {
  //     let payment_data = await charges();
  //     console.log('payment_data', payment_data);
  //     if (payment_data.status == 'succeeded') {
  //       AlertService.dangerAlert('Payment Successfully');
  //     } else {
  //       AlertService.dangerAlert('Payment failed');
  //     }
  //   }
  // };

  // const subscribeUser = cardToken => {
  //   return new Promise(resolve => {
  //     console.log('Credit card token\n', cardToken);
  //     CARD_TOKEN = cardToken.id;
  //     setTimeout(() => {
  //       resolve({status: true});
  //     }, 1000);
  //   });
  // };

  // const charges = async () => {
  //   const card = {
  //     amount: 50,
  //     currency: CURRENCY,
  //     source: CARD_TOKEN,
  //     description: 'Smart Developers Subscription',
  //   };
  //   return fetch('https://api.stripe.com/v1/charges', {
  //     headers: {
  //       // Use the correct MIME type for your server
  //       Accept: 'application/json',
  //       // Use the correct Content Type to send data to Stripe
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       // Use the Stripe publishable key as Bearer
  //       Authorization: `Bearer ${SecretKey}`,
  //     },
  //     // Use a proper HTTP method
  //     method: 'post',
  //     // Format the credit card data to a string of key-value pairs
  //     // divided by &
  //     body: Object.keys(card)
  //       .map(key => key + '=' + card[key])
  //       .join('&'),
  //   }).then(response => response.json());
  // };

  // const getCardToken = cardData => {
  //   console.log('I am in getCardToken function');
  //   console.log('card data=>', cardData);
  //   const card = {};
  //   // (card['last4'] = cardData.last4),
  //   //   (card['exp_month'] = cardData.expiryMonth),
  //   //   (card['exp_year'] = cardData.expiryYear),
  //   //   (card['postal_code'] = cardData.postalCode),
  //   // 'card[cvc]': cardData.values.cvc,
  //   //  sk_test_4eC39HqLyjWDarjtT1zdp7dc: \
  //   card['name'] = 'sfhsjfskfhsf'
  //   card['number'] = 4242424242424242;
  //   card['exp_month'] = 11;
  //   card['exp_year'] = 2022;
  //   card['cvc'] = 314;

  //   console.log('card data=>', card);
  //   return fetch('https://api.stripe.com/v1/tokens', {
  //     headers: {
  //       Accept: 'application/json',
  //       'content-type': 'application/x-www-form-urlencoded',
  //       Authorization: `Bearer ${PublishableKey}`,
  //     },
  //     method: 'post',
  //     body: Object.keys(card)
  //       .map(key => key + '=' + card[key])
  //       .join('&'),
  //   })
  //     .then(response => response.json())
  //     .catch(error => console.log('Card Token error', error));
  // };
    const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'usd',
      }),
    });
    const {clientSecret} = await response.json();

    return clientSecret;
  };
  const handlePayPress = async () => {
    if (!card) {
      return;
    }

    // Fetch the intent client secret from the backend
    const clientSecret = await fetchPaymentIntentClientSecret();
  };

  return (
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
          postalCodeEnabled={true}
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
          // onSubmit();
          handlePayPress();
          // navigation.navigate('OrderSuccessScreen');
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
