import React, { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import bgIcon from '../../../assets/images/demo.png';
import rightIcon from '../../../assets/images/right_arrow_nrml.png';
import heartIcon from '../../../assets/images/newHeart.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AuthContext from '../../context/AuthContext';
import constant from '../../constant/constant';
import Spinner from 'react-native-loading-spinner-overlay';
import UserService from '../../Services/UserService';
import AlertService from '../../Services/AlertService';
import GlobalColor from '../../constant/constant';
import moment from 'moment';
import ApiLoader from '../../components/ApiLoader';

//user/user-order-history
const OrderDetails = ({ navigation, route }) => {
  console.log('Order ID', route.params.data);
  let OrderId = route.params.data;
  const { authContext, AppUserData } = useContext(AuthContext);
  const [OrderData, setOrderData] = useState([]);
  const [OrderItem, setOrderItem] = useState([]);
  const [Loader, setLoader] = useState(false);

  useEffect(() => {
    if (AppUserData.token !== undefined || null) {
      getOrderDetails();
    } else {
      getGuestOrderDetails();
    }
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
    console.log('Token', token);
    let data = {
      orderId: OrderId,
      // orderId: 58,
    };
    console.log('Data', data);
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
    let data = {
      orderId: OrderId,
      // orderId: 58,
    };
    console.log('Data', data);
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
    console.log('Item Price', ItemP);
    console.log('Choice Item Price', ChoiceItemP);
    console.log('Both Item Price', ItemAndChoiceP);
    return (
      <View style={styles.orderInfo2}>
        <View style={[styles.innerRow, { justifyContent: 'space-between' }]}>
          <Text style={[styles.title, { fontSize: 14 }]}>
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
      {Loader ? (
        <View style={{ flex: 1 }} />
      ) : (
        <View style={{ width: '100%', height: '100%' }}>
          <View
            style={{
              marginTop: Platform.OS === 'android' ? 15 : 10,
              alignItems: 'center',
              flexDirection: 'row',
              width: '95%',
            }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name={'chevron-back'}
                  color={constant.mediumTxt}
                  size={20}
                />
              </TouchableOpacity>
              <Text style={styles.heading}>Order Details</Text>
            </View>
          </View>
          <ScrollView
            style={{
              width: '100%',
              height: '100%',
              flex: 1,
            }}>
            <View style={styles.orderInfo}>
              <Text style={styles.headerName}>Order Info</Text>
              <View style={styles.infoView}>
                <MaterialIcons
                  name="storefront"
                  color={GlobalColor.BgPrimary}
                  size={20}
                />
                <View style={styles.innerRow}>
                  <Text style={[styles.title, { marginHorizontal: 10 }]}>
                    Restaurant Name :
                  </Text>
                  {OrderItem.length == 0 ? null : (
                    <Text style={styles.subTitle}>
                      {OrderItem[0].restaurant_name}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoView}>
                <MaterialIcons
                  name="calendar-today"
                  color={GlobalColor.BgPrimary}
                  size={20}
                />
                <View style={styles.innerRow}>
                  <Text style={[styles.title, { marginHorizontal: 10 }]}>
                    Order ID :
                  </Text>
                  {OrderData.length == 0 ? null : (
                    <Text style={styles.subTitle}>{OrderData[0].order_id}</Text>
                  )}
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoView}>
                <MaterialIcons
                  name="map"
                  color={GlobalColor.BgPrimary}
                  size={20}
                />
                <View style={styles.innerRow}>
                  <Text style={[styles.title, { marginHorizontal: 10 }]}>
                    Address :
                  </Text>
                  {OrderData.length > 0 ? (
                    <View style = {{width:'30%',flexDirection:'row'}}>
                      {OrderData[0].address1 === '' || null || undefined ? null : (
                        <Text style={styles.subTitle}>{OrderData[0].address1}</Text>
                      )}
                        {OrderData[0].address1 === '' || null || undefined ? null : (
                        <Text style={styles.subTitle}>, </Text>
                      )}
                      {OrderData[0].address2 === '' || null || undefined ? null : (
                        <Text style={styles.subTitle}>{OrderData[0].address2}</Text>
                      )}
                         {OrderData[0].address2 === '' || null || undefined ? null : (
                        <Text style={styles.subTitle}>, </Text>
                      )}
                       {OrderData[0].city === '' || null || undefined ? null : (
                        <Text style={styles.subTitle}>{OrderData[0].city}</Text>
                      )}
                         {OrderData[0].city === '' || null || undefined ? null : (
                        <Text style={styles.subTitle}>, </Text>
                      )}
                      {OrderData[0].postcode === '' || null || undefined ? null : (
                        <Text style={styles.subTitle}>, {OrderData[0].postcode}</Text>
                      )}
                    </View>

                  ) : null}
                </View>
              </View>
              {/* <View style={styles.infoView}>
            <MaterialIcons name="map" color={GlobalColor.BgPrimary} size={20} />
            <View style={styles.innerRow}>
              <Text style={[styles.title, {marginHorizontal: 10}]}>
                Address 2 :
              </Text>
              {OrderData.length > 0 ? (
                <Text style={styles.subTitle}>{OrderData[0].address2}</Text>
              ) : null}
            </View>
          </View> */}
              <View style={styles.separator} />
              <View style={styles.infoView}>
                <MaterialIcons
                  name="phone-iphone"
                  color={GlobalColor.BgPrimary}
                  size={20}
                />
                <View style={styles.innerRow}>
                  <Text style={[styles.title, { marginHorizontal: 10 }]}>
                    Phone Number :
                  </Text>
                  {OrderData.length > 0 ? (
                    <Text style={styles.subTitle}>{OrderData[0].phone}</Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoView}>
                <MaterialIcons
                  name="local-shipping"
                  color={GlobalColor.BgPrimary}
                  size={20}
                />
                <View style={styles.innerRow}>
                  <Text style={[styles.title, { marginHorizontal: 10 }]}>
                    Service Type :
                  </Text>
                  {OrderData.length > 0 ? (
                    <Text style={styles.subTitle}>
                      {OrderData[0].service_type}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoView}>
                <MaterialIcons
                  name="calendar-today"
                  color={GlobalColor.BgPrimary}
                  size={20}
                />
                <View style={styles.innerRow}>
                  <Text style={[styles.title, { marginHorizontal: 10 }]}>
                    Collection Time :
                  </Text>
                  {OrderData.length > 0 ? (
                    <Text style={styles.subTitle}>
                      {OrderData[0].pickup_time}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoView}>
                <MaterialIcons
                  name="credit-card"
                  color={GlobalColor.BgPrimary}
                  size={20}
                />
                <View style={styles.innerRow}>
                  <Text style={[styles.title, { marginHorizontal: 10 }]}>
                    Payment Type :
                  </Text>
                  {OrderData.length > 0 ? (
                    <Text style={styles.subTitle}>
                      {OrderData[0].payment_mode}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoView}>
                <MaterialIcons
                  name="credit-card"
                  color={GlobalColor.BgPrimary}
                  size={20}
                />
                <View style={styles.innerRow}>
                  <Text style={[styles.title, { marginHorizontal: 10 }]}>
                    Payment Status :
                  </Text>
                  {OrderData.length > 0 ? (
                    <Text style={styles.subTitle}>
                      {OrderData[0].payment_status}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoView}>
                <MaterialIcons
                  name="calendar-today"
                  color={GlobalColor.BgPrimary}
                  size={20}
                />
                <View style={styles.innerRow}>
                  <Text style={[styles.title, { marginHorizontal: 10 }]}>
                    Order Placed On :
                  </Text>
                  {OrderData.length > 0 ? (
                    <Text style={styles.subTitle}>
                      {OrderData[0].order_date == null
                        ? null
                        : moment(OrderData[0].order_date).format(
                          'MMMM D YYYY  h : mm a',
                        )}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.separator} />
              {/* <View style={styles.infoView}>
                <MaterialIcons
                  name="coronavirus"
                  color={GlobalColor.BgPrimary}
                  size={20}
                />
                <View style={styles.innerRow}>
                  <Text style={[styles.title, {marginHorizontal: 10}]}>
                    Allergies :
                  </Text>
                  {OrderData.length > 0 ? (
                    <Text style={styles.subTitle}>
                      {OrderData[0].allergy_info == undefined || null
                        ? null
                        : OrderData[0].allergy_info}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.separator} /> */}
              <View style={styles.infoView}>
                <MaterialIcons
                  name="content-paste"
                  color={GlobalColor.BgPrimary}
                  size={20}
                />
                <View style={styles.innerRow}>
                  <Text style={[styles.title, { marginHorizontal: 10 }]}>
                    Order Instructions :
                  </Text>
                  {OrderData.length > 0 ? (
                    <View style={{ width: '50%' }}>
                      <Text style={styles.subTitle}>
                        {OrderData[0].special_instruction == undefined || null
                          ? null
                          : OrderData[0].special_instruction}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
            {OrderData.length && OrderId.length !== 0 ? (
              <View style={styles.orderDetails}>
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
                    style={[
                      styles.innerRow,
                      { justifyContent: 'space-between' },
                    ]}>
                    <Text style={[styles.title, { fontSize: 14 }]}>
                      Sub Total
                    </Text>
                    <Text style={[styles.title, { fontSize: 14 }]}>
                      £ {data.total_amount}
                    </Text>
                  </View>
                ))}
                {OrderData.map(data =>
                  data.deliveryCharge == null ? null : (
                    <View
                      style={[
                        styles.innerRow,
                        { justifyContent: 'space-between' },
                      ]}>
                      <Text style={[styles.title, { fontSize: 14 }]}>
                        Delivery Charge
                      </Text>
                      <Text style={[styles.title, { fontSize: 14 }]}>
                        £ {data.deliveryCharge}
                      </Text>
                    </View>
                  ),
                )}
                {OrderData.map(data =>
                  data.discount_val === '0.00' || undefined || null ? null : (
                    <View
                      style={[
                        styles.innerRow,
                        { justifyContent: 'space-between' },
                      ]}>
                      <Text style={[styles.title, { fontSize: 14 }]}>
                        Restaurant Discount
                      </Text>
                      <Text style={[styles.title, { fontSize: 14 }]}>
                        £ {data.discount_val}
                      </Text>
                    </View>
                  ),
                )}

                {OrderData.map(data =>
                  data.coupon_code === '' || data.coupon_code == null ? null : (
                    <View
                      style={[
                        styles.innerRow,
                        { justifyContent: 'space-between' },
                      ]}>
                      <Text style={[styles.title, { fontSize: 14 }]}>
                        {data.coupon_code}
                      </Text>
                      <Text style={[styles.title, { fontSize: 14 }]}>
                        Applied
                      </Text>
                    </View>
                  ),
                )}

                {OrderData.map(data =>
                  data.coupon_val === '0.00' || undefined ? null : (
                    <View
                      style={[
                        styles.innerRow,
                        { justifyContent: 'space-between' },
                      ]}>
                      <Text style={[styles.title, { fontSize: 14 }]}>
                        Coupon Discount
                      </Text>
                      <Text style={[styles.title, { fontSize: 14 }]}>
                        £ {data.coupon_val}
                      </Text>
                    </View>
                  ),
                )}
                {OrderData.map(data => (
                  <View
                    style={[
                      styles.innerRow,
                      { justifyContent: 'space-between' },
                    ]}>
                    <Text style={[styles.title, { fontSize: 14 }]}>Total</Text>
                    <Text style={[styles.title, { fontSize: 14 }]}>
                      £ {data.amount_payable}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <EmptyView />
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  header: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10
  },
  heading: {
    width: '80%',
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    fontWeight: '700',
    textAlign: 'center',
    alignSelf: 'center',
    color: constant.boldTxt,
  },
  headerName: {
    width: '80%',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    fontWeight: '700',
    color: constant.boldTxt,
    alignSelf: 'flex-start',
  },
  orderInfo: {
    width: '95%',
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    padding: 15,
    alignSelf: 'center',
  },
  orderInfo2: {
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
    backgroundColor: GlobalColor.normalTxt,
    marginVertical: 5,
  },
  orderDetails: {
    width: '95%',
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
    marginBottom: 10,
  },
  itemName: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: GlobalColor.mediumTxt,
  },
});

//make this component available to the app
export default OrderDetails;
