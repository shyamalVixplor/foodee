import React, {useState, useEffect, useContext} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Dimensions,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import {Platform} from 'react-native';
import GlobalColor from '../../constant/constant';
import Spinner from 'react-native-loading-spinner-overlay';
import UserService from '../../Services/UserService';
import AlertService from '../../Services/AlertService';
import AuthContext from '../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import ApiLoader from '../../components/ApiLoader';

// create a component
const TrackOrder2 = ({navigation, route}) => {
  const OrderId =
    route.params.data.orderID == null || undefined
      ? route.params.data
      : route.params.data.orderID;
  const FromPage =
    route.params.data.from == undefined || null ? null : route.params.data.from;
  const {AppUserData} = useContext(AuthContext);
  const [OrderData, setOrderData] = useState([]);
  const [OrderItem, setOrderItem] = useState([]);
  const [Loader, setLoader] = useState(false);
  const [Status, setStatus] = useState([]);

  const MINUTE_MS = 5000;

  useEffect(() => {
    console.log('Previous page Data', route.params.data.orderID);
    console.log('Order ID ', OrderId);
    if (AppUserData.token !== undefined || null) {
      getOrderDetails();
      getOrderTracking();
    } else {
      getGuestOrderDetails();
      getGuestOrderTracking();
    }

    const interval = setInterval(() => { 
      console.log('Logs every minute');
      if (AppUserData.token !== undefined || null) { 
      getOrderTrackingInterval();
      } else { 
      getGuestOrderTrackingInterval();
      } 
    }, MINUTE_MS);
  
    return () => clearInterval(interval); 


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

  const getOrderDetails = () => {
    let token = AppUserData.token;
    let data = {
      orderId: OrderId,
      // orderId: 58,
    };
    console.log('Order Details Data', data);
    setLoader(true);
    UserService.Post('user/order-details', data, token)
      .then(response => {
        setLoader(false);
        console.log('Order Details=>', response);
        // return;
        if (response.error == false) {
          setOrderData(response.data.order);
          setOrderItem(response.data.order_items);
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setOrderData([]);
          setOrderItem([]);

          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('response data', error);
        if (error.response) {
          // client received an error response (5xx, 4xx)
          // AlertService.dangerAlert(error.response.data.error.message);
          AlertOccurred('Alert', error.response.data.error.message, 'ok');
        } else if (error.request) {
          // client never received a response, or request never left
          // AlertService.dangerAlert('Network Error');
          AlertOccurred('Alert', 'Network Error', 'ok');
          // console.log("error.request", error.request._response);
        } else {
          // anything else
          // AlertService.dangerAlert('Something Went Wrong');
          AlertOccurred('Alert', 'Something Went Wrong', 'ok');
        }
      });
  };

  const getGuestOrderDetails = () => {
    // console.log('getGuestOrderDetails called');
    let token = AppUserData.token;
    let data = {
      orderId: OrderId,
      // orderId: 58,
    };
    console.log('Order Details Data', data);
    setLoader(true);
    UserService.GuestPost('user/order-details', data)
      .then(response => {
        setLoader(false);
        console.log('Order Details=>', response);
        // return;
        if (response.error == false) {
          setOrderData(response.data.order);
          setOrderItem(response.data.order_items);
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setOrderData([]);
          setOrderItem([]);

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


  const getOrderTrackingInterval = () => {
    let token = AppUserData.token;
    let data = {
      orderId: OrderId,
    };
    console.log('Order Tracking Data', data); 
    UserService.Post('orders/order-tracking', data, token)
      .then(response => { 
        console.log('Order Tracking =>', response);
        if (response.error == false) {
          let customStatus = [];
          let responseData = response.data;
          let activePosition;
          responseData.map((data, index) => {
            customStatus.push({
              label:
                data.status === 'driver_on_way'
                  ? 'Collection'
                  : data.status.replace(/(^|_)./g, s =>
                      s.slice(-1).toUpperCase(),
                    ),
              status:
                data.status === 'placed'
                  ? 'Your order has been placed.'
                  : data.status === 'accepted'
                  ? 'Your order has been accepted.'
                  : data.status === 'completed'
                  ? 'Your order is completed'
                  : 'Collection',

              dateTime: data.created
                ? moment(data.created).format('llll')
                : 'Not updated yet',
              isActive: data.isActive,
              order: data.order,
            });
          });

          responseData.forEach((element, index) =>
            element.isActive === 'true'
              ? (activePosition = element.order)
              : (activePosition = null),
          );
          console.log('customStatus', customStatus);
          console.log('activePosition', activePosition);
          setStatus(customStatus);
          // setCurrentPosition(activePosition);

          // AlertService.successAlert(response.message);
        } else { 
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

  const getOrderTracking = () => {
    let token = AppUserData.token;
    let data = {
      orderId: OrderId,
    };
    console.log('Order Tracking Data', data);
    setLoader(true);
    UserService.Post('orders/order-tracking', data, token)
      .then(response => {
        setLoader(false);
        console.log('Order Tracking =>', response);
        if (response.error == false) {
          let customStatus = [];
          let responseData = response.data;
          let activePosition;
          responseData.map((data, index) => {
            customStatus.push({
              label:
                data.status === 'driver_on_way'
                  ? 'Collection'
                  : data.status.replace(/(^|_)./g, s =>
                      s.slice(-1).toUpperCase(),
                    ),
              status:
                data.status === 'placed'
                  ? 'Your order has been placed.'
                  : data.status === 'accepted'
                  ? 'Your order has been accepted.'
                  : data.status === 'completed'
                  ? 'Your order is completed'
                  : 'Collection.',

              dateTime: data.created
                ? moment(data.created).format('llll')
                : 'Not updated yet',
              isActive: data.isActive,
              order: data.order,
            });
          });

          responseData.forEach((element, index) =>
            element.isActive === 'true'
              ? (activePosition = element.order)
              : (activePosition = null),
          );
          console.log('customStatus', customStatus);
          console.log('activePosition', activePosition);
          setStatus(customStatus);
          // setCurrentPosition(activePosition);

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


  const getGuestOrderTrackingInterval = () => {
    console.log('getGuestOrderTracking called');
    let token = AppUserData.token;
    let data = {
      orderId: OrderId,
    }; 
    UserService.GuestPost('orders/order-tracking', data)
      .then(response => {
        setLoader(false);
        console.log('Order Tracking =>', response);
        if (response.error == false) {
          let customStatus = [];
          let responseData = response.data;
          let activePosition;
          responseData.map((data, index) => {
            customStatus.push({
              label:
                data.status === 'driver_on_way'
                  ? 'Collection'
                  : data.status.replace(/(^|_)./g, s =>
                      s.slice(-1).toUpperCase(),
                    ),
              status:
                data.status === 'placed'
                  ? 'Your order has been placed.'
                  : data.status === 'accepted'
                  ? 'Your order has been accepted.'
                  : data.status === 'completed'
                  ? 'Your order is completed'
                  : 'Collection.',
                  

              dateTime: data.created
                ? moment(data.created).format('llll')
                : 'Not updated yet',
              isActive: data.isActive,
              order: data.order,
            });
          });

          responseData.forEach((element, index) =>
            element.isActive === 'true'
              ? (activePosition = element.order)
              : (activePosition = null),
          );
          console.log('customStatus', customStatus);
          console.log('activePosition', activePosition);
          setStatus(customStatus); 
        } else { 
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

  const getGuestOrderTracking = () => {
    console.log('getGuestOrderTracking called');
    let token = AppUserData.token;
    let data = {
      orderId: OrderId,
    };
    console.log('Order Tracking Data', data);
    setLoader(true);
    UserService.GuestPost('orders/order-tracking', data)
      .then(response => {
        setLoader(false);
        console.log('Order Tracking =>', response);
        if (response.error == false) {
          let customStatus = [];
          let responseData = response.data;
          let activePosition;
          responseData.map((data, index) => {
            customStatus.push({
              label:
                data.status === 'driver_on_way'
                  ? 'Collection'
                  : data.status.replace(/(^|_)./g, s =>
                      s.slice(-1).toUpperCase(),
                    ),
              status:
                data.status === 'placed'
                  ? 'Your order has been placed.'
                  : data.status === 'accepted'
                  ? 'Your order has been accepted.'
                  : data.status === 'completed'
                  ? 'Your order is completed'
                  : 'Collection.',

              dateTime: data.created
                ? moment(data.created).format('llll')
                : 'Not updated yet',
              isActive: data.isActive,
              order: data.order,
            });
          });

          responseData.forEach((element, index) =>
            element.isActive === 'true'
              ? (activePosition = element.order)
              : (activePosition = null),
          );
          console.log('customStatus', customStatus);
          console.log('activePosition', activePosition);
          setStatus(customStatus);
          // setCurrentPosition(activePosition);

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

  const EmptyView = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        {/* <Image
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
        </Text> */}
      </View>
    );
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
    console.log('Item Price', ItemP);
    console.log('Choice Item Price', ChoiceItemP);
    console.log('Both Item Price', ItemAndChoiceP);
    return (
      <View style={styles.orderInfo}>
        <View style={[styles.innerRow, {justifyContent: 'space-between'}]}>
          <Text style={[styles.title, {fontSize: 14}]}>
            {item.quantity} X {item.item_name}
          </Text>
          <Text style={styles.subTitle}>
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
  return (
    Loader == true ? (
      <ApiLoader />):<SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <View style={styles.navItem}>
          <TouchableOpacity
            onPress={() => {
              if (FromPage === 'orderHistory') {
                navigation.goBack();
              } else {
                navigation.jumpTo('HomeStackNavigator', {
                  screen: 'HomeScreen',
                });
              }
            }}>
            <Image source={backIcon} resizeMode={'contain'} style={{}} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Poppins-Medium',
              color: '#4A4B4D',
            }}>
            TrackOrder
          </Text>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Poppins-Medium',
            fontWeight: '700',
            color: GlobalColor.mediumTxt,
          }}>
          Order Summary
        </Text>
      </View>

      <ScrollView>
        {OrderData.length && OrderId.length !== 0 ? (
          <View style={styles.orderDetails}>
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

            <View style={styles.separator} />
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
              data.deliveryCharge == null ? null : (
                <View
                  style={[styles.innerRow, {justifyContent: 'space-between'}]}>
                  <Text style={[styles.title, {fontSize: 14}]}>
                    Delivery Charge
                  </Text>
                  <Text style={[styles.title, {fontSize: 14}]}>
                    £ {data.deliveryCharge}
                  </Text>
                </View>
              ),
            )}

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

            {/* {OrderData.map(data => (
              <View
                style={[styles.innerRow, {justifyContent: 'space-between'}]}>
                {data.discount_type === 'percentage' ? (
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Medium',
                      color: GlobalColor.BgPrimary,
                    }}>
                    Flat {data.discount_val} % OFF ON ALL ORDERS OVER £
                    {conditionalAmount}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Medium',
                      color: GlobalColor.BgPrimary,
                    }}>
                    Flat £{data.discount_val} OFF ON ALL ORDERS OVER £
                    {conditionalAmount}
                  </Text>
                )}
              </View>
            ))} */}

            {OrderData.map(data => (
              <View
                style={[styles.innerRow, {justifyContent: 'space-between'}]}>
                <Text style={[styles.title, {fontSize: 14}]}>Total</Text>
                <Text style={[styles.title, {fontSize: 14}]}>
                  £ {data.amount_payable}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyView />
        )}

        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}>
          {Status.map((data, index) => {
            // console.log('data of Status', data);
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: 30,
                  }}>
                  <View
                    style={{
                      height: 25,
                      width: 25,
                      borderRadius: 25,
                      backgroundColor:
                        data.isActive === 'true'
                          ? GlobalColor.BgPrimary
                          : GlobalColor.regularTxt,
                      justifyContent: 'flex-start',
                      marginBottom: Status.length - 1 == index ? 60 : null,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Ionicons
                      name="chevron-down"
                      size={12}
                      color={'#fff'}
                    />
                  </View>
                  {Status.length - 1 == index ? null : (
                    <View
                      style={{
                        height: 68,
                        width: 2,
                        backgroundColor:
                          data.isActive === 'true'
                            ? GlobalColor.BgPrimary
                            : GlobalColor.regularTxt,
                      }}
                    />
                  )}
                </View>
                <View
                  style={{
                    width: '60%',
                    height: '100%',
                  }}>
                  <Text style={styles.lblText}>{data.label}</Text>
                  <Text style={[styles.lblStatus, {marginTop: 5}]}>
                    {data.status}
                  </Text>
                  <Text style={styles.lblStatus}>{data.dateTime}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          console.log('fgyusdjfsui');
          //  navigation.navigate('ProfileStackNavigator', {
          //     screen: 'OrderDetails',
          //     params: {
          //       data: OrderId,
          //     },
          //   });
          navigation.navigate('OrderDetails', {data: OrderId});
        }}
        style={styles.saveBtn}>
        <Text style={styles.saveBtnTxt}>Order Details</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
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
  orderInfo: {
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    fontWeight: '700',
    color: GlobalColor.mediumTxt,
  },
  subTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Light',
    fontWeight: '700',
    color: GlobalColor.mediumTxt,
  },
  infoView: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
  },
  innerRow: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: GlobalColor.BgPrimary,
    marginVertical: 8,
  },
  orderDetails: {
    width: '90%',
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
    padding: 15,
    borderRadius: 10,
  },
  lblText: {
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    fontWeight: '700',
    color: GlobalColor.boldTxt,
  },
  lblStatus: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: GlobalColor.boldTxt,
  },
  saveBtn: {
    marginBottom: 20,
    ///paddingHorizontal:25,
    backgroundColor: GlobalColor.BgPrimary,
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
  itemName: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: GlobalColor.mediumTxt,
  },
});

//make this component available to the app
export default TrackOrder2;
