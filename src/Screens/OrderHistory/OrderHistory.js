import React, {useContext, useEffect, useState} from 'react';
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
  Modal,
  Pressable,
  TextInput,
  Alert,
  KeyBoard,
} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import bgIcon from '../../../assets/images/demo.png';
import rightIcon from '../../../assets/images/right_arrow_nrml.png';
import heartIcon from '../../../assets/images/newHeart.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import AuthContext from '../../context/AuthContext';
import constant from '../../constant/constant';
import Spinner from 'react-native-loading-spinner-overlay';
import UserService from '../../Services/UserService';
import AlertService from '../../Services/AlertService';
import GlobalColor from '../../constant/constant';
import moment from 'moment';
import {Rating, AirbnbRating} from 'react-native-ratings';
import ApiLoader from '../../components/ApiLoader';

//user/user-order-history
const OrderHistory = ({navigation, route}) => {
  const userID = route.params.data;
  // console.log('User ID', userID);
  const {authContext, AppUserData} = useContext(AuthContext);
  const [WarningVisible, setWarningVisible] = useState(false);
  const [SuccessVisible, setSuccessVisible] = useState(false);
  const [OrderData, setOrderData] = useState([]);
  const [RestaurantData, setRestaurantData] = useState([]);
  const [Loader, setLoader] = useState(false);
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [StarRating, setStarRating] = useState(0);
  const [Title, setTitle] = useState('');
  const [ResId, setResId] = useState('');
  const [OrderId, setOrderId] = useState('');
  const [PageNo, setPageNo] = React.useState();
  const [DataCount, setDataCount] = React.useState(0);


  useEffect(() => {
    getUserOrderHistory();
  }, []);

  const ratingCompleted = rating => {
    console.log('Rating is: ' + rating);
    setStarRating(rating);
  };

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

  const getUserOrderHistory = () => {
    let token = AppUserData.token;
    let id = userID;
    if (id == null || undefined) {
      return;
    }
    let data = {
      user_id: id,
      page: 1,
    };
    console.log('OrderHistory api data', data);
    setLoader(true);
    UserService.Post('user/user-order-history', data, token)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          let responseData = response.data.order;
          console.log('Order Data', responseData);
          setOrderData(responseData);
          setPageNo(1);
          setDataCount(response.data.recordCount);
          setRestaurantData(responseData.restaurant_detail);
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          setOrderData([]);
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

  const getUserOrderHistoryOnEndReach = () => {
    console.log('Order data length', OrderData.length);
    console.log('Order data Count', DataCount);
    if (OrderData.length >= DataCount) {
      return;
    }
    if (OrderData.length < DataCount) {
      let page = PageNo + 1;
      console.log('New page no', page);
      setPageNo(page);
      let token = AppUserData.token;
      let id = userID;
      if (id == null || undefined) {
        return;
      }
      let data = {
        user_id: id,
        page: page,
      };
      console.log('OrderHistory api data', data);
      setLoader(true);
      UserService.Post('user/user-order-history', data, token)
        .then(response => {
          setLoader(false);
          console.log('Response=>', response);
          if (response.error == false) {
            let responseData = response.data.order;
            setOrderData(prevData => [...prevData, ...responseData]);
            // AlertService.successAlert(response.message);
          } else {
            setLoader(false);
            setOrderData([]);
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
    }
  };

  const AddRatingReview = apiData => {
    let token = AppUserData.token;
    let id = userID;
    if (id == null || undefined) {
      return;
    }
    let data = apiData;
    console.log('Rating Review Data', data);
    console.log('User Token', token);
    // return;
    setLoader(true);
    UserService.Post('restaurant/add-review', data, token)
      .then(response => {
        setLoader(false);
        setTitle('');
        setIsModalVisible(false);
        getUserOrderHistory();
        console.log('Response=>', response);
        if (response.error == false) {
          setSuccessVisible(true);
        } else {
          setLoader(false);
          setWarningVisible(true);
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

  const renderOrderHistory = ({item, index}) => {
    return (
      <View
        style={{
          width: '98%',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          margin: 5,
          paddingVertical: 10,
        }}>
        <View style={styles.orderView}>
          <Image
            source={{uri: item.image_url}}
            // source={require('../../../assets/images/restaurant.png')}
            style={{height: 50, width: 50, resizeMode: 'cover'}}
          />
          <View>
            <Text style={styles.title}>{item.name}</Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Medium',
                fontWeight: '700',
                color: GlobalColor.boldTxt,
              }}>
              {item.address1}
            </Text>
 
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'Poppins-Regular',
                fontWeight: '700',
                color: GlobalColor.regularTxt,
              }}>
              {moment(item.created_on).format('MMMM Do YYYY')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // backgroundColor: 'pink',
                justifyContent: 'space-between',
              }}>
              <Text style={[styles.subTitle, {fontFamily: 'Poppins-Medium'}]}>
                OrderId-{item.orderId}
              </Text>
              <Text style={[styles.subTitle, {color: GlobalColor.BgPrimary}]}>
                £ {item.total_amount}
              </Text>
            </View>
          </View>
          <View style={{width:'32%',alignItems:'flex-end'}}>
            {item.order_status === 'pending' ? (
              <View style={{width: '100%', justifyContent: 'flex-end'}}>
                <Text style={[styles.subTitle, {color: GlobalColor.BgPrimary}]}>
                  Pending Order
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  let AllData = {
                    orderID: item.orderId,
                    from: 'orderHistory',
                  };
                  // navigation.navigate('OrderDetails', {data: item.orderId});
                  navigation.navigate('TrackOrder2', {data: AllData});
                }}
                style={{
                  width: '100%',
                  borderWidth: 1,
                  borderColor: GlobalColor.BgPrimary,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 6,
                  marginTop: item.order_status === 'completed' ? '18%' : null,
                }}>
                <Text style={[styles.subTitle, {color: GlobalColor.BgPrimary}]}>
                  View Details
                </Text>
              </TouchableOpacity>
            )}
            <View
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor:
                  item.order_status == 'placed'
                    ? GlobalColor.BgPrimary
                    : item.order_status == 'accepted'
                    ? GlobalColor.BgWarning
                    : item.order_status == 'driver_on_way'
                    ? '#2D4DF4'
                    : item.order_status == 'ready_to_pickup'
                    ? '#911FF3'
                    : GlobalColor.BgSuccess,
                justifyContent: 'center',
                alignItems: 'center',
                width:'100%',
                paddingVertical: 3,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Medium',
                  fontWeight: '700',
                  color:
                    item.order_status == 'placed'
                      ? GlobalColor.BgPrimary
                      : item.order_status == 'accepted'
                      ? GlobalColor.BgWarning
                      : item.order_status == 'driver_on_way'
                      ? '#2D4DF4'
                      : item.order_status == 'ready_to_pickup'
                      ? '#911FF3'
                      : GlobalColor.BgSuccess,
                }}>
                {item.order_status === 'placed'
                  ? 'Placed'
                  : item.order_status === 'accepted'
                  ? 'Accepted.'
                  : item.order_status === 'completed'
                  ? 'Completed'
                  : 'Driver on way'}
              </Text>
            </View>
            {item.order_status === 'completed' &&
            (item.ratings && item.review) == null ? (
              <TouchableOpacity
                onPress={() => {
                  setResId(item.restaurant_id);
                  setOrderId(item.orderId);
                  setIsModalVisible(true);
                }}
                style={{
                  width: 120,
                  backgroundColor: GlobalColor.BgPrimary,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 6,
                  marginTop: 10,
                }}>
                <Text style={[styles.subTitle, {color: '#fff'}]}>
                  Add Review
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    Loader == true ? (
      <ApiLoader />):<SafeAreaView style={styles.container}>
      <View
        style={{
          marginTop: Platform.OS === 'android' ? 15 : 10,
          alignItems: 'center',
          flexDirection: 'row',
          width: '95%',
        }}>
        <View
          style={{
            width: '85%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{paddingLeft: 10}}>
            <Ionicons
              name={'chevron-back'}
              color={constant.mediumTxt}
              size={25}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>Order History</Text>
        </View>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.orderId}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        data={OrderData}
        renderItem={renderOrderHistory}
        onEndReached={getUserOrderHistoryOnEndReach}
        onEndReachedThreshold={0.5}
      />
      <Modal transparent={true} visible={IsModalVisible}>
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
              padding: 20,
              borderRadius: 15,
              width: '90%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 16,
                color: constant.boldTxt,
              }}>
              How was your experience with us?
            </Text>
            <Rating
              type="star"
              ratingCount={5}
              imageSize={40}
              showRating
              // fractions={1}
              startingValue={0}
              onFinishRating={ratingCompleted}
            />
            <TextInput
              placeholder="Tell us how can we improve?"
              value={Title}
              placeholderTextColor={constant.mediumTxt}
              onChangeText={txt => {
                setTitle(txt);
              }}
              multiline={true}
              style={[styles.inputStyleModal, {marginTop: 20}]}
            />

            <TouchableOpacity
              onPress={() => {
                if (StarRating == 0 && Title === '') {
                  AlertService.warningAlert('Please add rating and review');
                } else if (StarRating == 0) {
                  AlertService.warningAlert('Please add rating');
                } else if (Title === '') {
                  AlertService.warningAlert('Please add  review');
                } else {
                  // console.log(
                  //   `Your Rating is ${Rating} and Your Review is ${Title}`,
                  // );
                  let apiData = {
                    restaurant_id: ResId,
                    review: Title,
                    ratings: StarRating,
                    orderId: OrderId,
                  };

                  AddRatingReview(apiData);
                }
              }}
              style={{
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 50,
                backgroundColor: GlobalColor.BgPrimary,
                marginTop: 20,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  color: '#fff',
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      <Modal transparent={true} visible={WarningVisible}>
        <Pressable
          onPress={() => {
            setWarningVisible(false);
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
              // paddingHorizontal: 15,
              borderRadius: 20,
              width: '70%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: GlobalColor.BgPrimary,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 5,
              }}>
              <Ionicons name="warning" size={80} color={'#fff'} />
            </View>

            <Text
              style={[
                styles.textStyleMost,
                {marginTop: 20, color: GlobalColor.BgPrimary},
              ]}>
              Warning !
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                color: constant.boldTxt,
                textAlign: 'center',
                marginBottom: 20,
                marginTop: 15,
                width: '90%',
              }}>
              Error Occurred While Submitting Rating & Review.
            </Text>
          </View>
        </Pressable>
      </Modal>
      <Modal transparent={true} visible={SuccessVisible}>
        <Pressable
          onPress={() => {
            setSuccessVisible(false);
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
              // paddingHorizontal: 15,
              borderRadius: 20,
              width: '70%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: GlobalColor.BgSuccess,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 5,
              }}>
              <Ionicons name="happy" size={80} color={'#fff'} />
            </View>

            <Text
              style={[
                styles.textStyleMost,
                {marginTop: 20, color: GlobalColor.BgSuccess},
              ]}>
              Congratulations !
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                color: constant.boldTxt,
                textAlign: 'center',
                marginVertical: 20,
              }}>
              Rating & Review Submitted Successfully.
            </Text>
          </View>
        </Pressable>
      </Modal>
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
  heading: {
    width: '80%',
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    fontWeight: '700',
    textAlign: 'center',
    alignSelf: 'center',
    color: constant.boldTxt,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: GlobalColor.mediumTxt,
  },
  subTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: GlobalColor.mediumTxt,
  },
  orderView: {
    width: '95%',
    borderRadius: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  separator: {
    marginBottom: 0,
  },
  inputStyleModal: {
    height: 90,
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: constant.regularTxt,
  },
  textStyleMost: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: constant.boldTxt,
  },
});

//make this component available to the app
export default OrderHistory;
