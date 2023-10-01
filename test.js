/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Switch,
  Modal,
  FlatList,
  ScrollView,
  Keyboard,
  Pressable,
  Alert,
  TouchableNativeFeedback,
} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import clockImg from '../../../assets/images/clockIcon.png';
import constant from '../../constant/constant';
import GlobalColor from '../../constant/constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import Spinner from 'react-native-loading-spinner-overlay';
import UserService from '../../Services/UserService';
import AlertService from '../../Services/AlertService';
import AuthContext from '../../context/AuthContext';
import {CartState} from '../../context/CartContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const OrderPayScreen = ({navigation, route}) => {
  const RouteData = route.params.data.orderAddress.address;
  const orderID = route.params.data.orderAddress.idOfOrder;
  const restaurantID = route.params.data.orderAddress.restID;
  const userData = route.params.data.orderAddress.userData;
  const orderCharge =
    route.params.data.orderCharge == undefined || null
      ? null
      : route.params.data.orderCharge.delivery_charge;

  // const [OrderID, setOrderID] = useState(0);
  const {authContext, AppUserData} = useContext(AuthContext);
  const [isEnabled, setIsEnabled] = useState(false);
  const [Loader, setLoader] = useState(false);
  const [IsOn, setIsOn] = useState(false);
  const [IsActive, setIsActive] = useState(false);
  const [cashStatus, setCashStatus] = useState(false);
  const [cardStatus, setCardStatus] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ChosenAddress, setChosenAddress] = useState(RouteData);
  const [ShowAllTimeSlot, setShowAllTimeSlot] = useState(false);
  const [CardList, setCardList] = useState([]);
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [TimeChoosed, setTimeChoosed] = useState('');
  const OrderData = route.params.data.orderData;
  const [FullPrice, setFullPrice] = useState(0);
  const OrderItem = route.params.data.orderItem;
  const {
    cartItem,
    addItem,
    increment,
    decrement,
    deleteItem,
    totalPrice,
    qty,
    removeAllItem,
  } = CartState();
  const displayModal = show => setIsVisible(show);
  const [TimePeriod, setTimePeriod] = useState([]);
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

  const AskAlertOccurred = (title, body, btnTxt, btnTxt2, cardId) => {
    Alert.alert(title, body, [
      {
        text: btnTxt,
        onPress: () => {
          setIsModalVisible(false);
          deleteSavedCard(cardId);
        },
      },
      {
        text: btnTxt2,
        onPress: () => {
          console.log('No Pressed');
        },
      },
    ]);
  };
  useEffect(() => {
    console.log('Previous Route Data ', route.params);
    console.log('OrderData ', OrderData);
    console.log('OrderItem ', OrderItem);
    console.log('Order ID', orderID);
    console.log('Restaurant ID', orderID);
    console.log('Route Data', RouteData);
    console.log('userData Data', userData);
    if (OrderData && OrderItem && orderCharge !== null) {
      console.log('Amount Payable ', parseFloat(OrderData[0].amount_payable));
      console.log('Order Charge', parseFloat(orderCharge));
      let prevTotalPrice = parseFloat(OrderData[0].amount_payable);
      let DeliveryCharge = parseFloat(orderCharge);
      let newTotalPrice = prevTotalPrice + DeliveryCharge;
      console.log('newTotalPrice', newTotalPrice);
      setFullPrice(parseFloat(newTotalPrice).toFixed(2));
    }
    GetSavedCards();
    GetTimeSlot();
  }, []);

  const GetTimeSlot = () => {
    let token = AppUserData.token;
    let data = {
      orderId: orderID,
      restaurantId: restaurantID,
    };
    // console.log('App User Token', token);
    console.log('Api Data', data);

    setLoader(true);
    UserService.Post('orders/time-slots', data, token)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);

        if (response.error == false) {
          setLoader(false);
          let responseData = response.data.timeSlotsArray;
          let demoResponseData = [...responseData];
          demoResponseData.push('ASAP');
          // console.log('demoResponseData', demoResponseData);
          let newTimeArray = [];
          demoResponseData.map((data, index) => {
            // console.log('Time Data', data);
            newTimeArray.push({
              id: index + 1,
              time: data,
              isSelected: false,
            });
          });
          console.log('newTimeArray', newTimeArray);
          setTimePeriod(newTimeArray);
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setTimePeriod([]);

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

  const GetSavedCards = () => {
    let token = AppUserData.token;
    console.log('Token==>', token);
    setLoader(true);
    UserService.Post('orders/get-saved-cards', {}, token)
      .then(response => {
        if (response.error == false) {
          setLoader(false);
          console.log('GetSavedCards response', response);

          setCardList(response.data.savedCardLists);
        } else {
          setLoader(false);
          console.log('Error', response.message);
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('GetSavedCards data Error', error);
      });
  };

  const CodOrder = () => {
    if (TimeChoosed === '') {
      // AlertService.dangerAlert('Please Choose a pickup/delivery time!');
      AlertOccurred('Alert', 'Please Choose a pickup/delivery time!', 'ok');
      return;
    }
    let token = AppUserData.token;
    let data = {
      pickup_delivery_time: TimeChoosed === 'ASAP' ? '00:00:00' : TimeChoosed,
      orderId: orderID,
    };
    console.log('Api Data', data);
    // return;
    setLoader(true);
    UserService.Post('orders/cod-order', data, token)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          createOrderSuccessMail();
          removeAllItem();
          navigation.navigate('OrderSuccessScreen', {
            data: orderID,
          });

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

  const PostDeliveryPrice = () => {
    let data = {
      postcode: RouteData.postalCode,
      orderId: orderID,
    };
    setLoader(true);
    UserService.Post('orders/delivery-price', data)
      .then(response => {
        setLoader(false);
        console.log('PostDeliveryPrice Response=>', response);
        // if (response.error == false) {
        //   let responseData = response.data;
        //   setAddressData(responseData);
        //   AlertService.successAlert(response.message);
        // } else {
        //   setLoader(false);
        //   setAddressData([]);
        //   console.log('Error', response.message);
        //   AlertService.dangerAlert(response.message);
        // }
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
  const PayWithSavedCard = cardId => {
    let token = AppUserData.token;
    if (TimeChoosed === '') {
      // AlertService.dangerAlert(
      //   'Please Choose a pickup/delivery time!',
      // );
      AlertOccurred('Alert', 'Please Choose a pickup/delivery time!', 'ok');
      return;
    }
    OrderData[0].service_type === 'pickup' ? null : PostDeliveryPrice();

    let APIData = {
      orderId: orderID,
      cardId: cardId,
      pickup_delivery_time: TimeChoosed,
    };

    console.log('API Data', APIData);
    setLoader(true);
    UserService.Post('orders/create-payment-intent-with-card', APIData, token)
      .then(response => {
        setLoader(false);
        console.log(' PayWithSavedCard Response=>', response);
        let resData;
        if (
          response.error == false &&
          response.data.paymentStatus === 'Success'
        ) {
          createOrderSuccessMail();
          removeAllItem();
          setIsModalVisible(false);
          navigation.navigate('OrderSuccessScreen', {
            data: orderID,
          });
        } else {
          AlertOccurred('Alert', 'Something went with saved card payment');
          setLoader(false);
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

  const createOrderSuccessMail = () => {
    // console.log('createOrderSuccessMail called');
    let data = {
      orderId: orderID,
    };
    console.log('Order Id', data);
    let token = AppUserData.token;
    // return;
    // setLoader(true);
    UserService.Post('orders/order-success-mail', data, token)
      .then(res => {
        console.log('Response of mail', res);
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
  const deleteSavedCard = cardId => {
    // console.log('createOrderSuccessMail called');
    let data = {
      cardId: cardId,
    };
    console.log('Card Id', data);
    let token = AppUserData.token;
    // return;
    // setLoader(true);
    UserService.Post('orders/delete-saved-card', data, token)
      .then(res => {
        console.log('Response of mail', res);
        GetSavedCards();
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

  const GuestCodOrder = () => {
    if (TimeChoosed === '') {
      // AlertService.dangerAlert('Please Choose a pickup/delivery time!');
      // AlertOccurred('Alert', 'Please Choose a pickup/delivery time!', 'ok');
      return;
    }
    let token = AppUserData.token;
    let data = {
      pickup_delivery_time: TimeChoosed === 'ASAP' ? '00:00:00' : TimeChoosed,
      orderId: orderID,
    };
    console.log('Api Data', data);
    // return;
    setLoader(true);
    UserService.GuestPost('orders/cod-order', data)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          createGuestOrderSuccessMail();
          removeAllItem();
          navigation.navigate('OrderSuccessScreen', {
            data: orderID,
          });

          // AlertService.successAlert(response.message);
          // AlertOccurred('Success', response.message, 'ok');
        } else {
          setLoader(false);
          console.log('Error', response.message);

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
      orderId: orderID,
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
          // AlertOccurred('Alert', 'Please Choose a pickup/delivery time!', 'ok');
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

  const handleTimePeriod = id => {
    let selectedTime = {};
    let newData = [...TimePeriod];
    newData.forEach(element => {
      element.isSelected = false;
      if (element.id == id) {
        element.isSelected = true;
        selectedTime = element;
        console.log('CHoosed Time', element.time);
        setTimeChoosed(element.time);
      }
    });
    setTimePeriod(newData);
  };
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const toggleOffer = () => setIsOn(previousState => !previousState);

  const toggleRestaurantOffer = () =>
    setIsActive(previousState => !previousState);
  const onPressRadioBtn = value => {
    switch (value) {
      case 'cash':
        setCashStatus(true);
        setCardStatus(false);
        break;
      case 'card':
        setCardStatus(true);
        setCashStatus(false);
        // navigation.navigate('PaymentScreen', {data: OrderID, user: userData});
        break;

      default:
        value;
        break;
    }
  };

  const numColumns = 4;
  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
      numberOfElementsLastRow++;
    }

    return data;
  };

  const renderTimePeriod = ({item, index}) => {
    if (item.empty) {
      return null;
    } else {
      return (
        <TouchableOpacity
          style={[
            styles.collectionItem,
            {
              backgroundColor: item.isSelected ? constant.BgPrimary : '#FFFFFF',
            },
          ]}
          onPress={() => {
            handleTimePeriod(item.id);
          }}>
          {/* <Ionicons
              name="ios-time-outline"
              size={16}
              color={item.isSelected ? '#fff' : constant.txtColor}
              style={{marginRight: 2}}
            /> */}
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Poppins-Regular',
              color: item.isSelected ? '#fff' : constant.regularTxt,
            }}>
            {item.time}
          </Text>
        </TouchableOpacity>
      );
    }
  };
  const renderOrderItems = ({item, index}) => {
    let ChoiceItemP = 0;
    let ItemP;
    if (item.choices !== null) {
      ItemP = parseFloat(item.item_price);
      item.choices.map((data, index) => {
        ChoiceItemP = parseFloat(ChoiceItemP) + parseFloat(data.price);
      });
    }
    let ItemAndChoiceP = parseFloat(ItemP) + parseFloat(ChoiceItemP);
    // console.log('Item Price', ItemP);
    // console.log('Choice Item Price', ChoiceItemP);
    // console.log('Both Item Price', ItemAndChoiceP);
    return (
      <View style={styles.orderInfo2}>
        <View style={[styles.innerRow, {justifyContent: 'space-between'}]}>
          <Text style={{fontSize: 13}}>
            {item.quantity} X {item.item_name}
          </Text>
          <Text style={{fontSize: 13}}>
            £ {item.choices !== null ? ItemAndChoiceP : item.item_price}
          </Text>
        </View>

        {item.choices
          ? item.choices.map((data, index) => {
              // console.log('choices Data', data);
              return (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  {data.name ? (
                    <Text style={[styles.itemName, {marginRight: 5}]}>
                      {data.name}
                    </Text>
                  ) : (
                    <Text style={[styles.itemName, {marginRight: 5}]}>
                      {data.label}
                    </Text>
                  )}
                  {item.choices.length - 1 == index ? null : (
                    <Text style={[styles.itemName, {marginRight: 5}]}>+</Text>
                  )}
                </View>
              );
            })
          : null}
      </View>
    );
  };
  const EmptyView = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Image
          source={require('../../../assets/images/not_found.png')}
          style={{height: 350, width: 400, resizeMode: 'contain'}}
        />
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Poppins-SemiBold',
            color: GlobalColor.BgPrimary,
          }}>
          Orders Not Found.
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Spinner
        visible={Loader}
        textContent={'Loading...'}
        textStyle={{color: '#fff'}}
      />
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
              color: constant.mediumTxt,
            }}>
            Pay and Complete Your Order
          </Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: GlobalColor.normalTxt}}>
        <View
          style={{
            paddingHorizontal: 25,
            backgroundColor: '#fff',
            paddingVertical: 10,
            marginBottom: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Bold',
              color: constant.boldTxt,
            }}>
            Delivery Address
          </Text>
          <View
            style={{
              width: '100%',
              marginTop: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '18%', flexDirection: 'row'}}>
              {ChosenAddress.address1 == null || undefined ? null : (
                <Text style={styles.address}>{ChosenAddress.address1},</Text>
              )}
              {ChosenAddress.address2 == null || undefined ? null : (
                <Text style={styles.address}> {ChosenAddress.address2},</Text>
              )}
              {ChosenAddress.city == null || undefined ? null : (
                <Text style={styles.address}> {ChosenAddress.city},</Text>
              )}
              {ChosenAddress.postalCode == null || undefined ? null : (
                <Text style={styles.address}> {ChosenAddress.postalCode}</Text>
              )}
              {/* <Text style={styles.address}>
                {ChosenAddress.address1 + ', '}
                {ChosenAddress.address2 == ''
                  ? null
                  : ChosenAddress.address2 + ChosenAddress.address2 == ''
                  ? null
                  : ', '}
                {ChosenAddress.city}, {ChosenAddress.postalCode}
              </Text> */}
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Poppins-Medium',
                  color: constant.BgPrimary,
                }}>
                Change
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 25,
            // backgroundColor: 'yellow',
            backgroundColor: '#fff',
            paddingTop: 8,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Bold',
              color: constant.boldTxt,
            }}>
            Collection Time
          </Text>
          {/* <TouchableOpacity
            onPress={() => {
              if (ShowAllTimeSlot == true) {
                setShowAllTimeSlot(false);
              } else {
                setShowAllTimeSlot(true);
              }
            }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Poppins-Medium',
                color: constant.BgPrimary,
              }}>
              View all
            </Text>
          </TouchableOpacity> */}
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FlatList
            style={{paddingBottom: 10}}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            data={formatData(TimePeriod, numColumns)}
            renderItem={renderTimePeriod}
            numColumns={numColumns}
            scrollEnabled={false}
          />
        </View>

        {/* <View
          style={{
            paddingHorizontal: 25,
          }}>
          <View style={styles.switchItem}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: constant.regularTxt,
              }}>
              Get SMS updates on order status
            </Text>
            <Switch
              trackColor={{false: constant.normalTxt, true: constant.BgPrimary}}
              thumbColor={isEnabled ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor={constant.normalTxt}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <View style={[styles.switchItem, {marginTop: 10}]}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: constant.regularTxt,
              }}>
              Want offers from foodee
            </Text>
            <Switch
              trackColor={{false: constant.normalTxt, true: constant.BgPrimary}}
              thumbColor={IsOn ? '#FFFFFF' : '#FFFFFF'}
              onValueChange={toggleOffer}
              value={IsOn}
            />
          </View>
          <View style={[styles.switchItem, {marginTop: 10}]}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: constant.regularTxt,
              }}>
              Want offers from Volta do Mar
            </Text>
            <Switch
              trackColor={{false: constant.normalTxt, true: constant.BgPrimary}}
              thumbColor={IsActive ? '#FFFFFF' : '#FFFFFF'}
              onValueChange={toggleRestaurantOffer}
              value={IsActive}
            />
          </View>
        </View> */}

        <View
          style={{
            width: '100%',
            backgroundColor: '#fff',
            paddingLeft: 15,
            paddingVertical: 6,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Bold',
              color: constant.boldTxt,
            }}>
            Payment method
          </Text>
          <View style={{marginTop: 10}}>
            <View style={styles.payTabStyle}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '85%',
                }}>
                <Text
                  style={{
                    color: constant.mediumTxt,
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Pay in Cash
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    onPressRadioBtn('cash');
                  }}
                  style={[
                    styles.radioBtn,
                    {
                      backgroundColor:
                        cashStatus === true ? constant.BgPrimary : '#FFFFFF',
                    },
                  ]}
                />
              </View>
            </View>
            <View style={[styles.payTabStyle, {marginVertical: 10}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '85%',
                }}>
                <Text
                  style={{
                    color: constant.mediumTxt,
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Pay with card
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (CardList.length > 0) {
                      setIsModalVisible(true);
                    } else {
                      onPressRadioBtn('card');
                    }
                  }}
                  style={[
                    styles.radioBtn,
                    {
                      backgroundColor:
                        cardStatus === true ? constant.BgPrimary : '#FFFFFF',
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {cashStatus === true ? (
            <TouchableOpacity
              // onPress={() => {
              //   AppUserData.token !== undefined || null
              //     ? CodOrder()
              //     : GuestCodOrder();
              // }}
              onPress={() => {
                if (TimeChoosed === '') {
                  // AlertService.dangerAlert(
                  //   'Please Choose a pickup/delivery time!',
                  // );
                  AlertOccurred(
                    'Alert',
                    'Please Choose a pickup/delivery time!',
                    'ok',
                  );
                  return;
                }
                OrderData[0].service_type === 'pickup'
                  ? null
                  : PostDeliveryPrice();
                AppUserData.token !== undefined || null
                  ? CodOrder()
                  : GuestCodOrder();
              }}
              style={styles.saveBtn}>
              <Text style={styles.saveBtnTxt}>Pay In Cash</Text>
            </TouchableOpacity>
          ) : null}

          {cardStatus === true ? (
            <TouchableOpacity
              onPress={() => {
                if (TimeChoosed === '') {
                  // AlertService.dangerAlert(
                  //   'Please Choose a pickup/delivery time!',
                  // );
                  AlertOccurred(
                    'Alert',
                    'Please Choose a pickup/delivery time!',
                    'ok',
                  );
                  return;
                }
                OrderData[0].service_type === 'pickup'
                  ? null
                  : PostDeliveryPrice();
                navigation.navigate('PaymentScreen', {
                  data: orderID,
                  user: userData,
                  time: TimeChoosed,
                });
              }}
              style={styles.saveBtn}>
              <Text style={styles.saveBtnTxt}>Pay With Card</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {OrderData.length && orderID.length !== 0 ? (
          <View style={styles.orderDetails}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Bold',
                color: constant.boldTxt,
              }}>
              Order Details
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={() => (
                <View style={{marginVertical: 5}} />
              )}
              data={OrderItem}
              renderItem={renderOrderItems}
              inverted={OrderData.length > 0 ? true : false}
            />

            <View
              style={[
                styles.separator,
                {backgroundColor: GlobalColor.BgPrimary},
              ]}
            />
            {OrderData.map(data => (
              <View
                style={[styles.innerRow, {justifyContent: 'space-between'}]}>
                <Text style={[styles.title, {fontSize: 14}]}>Sub Total</Text>
                <Text style={[styles.title, {fontSize: 14}]}>
                  £ {data.total_amount}
                </Text>
              </View>
            ))}

            {OrderData.map(data =>
              data.discount_val === '0.00' || undefined || null ? null : (
                <View
                  style={[styles.innerRow, {justifyContent: 'space-between'}]}>
                  <Text style={[styles.title, {fontSize: 14}]}>
                    Restaurant Discount
                  </Text>
                  <Text style={[styles.title, {fontSize: 14}]}>
                    £ {data.discount_val}
                  </Text>
                </View>
              ),
            )}

            {OrderData.map(data =>
              data.coupon_code === '' || data.coupon_code == null ? null : (
                <View
                  style={[styles.innerRow, {justifyContent: 'space-between'}]}>
                  <Text style={[styles.title, {fontSize: 14}]}>
                    {data.coupon_code}
                  </Text>
                  <Text style={[styles.title, {fontSize: 14}]}>Applied</Text>
                </View>
              ),
            )}

            {OrderData.map(data =>
              data.coupon_val === '0.00' || undefined ? null : (
                <View
                  style={[styles.innerRow, {justifyContent: 'space-between'}]}>
                  <Text style={[styles.title, {fontSize: 14}]}>
                    Coupon Discount
                  </Text>
                  <Text style={[styles.title, {fontSize: 14}]}>
                    £ {data.coupon_val}
                  </Text>
                </View>
              ),
            )}
            {orderCharge !== null || undefined ? (
              <View
                style={[styles.innerRow, {justifyContent: 'space-between'}]}>
                <Text style={[styles.title, {fontSize: 14}]}>
                  Delivery Charge
                </Text>
                <Text style={[styles.title, {fontSize: 14}]}>
                  £ {orderCharge}
                </Text>
              </View>
            ) : null}
            {OrderData.map(data => {
              return (
                <View
                  style={[styles.innerRow, {justifyContent: 'space-between'}]}>
                  <Text style={[styles.title, {fontSize: 14}]}>Total</Text>
                  {FullPrice == 0 ? (
                    <Text style={[styles.title, {fontSize: 14}]}>
                      £ {data.amount_payable}
                    </Text>
                  ) : (
                    <Text style={[styles.title, {fontSize: 14}]}>
                      £ {FullPrice}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ) : null}

        <Modal transparent={true} visible={IsModalVisible}>
          <Pressable
            onPress={() => {
              setIsModalVisible(false);
            }}
            style={{
              backgroundColor: '#000000aa',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                // backgroundColor: 'pink',
                paddingVertical: 15,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                width: '95%',
                height: '60%',
                // justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: GlobalColor.BgSuccess,
                  marginVertical: 8,
                }}>
                Pay With Saved Card{' '}
              </Text>
              <View
                style={{
                  width: '70%',
                  alignSelf: 'center',
                  borderTopWidth: 2,
                  marginBottom: 8,
                  borderColor: 'gray',
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  if (TimeChoosed === '') {
                    // AlertService.dangerAlert(
                    //   'Please Choose a pickup/delivery time!',
                    // );
                    AlertOccurred(
                      'Alert',
                      'Please Choose a pickup/delivery time!',
                      'ok',
                    );
                    return;
                  }
                  OrderData[0].service_type === 'pickup'
                    ? null
                    : PostDeliveryPrice();
                  navigation.navigate('PaymentScreen', {
                    data: orderID,
                    user: userData,
                    time: TimeChoosed,
                  });
                }}
                style={{
                  backgroundColor: GlobalColor.BgPrimary,
                  alignSelf: 'flex-end',
                  marginVertical: 5,
                  padding: 10,
                  borderTopLeftRadius: 40,
                  borderBottomLeftRadius: 40,
                }}>
                <Text
                  style={{marginLeft: 8, fontWeight: 'bold', color: '#fff'}}>
                  Pay With New Card{' '}
                </Text>
              </TouchableOpacity>
              <View style={{flex:1,width: '100%'}}>
                <FlatList
                  contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => item.id}
                  ItemSeparatorComponent={() => (
                    <View style={{marginVertical: 5}} />
                  )}
                  data={CardList}
                  renderItem={({item, index}) => {
                    return (
                      <Pressable
                        onPress={() => {
                          PayWithSavedCard(item.id);
                        }}
                        style={styles.cardView}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            width: '95%',
                          }}>
                          <View style={styles.debitView}>
                            <Image
                              source={require('../../../assets/images/atm-card.png')}
                              style={{
                                height: 25,
                                width: 25,
                                resizeMode: 'contain',
                              }}
                            />
                          </View>

                          <View style={{marginLeft: 10}}>
                            <Text style={{fontWeight: 'bold', marginBottom: 5}}>
                              Credit Card **** **** **** {item.last4}
                            </Text>
                            <Text style={{fontSize: 13, marginBottom: 5}}>
                              Expiry Date - {item.exp_year}
                            </Text>
                            <Text style={{fontSize: 13}}>
                              Card Type - {item.brand}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={() => {
                            AskAlertOccurred(
                              'Warning',
                              'Are You Sure?',
                              'yes',
                              'No',
                              item.id,
                            );
                          }}>
                          <Ionicons
                            name="trash-outline"
                            color={GlobalColor.BgPrimary}
                            size={20}
                          />
                        </TouchableOpacity>
                        <View>
                          {/* <Text
                          style={{
                            color: GlobalColor.BgPrimary,
                            marginLeft: '20%',
                            fontWeight: 'bold',
                          }}>
                          Credit Card **** **** **** {item.last4}
                        </Text>
                        <Text
                          style={{
                            color: 'black',
                            alignSelf: 'flex-end',
                            fontSize: 13,
                            marginVertical: 8,
                          }}>
                          Expiry Date - {item.exp_year}
                        </Text>
                        <Text
                          style={{
                            color: 'black',
                            alignSelf: 'flex-end',
                            fontSize: 13,
                          }}>
                          Card Type - {item.brand}
                        </Text> */}
                        </View>
                      </Pressable>
                    );
                  }}
                />
              </View>
            </View>
          </Pressable>
        </Modal>

        <Modal
          animationType={'slide'}
          transparent={true}
          visible={isVisible}
          onRequestClose={() => {
            alert('Modal has now been closed.');
          }}>
          <View
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: '#00000080',
            }}>
            <View
              style={{
                width: '100%',
                bottom: 0,
                position: 'absolute',
                height: '54%',
                borderTopRightRadius: 30,
                backgroundColor: 'white',
                paddingHorizontal: 10,
                borderTopLeftRadius: 30,
              }}>
              <View
                style={{
                  marginTop: 30,
                  flexDirection: 'row',
                  width: '90%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: 'Poppins-Regular',
                    color: constant.regularTxt,
                  }}>
                  Select Address
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    displayModal(!isVisible);
                  }}
                  style={{}}>
                  {/* <Image
                  source={cancelIcon}
                  resizeMode="contain"
                  style={styles.cancelImg}
                /> */}
                  <Ionicons
                    name="close"
                    size={16}
                    color={constant.txtColor}
                    style={{marginRight: 2}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  headerView: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 25,
    paddingVertical: 8,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  navItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },
  collectionView: {
    marginTop: 15,
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    width: '100%',
  },
  collectionView2: {
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    width: '100%',
  },
  collectionItem: {
    flexDirection: 'row',
    height: 40,
    width: 80,
    //borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.36,
    shadowRadius: 5,
    elevation: 9,
    margin: 8,
  },

  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payTabStyle: {
    height: 45,
    width: '100%',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#F6F6F6',
    borderColor: constant.normalTxt,
  },
  radioBtn: {
    height: 18,
    width: 18,
    borderWidth: 1,
    borderColor: constant.BgPrimary,
    borderRadius: 10,
  },
  saveBtn: {
    marginTop: 10,
    marginBottom: 20,
    ///paddingHorizontal:25,
    backgroundColor: constant.BgPrimary,
    height: 50,
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 25,
  },
  saveBtnTxt: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
  addressStyle: {
    marginTop: 20,
    height: 40,
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // separator: {
  //   alignSelf: 'center',
  //   height: 2,
  //   width: '50%',
  //   backgroundColor: '#F5F5F5',
  //   marginVertical: 10,
  // },

  innerRow: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: GlobalColor.normalTxt,
    marginVertical: 5,
  },
  orderDetails: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    // borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: GlobalColor.mediumTxt,
  },
  address: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: constant.regularTxt,
  },
  cardView: {
    margin: 10,
    height: 100,
    width: '95%',
    // paddingHorizontal: 10,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 18,
  },
  debitView: {
    height: 40,
    width: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 2,
  },
});
export default OrderPayScreen;
