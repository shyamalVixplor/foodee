/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useContext } from 'react';
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
  ActivityIndicator
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
import { CartState } from '../../context/CartContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ApiLoader from '../../components/ApiLoader';
import moment from 'moment';

const OrderPayScreen = ({ navigation, route }) => {
  const RouteData = route.params.data.orderAddress.address;
  const orderID = route.params.data.orderAddress.idOfOrder;
  const restaurantID = route.params.data.orderAddress.restID;
  const userData = route.params.data.orderAddress.userData;

  const checkshowcard = route.params.data.showcard;

  console.log(route.params.data.showcard);

  const orderCharge =
    route.params.data.orderCharge == undefined || null
      ? null
      : route.params.data.orderCharge.delivery_charge;

  // const [OrderID, setOrderID] = useState(0);
  const { authContext, AppUserData } = useContext(AuthContext);
  const [isEnabled, setIsEnabled] = useState(false);
  const [Loader, setLoader] = useState(false);
  const [CardLoader, setCardLoader] = useState(false);
  const [IsOn, setIsOn] = useState(false);
  const [IsActive, setIsActive] = useState(false);
  const [cashStatus, setCashStatus] = useState(false);
  const [cardStatus, setCardStatus] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDelvtimeModalVisible, setIsDelvtimeModalVisible] = useState(false);
  const [isStandTime, setIsStandTime] = useState(true);
  const [ChosenAddress, setChosenAddress] = useState(RouteData);
  const [ShowAllTimeSlot, setShowAllTimeSlot] = useState(false);
  const [CardList, setCardList] = useState([]);
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [TimeChoosed, setTimeChoosed] = useState('');
  const OrderData = route.params.data.orderData;
  const [FullPrice, setFullPrice] = useState(0);
  const [PayCash, setPayCash] = useState(false);
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
  useEffect(() => {
    console.log('Previous Route Data ', route.params);
    console.log('OrderData22222 ', OrderData);
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
    PayInCash();
  }, []);

  const AskAlertOccurred = (title, body, btnTxt, btnTxt2, cardId) => {
    Alert.alert(title, body, [
      {
        text: btnTxt,
        onPress: () => {
          // setIsModalVisible(false);
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
          // demoResponseData.push('ASAP');
           console.log('demoResponseData', demoResponseData);
          let newTimeArray = [];
          demoResponseData.map((data, index) => {  
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
          AlertService.dangerAlert(error.response.data.error.message);
        } else if (error.request) { 
          AlertService.dangerAlert('Network Error'); 
        } else { 
          AlertService.dangerAlert('Something Went Wrong');
        }
      });
  };


  const deleteSavedCard = cardId => { 
    let data = {
      cardId: cardId,
    };
    console.log('Card Id', data);
    let token = AppUserData.token; 
    UserService.Post('orders/delete-saved-card', data, token)
      .then(res => {
        console.log('Response of mail', res); 
        GetSavedCardsAfterDelete();
      })
      .catch(error => {
        setLoader(false);
        console.log('response data', error);
        if (error.response) { 
          AlertService.dangerAlert(error.response.data.error.message);
        } else if (error.request) { 
          AlertService.dangerAlert('Network Error'); 
        } else { 
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
          setCardList([]);
          setLoader(false);
          console.log('Error', response.message);
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('GetSavedCards data Error', error);
      });
  };

  const GetSavedCardsAfterDelete = () => {
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
          if(response.data && response.data?.length ==  0){
            setCardList([]);
            setIsModalVisible(false);
            if (TimeChoosed === '') {
              //setTimeChoosed(TimePeriod[0].time); 
            }
            OrderData[0].service_type === 'pickup'
              ? null
              : PostDeliveryPrice();
            navigation.navigate('PaymentScreen', {
              data: orderID,
              user: userData,
              time: TimeChoosed,
            });
          }
          
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

      setTimeChoosed(TimePeriod[0].time);

      // AlertService.dangerAlert('Please Choose a pickup/delivery time!');
      //AlertOccurred('Alert', 'Please Choose a pickup/delivery time!', 'ok');
      //return;

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
          AlertOccurred('Alert', response.message, 'ok');
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('response data', error);
        if (error.response) { 
          AlertService.dangerAlert(error.response.data.error.message);
        } else if (error.request) { 
          AlertService.dangerAlert('Network Error'); 
        } else { 
          AlertService.dangerAlert('Something Went Wrong');
        }
      });
  };

  const PayInCash = () => {
    let data = {
      restaurantId: restaurantID  
    };
    setLoader(true);
    UserService.Post('restaurant/pay-in-cash', data)
      .then(response => {
         setLoader(false); 
         response.data.map((data, index) => { 
          if(data.pay_in_cash==1)
          {
            setPayCash(true); 
          }
          else
          {
            setPayCash(false); 
          } 
        });

        
      })
      .catch(error => {
        setLoader(false); 
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
          AlertService.dangerAlert(error.response.data.error.message);
        } else if (error.request) { 
          AlertService.dangerAlert('Network Error'); 
        } else { 
          AlertService.dangerAlert('Something Went Wrong');
        }
      });
  };
  const PayWithSavedCard = (cardId) => {
    setCardLoader(true)
    let token = AppUserData.token;
    if (TimeChoosed === '') {
      //setTimeChoosed(TimePeriod[0].time); 
    }
    OrderData[0].service_type === 'pickup'
      ? null
      : PostDeliveryPrice();

    let APIData = {
      orderId: orderID,
      cardId: cardId,
      pickup_delivery_time: TimeChoosed,
    }

    console.log('API Data', APIData);
    UserService.Post('orders/create-payment-intent-with-card', APIData, token)
      .then(response => {
        setCardLoader(false);
        console.log(' PayWithSavedCard Response=>', response);
        let resData
        if (response.error == false && response.data.paymentStatus === "Success") {
          createOrderSuccessMail();
          removeAllItem();
          setIsModalVisible(false);
          navigation.navigate('OrderSuccessScreen', {
            data: orderID,
          });
        } else {
          AlertOccurred('Alert', 'Something went with saved card payment');
          setCardLoader(false);


        }
      })
      .catch(error => {
        setCardLoader(false);
        console.log('response data', error);
        if (error.response) { 
          AlertService.dangerAlert(error.response.data.error.message);
        } else if (error.request) { 
          AlertService.dangerAlert('Network Error'); 
        } else { 
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
          AlertService.dangerAlert('Network Error'); 
        } else { 
          AlertService.dangerAlert('Something Went Wrong');
        }
      });
  };

  const GuestCodOrder = () => {
    if (TimeChoosed === '') {
      setTimeChoosed(TimePeriod[0].time); 
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
          AlertService.dangerAlert(error.response.data.error.message);
        } else if (error.request) { 
          AlertService.dangerAlert('Network Error'); 
        } else { 
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
    UserService.GuestPost('orders/order-success-mail', data)
      .then(response => {
        if (response.error == false) {
          console.log('response of success mail', response); 
        } else { 
          AlertOccurred('Alert', response.message, 'ok');
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('response data', error);
        if (error.response) { 
          AlertService.dangerAlert(error.response.data.error.message);
        } else if (error.request) { 
          AlertService.dangerAlert('Network Error'); 
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
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }

    return data;
  };

  const renderTimePeriod = ({ item, index }) => {
    if(index==0)
     { 
     }
     else{
    if (item.empty) {
      return null;
    } else {
      return (
        <TouchableOpacity
          style={[
            styles.collectionItem,
            {
              backgroundColor: item.isSelected ? constant.BgPrimary : '#FFFFFF',width:'95%'
            },
          ]}
          onPress={() => {
            handleTimePeriod(item.id);
            setIsDelvtimeModalVisible(false);
            setIsStandTime(false);
          }}>
          {  <Ionicons
              name="time-outline"
              size={16}
              color={item.isSelected ? '#fff' : constant.txtColor}
              style={{marginRight: 2}}
            /> }
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
  }
  };
  const renderOrderItems = ({ item, index }) => {
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
        <View style={[styles.innerRow, { justifyContent: 'space-between' }]}>
          <Text style={{ fontSize: 13 }}>
            {item.quantity} X {item.item_name}
          </Text>
          <Text style={{ fontSize: 13 }}>
            £{item.choices !== null ? ItemAndChoiceP : item.item_price}
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
                  <Text style={[styles.itemName, { marginRight: 5 }]}>
                    {data.name}
                  </Text>
                ) : (
                  <Text style={[styles.itemName, { marginRight: 5 }]}>
                    {data.label}
                  </Text>
                )}
                {item.choices.length - 1 == index ? null : (
                  <Text style={[styles.itemName, { marginRight: 5 }]}>+</Text>
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
          style={{ height: 350, width: 400, resizeMode: 'contain' }}
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
    Loader == true ? (
      <ApiLoader />):<SafeAreaView style={styles.container}>
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

     

      {CardLoader == true ?
        (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={'large'} color={GlobalColor.BgPrimary} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-SemiBold',
              color: GlobalColor.boldTxt,
            }}>
            Loading ....
          </Text>
        </View>)
        :
        (<ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: 'white' }}>
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
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{ width: '60%', flexDirection: 'row' }}>
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
                    marginTop:-20,
                  }}>
                  Change
                </Text>
              </TouchableOpacity>
            </View>
          </View>

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
              Delivery option
            </Text>
            </View>
          
          <TouchableOpacity
              onPress={() => {  
                setIsStandTime(!isStandTime);
                // setTimeChoosed(moment(new Date()).add(30, 'm').format('hh:mm a'));
                if (TimePeriod.length > 0) {
                  setTimeChoosed(TimePeriod[0].time);  
                }
                if (isStandTime)
                {
                  setTimeChoosed('');
                }
              }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                paddingHorizontal: 13,
                backgroundColor: '#ffffff',
                borderColor: isStandTime?constant.BgPrimary:'gray',
                borderWidth: isStandTime?2:1,
                borderRadius: 5,
                marginHorizontal: 13,
                marginVertical:5,
                paddingTop: 8,
                paddingBottom: 8,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign:'center',
                    fontFamily: 'Poppins-Bold',
                    color: constant.boldTxt,
                  }}>
           
                  Standard {OrderData[0].delivery_time_min}-{OrderData[0].delivery_time_max} min(s)
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign:'center',
                    fontFamily: 'Poppins-Regular',
                    color: constant.regularTxt,
                  }}>
                   {/*isStandTime?TimeChoosed:''*/}  
                </Text>
              </View>
              </TouchableOpacity>

          <TouchableOpacity
              onPress={() => {  
                setIsDelvtimeModalVisible(true);
                setIsStandTime(false);
              }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                paddingHorizontal: 13,
                backgroundColor: '#fff',
                borderColor: isStandTime?'gray':constant.BgPrimary,
                borderWidth: isStandTime?1:2,
                borderRadius: 5,
                marginHorizontal:13,
                paddingTop: 8,
                paddingBottom: 8,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign:'center',
                    fontFamily: 'Poppins-Bold',
                    color: constant.boldTxt,
                  }}>
                  Scheduled Time

                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign:'center',
                    fontFamily: 'Poppins-Regular',
                    color: constant.regularTxt,
                  }}>
                  {isStandTime?'Choose Delivery Time':TimeChoosed}
                </Text>
              </View>
              </TouchableOpacity>
           
          
          {/* <View
            style={{
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FlatList
              style={{ paddingBottom: 10 }}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id}
              data={formatData(TimePeriod, numColumns)}
              renderItem={renderTimePeriod}
              numColumns={numColumns}
              scrollEnabled={false}
            />
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
            <View style={{ marginTop: 10 }}>

            { PayCash && 
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
            }
              <View style={[styles.payTabStyle, { marginVertical: 10 }]}>
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

                        if(checkshowcard=="0")
                         {
                          onPressRadioBtn('card');
                         }
                         else
                         { 
                           setIsModalVisible(true)
                         }  

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
                onPress={() => {
                  if (TimeChoosed === '') {
                    //setTimeChoosed(TimePeriod[0].time);  
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
                   // setTimeChoosed(TimePeriod[0].time); 
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

          <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  paddingHorizontal:5,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Bold',
                    color: constant.boldTxt,
                  }}> 
                </Text> 
                <TouchableOpacity
                style={styles.addmoreBtn}
                onPress={() => {  
                  navigation.navigate('SingleRestaurantScreen', { 
                  }); 
                  
                }}>
                <Text style={styles.applyBtnTxt}>Add more items</Text>
              </TouchableOpacity> 
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
                  <View style={{ marginVertical: 5 }} />
                )}
                data={OrderItem}
                renderItem={renderOrderItems}
                inverted={OrderData.length > 0 ? true : false}
              />

              <View
                style={[
                  styles.separator,
                  { backgroundColor: GlobalColor.BgPrimary },
                ]}
              />
              {OrderData.map(data => (
                <View
                  style={[styles.innerRow, { justifyContent: 'space-between' }]}>
                  <Text style={[styles.title, { fontSize: 14 }]}>Sub Total</Text>
                  <Text style={[styles.title, { fontSize: 14 }]}>
                    £{data.total_amount}
                  </Text>
                </View>
              ))}

              {OrderData.map(data =>
                data.discount_val === '0.00' || undefined || null ? null : (
                  <View
                    style={[styles.innerRow, { justifyContent: 'space-between' }]}>
                    <Text style={[styles.title, { fontSize: 14 }]}>
                      Restaurant Discount
                    </Text>
                    <Text style={[styles.title, { fontSize: 14 }]}>
                      £{data.discount_val}
                    </Text>
                  </View>
                ),
              )}

              {OrderData.map(data =>
                data.coupon_code === '' || data.coupon_code == null ? null : (
                  <View
                    style={[styles.innerRow, { justifyContent: 'space-between' }]}>
                    <Text style={[styles.title, { fontSize: 14 }]}>
                      {data.coupon_code}
                    </Text>
                    <Text style={[styles.title, { fontSize: 14 }]}>Applied</Text>
                  </View>
                ),
              )}

              {OrderData.map(data =>
                data.coupon_val === '0.00' || undefined ? null : (
                  <View
                    style={[styles.innerRow, { justifyContent: 'space-between' }]}>
                    <Text style={[styles.title, { fontSize: 14 }]}>
                      Coupon Discount
                    </Text>
                    <Text style={[styles.title, { fontSize: 14 }]}>
                      £{data.coupon_val}
                    </Text>
                  </View>
                ),
              )}
              {orderCharge !== null || undefined ? (
                <View
                  style={[styles.innerRow, { justifyContent: 'space-between' }]}>
                  <Text style={[styles.title, { fontSize: 14 }]}>
                    Delivery Charge
                  </Text>
                  <Text style={[styles.title, { fontSize: 14 }]}>
                    £{orderCharge}
                  </Text>
                </View>
              ) : null}
              {OrderData.map(data => {
                return (
                  <View
                    style={[styles.innerRow, { justifyContent: 'space-between' }]}>
                    <Text style={[styles.title, { fontSize: 14 }]}>Total</Text>
                    {FullPrice == 0 ? (
                      <Text style={[styles.title, { fontSize: 14 }]}>
                        £{data.amount_payable}
                      </Text>
                    ) : (
                      <Text style={[styles.title, { fontSize: 14 }]}>
                        £{FullPrice}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ) : null}

          {/* <Modal transparent={true} visible={IsModalVisible}>
            <Pressable
              onPress={() => {
                setIsModalVisible(false);
              }}
              style={{
                backgroundColor: '#000000aa',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  // backgroundColor: 'pink',
                  paddingVertical: 15,
                  borderRadius: 15,
                  width: '95%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>

                <Text style={{ fontSize: 16, fontWeight: 'bold', color: GlobalColor.BgSuccess, marginBottom: 8 }}>Pay With Saved Card </Text>
                <View style={{ width: '70%', alignSelf: 'center', borderTopWidth: 2, marginBottom: 5, borderColor: 'gray' }} />
                <FlatList
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => item.id}
                  ItemSeparatorComponent={() => (
                    <View style={{ marginVertical: 5 }} />
                  )}
                  data={CardList}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          PayWithSavedCard(item.id);
                        }}
                        style={styles.cardView}>
                        <View
                          style={styles.debitView}>
                          <Image
                            source={require('../../../assets/images/atm-card.png')}
                            style={{ height: 30, width: 30, resizeMode: 'contain' }}
                          />
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={{ color: GlobalColor.BgPrimary, marginLeft: '20%', fontWeight: 'bold', }}>
                            Credit Card **** **** **** {item.last4}
                          </Text>
                          <Text style={{ color: 'black', alignSelf: 'flex-end', fontSize: 13, marginVertical: 8 }}>
                            Expiry Date - {item.exp_year}
                          </Text>
                          <Text style={{ color: 'black', alignSelf: 'flex-end', fontSize: 13 }}>
                            Card Type - {item.brand}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </Pressable>
          </Modal> */}


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
                   // setTimeChoosed(TimePeriod[0].time); 
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
                  contentContainerStyle={{marginTop:15,justifyContent: 'center'}}
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
                          setIsModalVisible()
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
            visible={isDelvtimeModalVisible}
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
                      marginTop: 15,
                    marginBottom:15,
                    flexDirection: 'row',
                    width: '90%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                    <Text
                       style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Bold',
                        color: constant.boldTxt,
                      }}>
                      Select Delivery Time
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIsDelvtimeModalVisible(!isDelvtimeModalVisible);
                      }}
                      style={{}}>
                      <Ionicons
                        name="close"
                        size={16}
                        color={constant.txtColor}
                        style={{ marginRight: 2 }}
                      />
                    </TouchableOpacity>
                </View>
                <FlatList
                  style={{ paddingBottom: 20 }}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item.id}
                  data={formatData(TimePeriod, 1)}
                  renderItem={renderTimePeriod}
                  numColumns={1}
                  scrollEnabled={true}
                />
              </View>
            </View>
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
                      style={{ marginRight: 2 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>)}
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


  addmoreBtn: {
    height: 25,
    width: 120,
    backgroundColor: constant.BgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom:6,
    marginTop:6,
  },
  applyBtnTxt: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
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
    width: '95%',
    // paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  debitView: {
    height: 60,
    width: 60,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
export default OrderPayScreen;
