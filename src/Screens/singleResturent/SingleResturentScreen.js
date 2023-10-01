import React, {useState, useContext, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Platform,
  LayoutAnimation,
  UIManager,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import pizzaSquare from '../../../assets/images/chad-montano-MqT0asuoIcU-unsplash.png';
import GlobalColor from '../../constant/constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AlertService from '../../Services/AlertService';
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import UserService from '../../Services/UserService';
import {CartState} from '../../context/CartContext';
import {ResDataState} from '../../context/RestaurantContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import RadioButtonRN from 'radio-buttons-react-native';
import {CommonActions} from '@react-navigation/native';
import Star from '../../components/Star/Star';
import Feather from 'react-native-vector-icons/Feather';
import ApiLoader from '../../components/ApiLoader';

const SingleResturent = ({navigation, route}) => {
  const IdRestaurant = route.params.data;
  const [statusDelivery, setStatusDelivery] = useState(true);
  const [statusCollection, setStatusCollection] = useState(false);
  const [Menu, setMenu] = useState(true);
  const [Review, setReview] = useState(false);
  const [ReviewData, setReviewData] = useState(false);
  const [RestaurantData, setRestaurantData] = useState([]);
  const [BestSelling, setBestSelling] = useState([]);
  const [products, setProducts] = useState([]);
  const [ChoiceModal, setChoiceModal] = useState(false);
  const [ChoiceModalinfo, setChoiceModalinfo] = useState(false);
  const [ChoiceItem, setChoiceItem] = useState([]);
  const [ChoiceTotalPrice, setChoiceTotalPrice] = useState(0.0);
  const [ActiveChoiceView, setActiveChoiceView] = useState(0);
  const [SelectedChoiceItem, setSelectedChoiceItem] = useState([]);
  const [choiceProductId, setChoiceProductId] = useState();
  const [Discount, setDiscount] = useState([]);
  const [Loader, setLoader] = useState(false);
  const {authContext, AppUserData} = useContext(AuthContext);
  const [PageNo, setPageNo] = React.useState();
  const [Chkservice, seChkservice] = React.useState();
  const [DataCount, setDataCount] = React.useState(0);
  const [ScrollPosition, setScrollPosition] = React.useState(0);
  const [AllergyModal, setAllergyModal] = useState(false);
  const [Chkdata, setChkdata] = React.useState();

  const {
    cartItem,
    addItem,
    increment,
    decrement,
    deleteItem,
    HandleChoice,
    totalPrice,
    qty,
    removeAllItem,
  } = CartState();
  const {state, SaveResData} = ResDataState();

  useEffect(() => {
    console.log('Restaurant ID', route.params.data);
    // console.log('Cart Item', cartItem);
    // console.log('Restaurant  Data', state);
    getSingleRestaurantDetails();
    getReviewData();
    checkResID();
  }, []);
  const saveResID = async () => {
    let ResData = {
      resID: route.params.data,
    };
    console.log('ResData', ResData);

    try {
      const jsonValue = JSON.stringify(ResData);
      await AsyncStorage.setItem('RESID', jsonValue);
    } catch (e) {
      console.log('error occured while saving RESID to async storage', e);
    }
  };
  const checkResID = async () => {
    if (route.params.data == null || undefined) {
      return;
    }
    let resID;
    try {
      resID = await AsyncStorage.getItem('RESID');
      // console.log('resID==>', resID);
      let fetchResId = JSON.parse(resID) == null ? {} : JSON.parse(resID);
      // console.log('Restaurant ID From Async==>', fetchResId);
      if (route.params.data == fetchResId.resID) {
        return;
      } else {
        removeAllItem();
        console.log('Cart is cleaned');
      }
    } catch (e) {
      console.log('Error==>', e);
    }
  };
  const getSingleRestaurantDetails = () => {
    // console.log('ResID', cartItem[0].restaurant_id);
    // return;
    setLoader(true);
    let token = AppUserData.token;
    let id = route.params.data;
    let data = {
      restaurantid: id,
    };
    console.log('Post Code ', data);
    // return;
    UserService.Post('restaurant/restaurant-detail', data, token)
      .then(response => {
        setLoader(false);
        // console.log('Response=>', response);
        if (response.error == false) {
          let responseData = response.data;
          console.log('Restaurant Data=>', responseData);
          if (responseData !== undefined) {
            setRestaurantData(responseData.singleRestaurantDetail);
            setDiscount(responseData.restaurantDiscounts);

            let MenuDataArray = responseData.menuData;
            let NewMenuDataArray = [];
            MenuDataArray.map(data => {
              if (cartItem.findIndex(x => x.category_id === data.id) != -1) {
                NewMenuDataArray.push({
                  ...data,
                  expanded: true,
                });
              } else {
                NewMenuDataArray.push({
                  ...data,
                  expanded: false,
                });
              }
            });
            // console.log(NewMenuDataArray);
            setProducts(NewMenuDataArray);
          }
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setRestaurantData([]);
          setDiscount([]);
          setProducts([]);

          // AlertService.dangerAlert(response.message);
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

  const getReviewData = () => {
    setLoader(true);
    let token = AppUserData.token;
    let id = route.params.data;
    let data = {
      restaurantId: id,
      page: 1,
    };
    // console.log('Post Code ', data);
    // return;
    UserService.Post('orders/review-list', data, token)
      .then(response => {
        setLoader(false);
        console.log('Review Response=>', response);
        if (response.error == false) {
          let responseData = response.data;
          // console.log('Restaurant Review Data=>', responseData);
          if (responseData !== undefined) {
            setReviewData(responseData);
          }
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setReviewData([]);
          // AlertService.dangerAlert(response.message);
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

  const getReviewDataOnEndReach = () => {
    console.log('Order data length', ReviewData.length);
    console.log('Order data Count', DataCount);
    if (ReviewData.length >= DataCount) {
      return;
    }
    if (ReviewData.length < DataCount) {
      let page = PageNo + 1;
      console.log('New page no', page);
      setPageNo(page);
      let token = AppUserData.token;
      let id = userID;
      if (id == null || undefined) {
        return;
      }
      let data = {
        restaurantId: id,
        page: page,
      };

      UserService.Post('orders/review-list', data, token)
        .then(response => {
          setLoader(false);
          // console.log('Response=>', response);
          if (response.error == false) {
            let responseData = response.data;
            // console.log('Restaurant Review Data=>', responseData);
            if (responseData !== undefined) {
              setReviewData(prevData => [...prevData, ...responseData]);
            }
            // AlertService.successAlert(response.message);
          } else {
            setLoader(false);
            console.log('Error', response.message);
            setReviewData([]);
            // AlertService.dangerAlert(response.message);
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

  const getChoiceItem = choiceData => {
    console.log('Choice Data', choiceData);
    // setLoader(true);
    let token = AppUserData.token;
    // console.log('Post Code ', data);
    // return;
    UserService.Post('restaurant/choice-groups', choiceData, token)
      .then(response => {
        setLoader(false);
        if (response.error == false) {
          let responseData = response.data.array;
          // console.log('Restaurant Choice Data=>', responseData);

          if (responseData !== undefined) {
            let newResponseArray = [...responseData];
            newResponseArray.map(data => {
              if (data.type === 'radio') {
                data.choices.map(subData => (subData.checked = false));
              }
            });
            console.log('newResponseArray', newResponseArray);


            newResponseArray.map(({index, element}) => {});
            setChoiceItem(newResponseArray);
          }
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          setChoiceItem([]);
          // AlertService.dangerAlert(response.message);
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

  const onTogglePress = value => {
    switch (value) {
      case 'delivery':
        
         setChkdata(false); 
         setStatusCollection(false); 
         setStatusDelivery(true); 
         console.log(statusCollection);
        break;
      case 'collection':
        setChkdata(true); 
        setStatusCollection(true); 
        setStatusDelivery(false);

        console.log(statusCollection);
        break;
      default:
        value;
        break;
    }
  };

  const onTabPress = value => {
    switch (value) {
      case 'Menu':
        setReview(false);
        setMenu(true);
        break;
      case 'Review':
        setReview(true);
        setMenu(false);
        break;
      default:
        value;
        break;
    }
  };

  const updateExpand = index => {
    if (Platform.OS == 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let tempProducts = [...products];
    tempProducts[index].expanded = !tempProducts[index].expanded;
    setProducts(tempProducts);
  };

  const updateExpandNew = index => {
    let tempProducts = [...products];
    tempProducts[index].expanded = !tempProducts[index].expanded;
    setProducts(tempProducts);
  };

  const renderProducts = ({item, index}) => {
    return (
      <View style={styles.itemListView}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            updateExpand(index);
          }}
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 8,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Poppins-Bold',
              color: GlobalColor.boldTxt,
            }}>
            {item.category}
          </Text>
          <Ionicons
            size={20}
            name="chevron-down"
            color={GlobalColor.BgPrimary}
          />
        </TouchableOpacity>

        {item.item
          ? item.item.map(data => {
              return item.expanded ? (
                <View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#fefbfb',
                      marginTop: 10,
                    }}>
                    <View
                      style={{
                        width: '55%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        // backgroundColor: 'yellow',
                        paddingLeft: 10,
                      }}>
                      <View
                        style={{
                          width: '70%',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: 'Poppins-SemiBold',
                            color: GlobalColor.mediumTxt,
                          }}>
                          {data.item_name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 10,
                            fontFamily: 'Poppins-Regular',
                            color: GlobalColor.regularTxt,
                          }}>
                          {data.categoryComment}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'Poppins-SemiBold',
                          color: GlobalColor.mediumTxt,
                        }}>
                        £ {data.price}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        // backgroundColor: 'green',
                        justifyContent: data.isAdded
                          ? 'flex-start'
                          : 'flex-end',
                        width: '43%',
                        paddingRight: data.isAdded ? 0 : 10,
                        alignItems: 'center',
                      }}>
                      {cartItem.category_id == item.id &&
                      cartItem.item &&
                      cartItem.id == data.id ? (
                        <Text
                          style={{
                            fontSize: 11,
                            fontFamily: 'Poppins-SemiBold',
                            color: GlobalColor.BgPrimary,
                            backgroundColor: '#F9E6E7',
                            borderRadius: 4,
                            padding: 4,
                            marginRight: 5,
                          }}>
                          Added
                        </Text>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            let service =
                              statusCollection == true
                                ? 'pickup'
                                : 'delivery';
                            if (data.choicesAvailable === 'Yes') {
                              let choiceData = {
                                restaurant_id: IdRestaurant,
                                item_id: data.id,
                              };
                             // getChoiceItem(choiceData);
                              setChoiceModal(true);
                              let dataId;
                              addItem(
                                data,
                                dataId,
                                Discount,
                                service,
                                parseFloat(RestaurantData.minimum_order_value),
                              );
                              setChoiceProductId(data.id);
                            } else {
                              let dataId;
                              addItem(
                                data,
                                dataId,
                                Discount,
                                service,
                                parseFloat(RestaurantData.minimum_order_value),
                              );
                            }
                          }}>
                          <Ionicons
                            name="add-circle"
                            size={30}
                            color={GlobalColor.BgPrimary}
                          />
                        </TouchableOpacity>
                      )}
                      {data.isAdded ? (
                        <View
                          style={{
                            // marginLeft: item.isAdded ? 10 : 25,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            width: '70%',
                          }}>
                          <View style={styles.btnView}>
                            <TouchableOpacity
                              onPress={() => {
                                decrement(data.id, data);
                              }}>
                              <MaterialIcons
                                name="remove"
                                color={GlobalColor.BgPrimary}
                                size={16}
                              />
                            </TouchableOpacity>

                            <View style={styles.quantityView}>
                              <Text style={styles.quantityTxt}>{data.qty}</Text>
                            </View>

                            <TouchableOpacity
                              onPress={() => {
                                increment(data.id, data);
                              }}>
                              <MaterialIcons
                                name="add"
                                color={GlobalColor.BgPrimary}
                                size={16}
                              />
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              deleteItem(data);
                            }}>
                            <Ionicons
                              name="trash-outline"
                              color={GlobalColor.BgPrimary}
                              size={20}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View />
                      )}
                    </View>
                  </View>

                  <View
                    style={{
                      borderWidth: 0.8,
                      borderStyle: 'dashed',
                      borderRadius: 1,
                      borderColor: 'grey',
                      marginVertical: 5,
                    }}
                  />
                </View>
              ) : null;
            })
          : null}

        {item.itemGroup
          ? item.itemGroup.map(data => {
              return item.expanded ? (
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    backgroundColor: '#fefbfb',
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Bold',
                      color: GlobalColor.BgPrimary,
                      marginLeft: '2%',
                    }}>
                    {data.group_name}
                  </Text>
                  {data.item.map(subData => {
                    return (
                      <View>
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 10,
                          }}>
                          <View
                            style={{
                              width: '55%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              // backgroundColor: 'yellow',
                              paddingLeft: 10,
                            }}>
                            <View
                              style={{
                                width: '70%',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: 'Poppins-SemiBold',
                                  color: GlobalColor.mediumTxt,
                                }}>
                                {subData.item_name}
                              </Text>
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontSize: 10,
                                  fontFamily: 'Poppins-Regular',
                                  color: GlobalColor.regularTxt,
                                }}>
                                {subData.comment}
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: 'Poppins-SemiBold',
                                color: GlobalColor.mediumTxt,
                              }}>
                              £ {subData.price}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              // backgroundColor: 'green',
                              justifyContent: subData.isAdded
                                ? 'flex-start'
                                : 'flex-end',
                              width: '43%',
                              paddingRight: subData.isAdded ? 0 : 10,
                              alignItems: 'center',
                            }}>
                            {subData.isAdded ? (
                              <Text
                                style={{
                                  fontSize: 11,
                                  fontFamily: 'Poppins-SemiBold',
                                  color: GlobalColor.BgPrimary,
                                  backgroundColor: '#F9E6E7',
                                  borderRadius: 4,
                                  padding: 4,
                                  marginRight: 5,
                                }}>
                                Added
                              </Text>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  let service =
                                    statusCollection == true
                                      ? 'pickup'
                                      : 'delivery';
                                  addItem(
                                    subData,
                                    data.id,
                                    Discount,
                                    service,
                                    parseFloat(
                                      RestaurantData.minimum_order_value,
                                    ),
                                  );
                                }}>
                                <Ionicons
                                  name="add-circle"
                                  size={30}
                                  color={GlobalColor.BgPrimary}
                                />
                              </TouchableOpacity>
                            )}
                            {subData.isAdded ? (
                              <View
                                style={{
                                  // marginLeft: item.isAdded ? 10 : 25,
                                  flexDirection: 'row',
                                  justifyContent: 'space-around',
                                  alignItems: 'center',
                                  width: '70%',
                                }}>
                                <View style={styles.btnView}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      decrement(subData.id, subData);
                                    }}>
                                    <MaterialIcons
                                      name="remove"
                                      color={GlobalColor.BgPrimary}
                                      size={16}
                                    />
                                  </TouchableOpacity>

                                  <View style={styles.quantityView}>
                                    <Text style={styles.quantityTxt}>
                                      {subData.qty}
                                    </Text>
                                  </View>

                                  <TouchableOpacity
                                    onPress={() => {
                                      increment(subData.id, subData);
                                    }}>
                                    <MaterialIcons
                                      name="add"
                                      color={GlobalColor.BgPrimary}
                                      size={16}
                                    />
                                  </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    deleteItem(subData);
                                  }}>
                                  <Ionicons
                                    name="trash-outline"
                                    color={GlobalColor.BgPrimary}
                                    size={20}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <View />
                            )}
                          </View>
                        </View>

                        <View
                          style={{
                            borderWidth: 0.8,
                            borderStyle: 'dashed',
                            borderRadius: 1,
                            borderColor: 'grey',
                            marginVertical: 5,
                          }}
                        />
                      </View>
                    );
                  })}
                </View>
              ) : null;
            })
          : null}
      </View>
    );
  };
  const renderReview = ({item, index}) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
        {item.image_url == null || undefined ? (
          <Image
            source={require('../../../assets/images/noimage.png')}
            style={{
              height: 60,
              width: 60,
              borderRadius: 10,
              marginLeft: 8,
              resizeMode: 'cover',
            }}
          />
        ) : (
          <Image
            source={{uri: item.image_url}}
            style={{
              height: 60,
              width: 60,
              borderRadius: 10,
              marginLeft: 8,
              resizeMode: 'cover',
            }}
          />
        )}
        <View style={{marginHorizontal: 10}}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Poppins-SemiBold',
              color: GlobalColor.regularTxt,
              marginTop: 10,
            }}>
            {item.review}
          </Text>
          <Star rating={item.ratings} color={GlobalColor.BgPrimary} />
        </View>
      </View>
    );
  };
  const renderProductsincart = ({item, index}) => {
    return (
      <View style={styles.itemListView}>
        {/* {isAdded? ( */}
        <View>
          {/* {cartItem.map(x =>
              x.category_id === item.id ? (item.expanded = true) : false,
            )} */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              updateExpandNew(index);
              // console.log(index, item);
            }}
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 8,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Bold',
                color: GlobalColor.boldTxt,
              }}>
              {item.category}
            </Text>
            <Ionicons
              size={20}
              name="chevron-down"
              color={GlobalColor.BgPrimary}
            />
          </TouchableOpacity>

          {item.item
            ? item.item.map(data => {
                {
                  cartItem.map(x =>
                    x.id == data.id ? (data.isAdded = true) : false,
                  );
                }
                {
                  cartItem.find(x =>
                    x.id == data.id ? (data.qty = x.qty) : null,
                  );
                }
                return (
                  <View>
                    {item.expanded ? (
                      <View>
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#fefbfb',
                            marginTop: 10,
                          }}>
                          <View
                            style={{
                              width: '55%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              // backgroundColor: 'yellow',
                              paddingLeft: 10,
                            }}>
                            <View
                              style={{
                                width: '70%',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: 'Poppins-SemiBold',
                                  color: GlobalColor.mediumTxt,
                                }}>
                                {data.item_name}
                              </Text>
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontSize: 10,
                                  fontFamily: 'Poppins-Regular',
                                  color: GlobalColor.regularTxt,
                                }}>
                                {data.categoryComment}
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: 'Poppins-SemiBold',
                                color: GlobalColor.mediumTxt,
                              }}>
                              £ {data.price}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              // backgroundColor: 'green',
                              justifyContent: data.isAdded
                                ? 'flex-start'
                                : 'flex-end',
                              width: '43%',
                              paddingRight: data.isAdded ? 0 : 10,
                              alignItems: 'center',
                            }}>
                            {data.isAdded ? (
                              <Text
                                style={{
                                  fontSize: 11,
                                  fontFamily: 'Poppins-SemiBold',
                                  color: GlobalColor.BgPrimary,
                                  backgroundColor: '#F9E6E7',
                                  borderRadius: 4,
                                  padding: 4,
                                  marginRight: 5,
                                }}>
                                Added
                              </Text>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  let service =
                                    statusCollection == true
                                      ? 'pickup'
                                      : 'delivery';
                                  if (data.choicesAvailable === 'Yes') {
                                    let choiceData = {
                                      restaurant_id: IdRestaurant,
                                      item_id: data.id,
                                    };
                                    //getChoiceItem(choiceData);
                                    setChoiceModal(true);
                                    let dataId;
                                    addItem(
                                      data,
                                      dataId,
                                      Discount,
                                      service,
                                      parseFloat(
                                        RestaurantData.minimum_order_value,
                                      ),
                                    );
                                    setChoiceProductId(data.id);
                                  } else {
                                    let dataId;
                                    addItem(
                                      data,
                                      dataId,
                                      Discount,
                                      service,
                                      parseFloat(
                                        RestaurantData.minimum_order_value,
                                      ),
                                    );
                                  }
                                }}>
                                <Ionicons
                                  name="add-circle"
                                  size={30}
                                  color={GlobalColor.BgPrimary}
                                />
                              </TouchableOpacity>
                            )}

                            {data.isAdded ? (
                              <View
                                style={{
                                  // marginLeft: item.isAdded ? 10 : 25,
                                  flexDirection: 'row',
                                  justifyContent: 'space-around',
                                  alignItems: 'center',
                                  width: '70%',
                                }}>
                                <View style={styles.btnView}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      decrement(data.id, data);
                                    }}>
                                    <MaterialIcons
                                      name="remove"
                                      color={GlobalColor.BgPrimary}
                                      size={16}
                                    />
                                  </TouchableOpacity>
                                  <View style={styles.quantityView}>
                                    <Text style={styles.quantityTxt}>
                                      {data.qty}
                                    </Text>
                                  </View>

                                  <TouchableOpacity
                                    onPress={() => {
                                      increment(data.id, data);
                                    }}>
                                    <MaterialIcons
                                      name="add"
                                      color={GlobalColor.BgPrimary}
                                      size={16}
                                    />
                                  </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    deleteItem(data);
                                  }}>
                                  <Ionicons
                                    name="trash-outline"
                                    color={GlobalColor.BgPrimary}
                                    size={20}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <View />
                            )}
                          </View>
                        </View>

                        <View
                          style={{
                            borderWidth: 0.8,
                            borderStyle: 'dashed',
                            borderRadius: 1,
                            borderColor: 'grey',
                            marginVertical: 5,
                          }}
                        />
                      </View>
                    ) : null}
                  </View>
                );
              })
            : null}

          {/* ItemGroup Loop Starts Here */}
          {item.itemGroup
            ? item.itemGroup.map(data => {
                return (
                  <View>
                    {item.expanded ? (
                      <View
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          backgroundColor: '#fefbfb',
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: 'Poppins-Bold',
                            color: GlobalColor.BgPrimary,
                            marginLeft: '2%',
                          }}>
                          {data.group_name}
                        </Text>

                        {data.item.map(subData => {
                          {
                            cartItem.find(x =>
                              x.id == subData.id
                                ? (subData.isAdded = true)
                                : false,
                            );
                          }
                          {
                            cartItem.find(x =>
                              x.id == subData.id ? (subData.qty = x.qty) : null,
                            );
                          }
                          return (
                            <View>
                              <View
                                style={{
                                  width: '100%',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginTop: 10,
                                }}>
                                <View
                                  style={{
                                    width: '55%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    // backgroundColor: 'yellow',
                                    paddingLeft: 10,
                                  }}>
                                  <View
                                    style={{
                                      width: '70%',
                                      justifyContent: 'center',
                                      alignItems: 'flex-start',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        fontFamily: 'Poppins-SemiBold',
                                        color: GlobalColor.mediumTxt,
                                      }}>
                                      {subData.item_name}
                                    </Text>
                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        fontSize: 10,
                                        fontFamily: 'Poppins-Regular',
                                        color: GlobalColor.regularTxt,
                                      }}>
                                      {subData.comment}
                                    </Text>
                                  </View>
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      fontFamily: 'Poppins-SemiBold',
                                      color: GlobalColor.mediumTxt,
                                    }}>
                                    £ {subData.price}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    // backgroundColor: 'green',
                                    justifyContent: subData.isAdded
                                      ? 'flex-start'
                                      : 'flex-end',
                                    width: '43%',
                                    paddingRight: subData.isAdded ? 0 : 10,
                                    alignItems: 'center',
                                  }}>
                                  {subData.isAdded ? (
                                    <Text
                                      style={{
                                        fontSize: 11,
                                        fontFamily: 'Poppins-SemiBold',
                                        color: GlobalColor.BgPrimary,
                                        backgroundColor: '#F9E6E7',
                                        borderRadius: 4,
                                        padding: 4,
                                        marginRight: 5,
                                      }}>
                                      Added
                                    </Text>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() => {
                                        let service =
                                          statusCollection == true
                                            ? 'pickup'
                                            : 'delivery';
                                        addItem(
                                          subData,
                                          data.id,
                                          Discount,
                                          service,
                                          parseFloat(
                                            RestaurantData.minimum_order_value,
                                          ),
                                        );
                                      }}>
                                      <Ionicons
                                        name="add-circle"
                                        size={30}
                                        color={GlobalColor.BgPrimary}
                                      />
                                    </TouchableOpacity>
                                  )}

                                  {subData.isAdded ? (
                                    <View
                                      style={{
                                        // marginLeft: item.isAdded ? 10 : 25,
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        width: '70%',
                                      }}>
                                      <View style={styles.btnView}>
                                        <TouchableOpacity
                                          onPress={() => {
                                            decrement(subData.id, subData);
                                          }}>
                                          <MaterialIcons
                                            name="remove"
                                            color={GlobalColor.BgPrimary}
                                            size={16}
                                          />
                                        </TouchableOpacity>
                                        <View style={styles.quantityView}>
                                          <Text style={styles.quantityTxt}>
                                            {subData.qty}
                                          </Text>
                                        </View>

                                        <TouchableOpacity
                                          onPress={() => {
                                            increment(subData.id, subData);
                                          }}>
                                          <MaterialIcons
                                            name="add"
                                            color={GlobalColor.BgPrimary}
                                            size={16}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                      <TouchableOpacity
                                        onPress={() => {
                                          deleteItem(subData);
                                        }}>
                                        <Ionicons
                                          name="trash-outline"
                                          color={GlobalColor.BgPrimary}
                                          size={20}
                                        />
                                      </TouchableOpacity>
                                    </View>
                                  ) : (
                                    <View />
                                  )}
                                </View>
                              </View>

                              <View
                                style={{
                                  borderWidth: 0.8,
                                  borderStyle: 'dashed',
                                  borderRadius: 1,
                                  borderColor: 'grey',
                                  marginVertical: 5,
                                }}
                              />
                            </View>
                          );
                        })}
                      </View>
                    ) : null}
                  </View>
                );
              })
            : null}
        </View>
      </View>
    );
  };

  const OnChangedValue = (item, dataID) => {
    console.log('Item', item);
    console.log('dataID', dataID);
    let newChoiceData = [...ChoiceItem];
    let selectedChoices = [];
    newChoiceData.map(data => {
      if (item.id == data.id) {
        data.choices.map(subData => {
          if (dataID == subData.id) {
            subData.isAdded = !subData.isAdded;
          } else {
            return;
          }
        });
      }
    });
    setChoiceItem(newChoiceData);
    console.log('newChoiceData', newChoiceData);
  };

  const getAllSelectedChoices = () => {
    let selectedChoices = [];
    let subTotalPrice = 0;
    if (ChoiceItem.length > 0) {
      ChoiceItem.map(data => {
        if (data.type === 'checkbox') {
          data.choices.map(x => {
            if (x.isAdded == true) {
              selectedChoices.push(x);
            } else {
              selectedChoices.filter(element => element.id !== x.id);
            }
          });
        } else {
          data.choices.map(x => {
            if (x.checked == true) {
              selectedChoices.push(x);
            } else {
              selectedChoices.filter(element => element.id !== x.id);
            }
          });
        }
      });
    } else {
      return;
    }

    selectedChoices.map(data => {
      subTotalPrice = subTotalPrice + parseInt(data.price);
    });

    console.log('selectedChoices', selectedChoices);
    setSelectedChoiceItem(selectedChoices);
    console.log('subTotalPrice', subTotalPrice);
    setChoiceTotalPrice(subTotalPrice);
  };

  const OnChangeRadio = (item, dataID, index) => {
    console.log('Item', item);
    console.log('dataID', dataID);
    console.log('index', index);
    let newChoiceData = [...ChoiceItem];
    newChoiceData.map(data => {
      if (item.id == data.id) {
        if (index == 0) {
          data.choices[0].checked = true;
          data.choices[1].checked = false;

          console.log();
        } else {
          data.choices[0].checked = false;
          data.choices[1].checked = true;
        }
      }
    });
    console.log('newChoiceData', newChoiceData);
    setChoiceItem(newChoiceData);
  };

  const renderChoiceProducts = ({item, index}) => {
    if (ActiveChoiceView == index) {
      return (
        <View
          style={{
            width: '100%',
          }}>
          <ScrollView horizontal style={{width: '100%'}}>
            <View
              style={{
                marginLeft: SelectedChoiceItem.length > 1 ? -2 : 0,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>


              {SelectedChoiceItem.map(data => (
                <Text
                  style={{
                    marginHorizontal: 4,
                    fontSize: 12,
                    fontFamily: 'Poppins-SemiBold',
                    color: GlobalColor.BgPrimary,
                  }}>
                  {data.name ? data.name : data.label}
                </Text>
              ))}
            </View>
          </ScrollView>
          <View
            style={{
              borderWidth: 0.5,
              borderRadius: 1,
              borderColor: GlobalColor.normalTxt,
              marginVertical: 5,
            }}
          />
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Poppins-SemiBold',
              color: GlobalColor.boldTxt,
            }}>
            {item.name} :
          </Text>
          {item.type === 'checkbox'
            ? item.choices.map(data => {
                return (
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 5,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          marginTop: 8,
                          fontFamily: 'Poppins-Regular',
                          color: GlobalColor.boldTxt,
                        }}>
                        {data.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginTop: 8,
                          marginHorizontal: 5,
                          fontFamily: 'Poppins-SemiBold',
                          color: GlobalColor.BgPrimary,
                        }}>
                        £ {data.price}.00
                      </Text>
                    </View>
                    <CheckBox
                      value={data.isAdded}
                        style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                      tintColors={{
                        true: GlobalColor.BgPrimary,
                        false: '#B6B7B7',
                      }}
                      onValueChange={() => {
                        // console.log('Item Selected', item);
                        OnChangedValue(item, data.id);
                        getAllSelectedChoices();
                      }}
                    />
                  </View>
                );
              })
            : null}

          {item.type === 'radio'
            ? item.choices.map((data, index) => {
                return (
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 5,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '50%',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          marginTop: 8,
                          fontFamily: 'Poppins-Regular',
                          color: GlobalColor.boldTxt,
                        }}>
                        {data.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginTop: 8,
                          marginHorizontal: 5,
                          fontFamily: 'Poppins-SemiBold',
                          color: GlobalColor.BgPrimary,
                        }}>
                        £ {data.price}.00
                      </Text>
                    </View>
                    {data.checked ? (
                      <TouchableOpacity onPress={() => {}}>
                        <Ionicons
                          name="radio-button-on"
                          color={GlobalColor.BgPrimary}
                          size={20}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          OnChangeRadio(item, data.id, index);
                          getAllSelectedChoices();
                        }}>
                        <Ionicons
                          name="radio-button-off"
                          color={GlobalColor.normalTxt}
                          size={20}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            : null}
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    Loader == true ? (
      <ApiLoader />):<View style={styles.container}>
        <View style={{flex: 1}}>
          <SafeAreaView>
            <View style={styles.headerView}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={30} color="#fff" />
              </TouchableOpacity>
              <View
                style={{
                  width: '60%',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                {ScrollPosition > 24 ? (
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                      color: '#ffffff',
                    }}>
                    {RestaurantData.name}

                  </Text>
                ) : null}
              </View>
            </View>
          </SafeAreaView>
          {Menu == true && cartItem.length > 0 ? (
            <View style={styles.cartModal}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 25,
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                      color: '#ffffff',
                    }}>
                    Total Price In Cart £{cartItem.length == 0 ? 0 : totalPrice}
                  </Text>
              

                    {Discount.map(data => {   
                      if (data.condition_amount- totalPrice > 0 ) {  
 
                        return (
                          <Text
                               style={{
                               fontSize: 14,
                               fontFamily: 'Poppins-Bold',
                               color: '#ffffff',
                              marginTop: 2,
                              marginLeft: -18
                            }}>  
                     Spend £{(data.condition_amount- totalPrice).toFixed(2)}  more to get {data.discount_val}% off                            
                          </Text>
                        );
                      }
                    })} 
                  
                </View>
                <TouchableOpacity
                  onPress={async () => {


                    console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuu',Chkdata);
                    console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuu',statusCollection);
                   // return;

                    // FindActualDiscount(); 
                    saveResID();


                    let ActualDiscount;
                    Discount.forEach(element => {
                      if (totalPrice > parseFloat(element.condition_amount)) {
                        ActualDiscount = element;
                      }
                    });
                    //console.log('ActualDiscount', ActualDiscount);


                   


                    let orderDetails = {
                      restaurantID: IdRestaurant,
                      conditionalAmount:
                        ActualDiscount == undefined
                          ? null
                          : ActualDiscount.condition_amount,
                      discountType:
                        ActualDiscount == undefined
                          ? null
                          : ActualDiscount.discount_type,
                      discountVal:
                        ActualDiscount == undefined
                          ? null
                          : ActualDiscount.discount_val,

 

                      //service: statusCollection == true ? 'delivery' : 'pickup',
                      service: Chkdata == true ? 'pickup' : 'delivery',

                      restaurantCondition: parseFloat(
                        RestaurantData.minimum_order_value,
                      ),
                    };

                   

                    console.log('orderDetails', orderDetails);
                  //  return;

                    SaveResData(orderDetails);
                    if (IdRestaurant !== null) {
                      navigation.jumpTo('CartStackNavigator', {
                        screen: 'CartScreen',
                        params: {data: Chkdata},

                      });
                    }
                  }}
                  style={styles.cartBtn}>
                  <Text style={styles.cartBtnTxt}>View Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          <ScrollView
          nestedScrollEnabled={true} 
            style={styles.container}
            onScroll={e => {
              let position = e.nativeEvent.contentOffset.y;
              setScrollPosition(position);
              // console.log('Current Position', position);
            }}>
            <View
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: cartItem.length > 0 ? 100 : 0,
              }}>
              <View
               
                style={[styles.prodView, {marginTop: Review == true ? 70 : 0}]}>
                <View style={styles.innerView}>
                  <Image
                    source={{uri: RestaurantData.image_url}}
                    resizeMode="contain"
                    style={{
                      resizeMode: 'contain',
                      height: '85%',
                      width: '25%',
                    }}
                  />
                  <View style={{width: '70%'}}>
                    <Text
                      style={{
                        fontSize: 21,
                        fontFamily: 'Poppins-SemiBold',
                        color: '#ffffff',
                      }}>
                      {RestaurantData.name}
                    </Text>
                    <View style={styles.addressRow}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {RestaurantData.address1 === '' ||
                        null ||
                        undefined ? null : (
                          <Text style={styles.addressText}>
                            {RestaurantData.address1}
                          </Text>
                        )}
                        {RestaurantData.address1 === '' ||
                        null ||
                        undefined ||
                        RestaurantData.address2 === '' ||
                        null ||
                        undefined ? null : (
                          <Text style={styles.addressText}>, </Text>
                        )}
                        {RestaurantData.address2 === '' ||
                        null ||
                        undefined ? null : (
                          <Text style={styles.addressText}>
                            {RestaurantData.address2}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.addressRow}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {RestaurantData.city === '' ||
                        null ||
                        undefined ? null : (
                          <Text style={styles.addressText}>
                            {RestaurantData.city}
                          </Text>
                        )}
                        {RestaurantData.city === '' ||
                        null ||
                        undefined ||
                        RestaurantData.postcode === '' ||
                        null ||
                        undefined ? null : (
                          <Text style={styles.addressText}>, </Text>
                        )}
                        {RestaurantData.postcode === '' ||
                        null ||
                        undefined ? null : (
                          <Text style={styles.addressText}>
                            {RestaurantData.postcode}
                          </Text>
                        )}
                      </View>
                    </View>
                    {/* <View style={{width: '65%'}}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'Poppins-Regular',
                          color: '#ffffff',
                        }}>
                        {RestaurantData.address1} {RestaurantData.address2},{' '}
                        {RestaurantData.city},{' '}
                        {RestaurantData.postcode}
                      </Text>
                    </View> */}
                    {RestaurantData.ratings == null || undefined ? null : (
                      <Star rating={RestaurantData.ratings} />
                    )}
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '80%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 5,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <MaterialIcons
                          name="two-wheeler"
                          size={20}
                          color="#fff"
                        />
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: 'Poppins-Regular',
                            left: 5,
                            color: '#ffffff',
                          }}>
                          {RestaurantData.delivery_time_min} -{' '}
                            {RestaurantData.delivery_time_max} mins
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          // marginLeft: 10,
                        }}>
                        <Feather name="shopping-bag" color="#fff" size={16} />
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: 'Poppins-Regular',
                            left: 5,
                            color: '#ffffff',
                          }}>
                          {RestaurantData.pickup_time_min} -{' '}
                          {RestaurantData.pickup_time_max} mins
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                {Discount && Discount.length > 0 ? (
                  <View style={styles.discountView}>
 
                    {Discount.map(data => {   
                      if (data.discount_type === 'percentage') {  
 
                        return (
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'Poppins-SemiBold',
                              color: GlobalColor.BgPrimary,
                            }}> 

                            {data.discount_val}% OFF ON ALL ORDERS OVER £
                            {data.condition_amount}
                           

                            
                          </Text>
                        );
                      } else {
                        
                       
                        return (
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'Poppins-SemiBold',
                              color: GlobalColor.BgPrimary,
                            }}>
                            £{data.discount_val} OFF ON ALL ORDERS OVER £
                            {data.condition_amount}
                             
                          </Text>
                        );
                      }
                    })}
                  </View>
                ) : null}

              </View>
              <View style={styles.toggelView}>
                <TouchableOpacity
                  onPress={() => onTogglePress('delivery')}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 35,
                    paddingHorizontal: 20,
                    backgroundColor:
                      statusDelivery === true
                        ? GlobalColor.BgPrimary
                        : '#ffffff',
                    borderRadius: 60,
                  }}>
                  {/* <MaterialIcons
            name="two-wheeler"
            size={25}
            color={statusDelivery === true ? '#fff' : GlobalColor.txtColor}
          /> */}
                  <Text
                    style={{
                      left: 3,
                      fontSize: 12,
                      fontFamily: 'Poppins-Medium',
                      color:
                        statusDelivery === true
                          ? '#ffffff'
                          : GlobalColor.txtColor,
                    }}>
                    Delivery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onTogglePress('collection')}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 35,
                    paddingHorizontal: 20,
                    backgroundColor:
                      statusCollection == true
                        ? GlobalColor.BgPrimary
                        : '#ffffff',
                    borderRadius: 60,
                  }}>
                  
                  <Text
                    style={{
                      left: 3,
                      fontSize: 12,
                      fontFamily: 'Poppins-Medium',
                      color:
                        statusCollection == true
                          ? '#ffffff'
                          : GlobalColor.txtColor,
                    }}>
                    Collection
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setChoiceModalinfo(true)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 35,
                    paddingHorizontal: 20,
                    
                    borderRadius: 60,
                  }}>
                  
                  <Text
                    style={{
                      left: 3,
                      fontSize: 12,
                      fontFamily: 'Poppins-Medium',
                      color:'black',
                      textDecorationLine: 'underline',
                    }}>
                    Allergen info
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '100%',
                  paddingVertical: 0,
                  // backgroundColor: 'orange',
                  marginTop: 10,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  alignSelf: 'center',
                  borderBottomWidth: 2,
                  borderBottomColor: '#F5F5F5',
                  // borderRadius: 7,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    onTabPress('Menu');
                    getSingleRestaurantDetails();
    getReviewData();
    checkResID();

                    
                    //setChoiceModalinfo(true);
                  }}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 8,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                      color:
                        Menu === true
                          ? GlobalColor.BgPrimary
                          : GlobalColor.boldTxt,
                    }}>
                    Menu
                  </Text>
                  {Menu === true ? (
                    <View
                      style={{
                        height: 2,
                        width: '100%',
                        backgroundColor: GlobalColor.BgPrimary,
                        marginTop: 2,
                      }}
                    />
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onTabPress('Review');
                  }}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                      color:
                        Review === true
                          ? GlobalColor.BgPrimary
                          : GlobalColor.boldTxt,
                    }}>
                    Review
                  </Text>
                  {Review === true ? (
                    <View
                      style={{
                        height: 2,
                        width: '100%',
                        backgroundColor: GlobalColor.BgPrimary,
                        marginTop: 2,
                      }}
                    />
                  ) : null}
                </TouchableOpacity>
              </View>
              {Menu == true ? (
                <View style={{flex: 1}}>
                  <View
                    style={{
                      alignSelf: 'center',
                      height: 2,
                      width: '60%',
                      backgroundColor: '#F5F5F5',
                      // marginVertical: 10,
                    }}
                  />

                  {cartItem.length != 0 ? (
                    <FlatList
                      style={{marginTop: 15}}
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item,index )=> index}
                      ItemSeparatorComponent={() => (
                        <View style={{margin: 5}} />
                      )}
                      data={products}
                      renderItem={renderProductsincart}
                    />
                  ) : (
                    <FlatList
                      style={{marginTop: 15}}
                      nestedScrollEnabled={true} 
                      showsVerticalScrollIndicator={false}
                      keyExtractor={item => item.id}
                      ItemSeparatorComponent={() => (
                        <View style={{margin: 5}} />
                      )}
                      data={products}
                      renderItem={renderProducts}
                    />
                  )}
                </View>
              ) : (
                <View
                  style={{
                    marginTop: 10,
                    height: ReviewData.length > 0 ? '66%' : '72%',
                    flexGrow: 1,
                  }}>
                  {
                    <FlatList
                    nestedScrollEnabled={true} 
                      showsVerticalScrollIndicator={false}
                      keyExtractor={item => item.id}
                      ListEmptyComponent={() => {
                        return (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={require('../../../assets/images/noreview.png')}
                              style={{
                                width: 300,
                                height: 250,
                                resizeMode: 'contain',
                                marginTop: 10,
                              }}
                            />
                          </View>
                        );
                      }}
                      ItemSeparatorComponent={() => (
                        <View style={{margin: 5}} />
                      )}
                      data={ReviewData}
                      renderItem={renderReview}
                      onEndReached={getReviewDataOnEndReach}
                      onEndReachedThreshold={0.5}
                    />
                  }
                </View>
              )}
            </View>
             

            <Modal transparent={true} visible={ChoiceModalinfo}>
              <View
                style={{
                  backgroundColor: '#000000aa',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    padding: 15,
                    borderRadius: 10,
                    width: '90%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>

                  
                  <TouchableOpacity
                    onPress={() => { 
                      setChoiceModalinfo(false);
                    }}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'flex-end',
                    }}>
                    <Ionicons
                      name="close-circle"
                      color={GlobalColor.BgPrimary}
                      size={30}
                    />
                  </TouchableOpacity>


                  
                  <View style={{width: '100%'}}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      keyExtractor={item => item.id}
                      data={ChoiceItem}
                      renderItem={renderChoiceProducts}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginLeft: 5,
                        marginVertical: 5,
                      }}>
                      
                      <Text
                        style={{


                          fontSize: 14,
                          fontFamily: 'Poppins-Regular',
                          color: 'red',
                          marginHorizontal: 5,
                          padding: 0,
                    textAlign: 'justify',
                    flexDirection: 'row',


                        }}>
                       Some products may contain nuts and/or gluten. if you suffer
                  from any allergies or have any specific dietary requirements,
                  we strongly advise you to contact the restaurant directly
                  after placing your order {RestaurantData.name} Phone Number -
                  <Text>{' ' + RestaurantData.phone}</Text>
                      </Text>
                    </View>

                  
                  </View>
                  
                </View>
              </View>
            </Modal>



            <Modal transparent={true} visible={ChoiceModal}>
              <View
                style={{
                  backgroundColor: '#000000aa',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    padding: 15,
                    borderRadius: 10,
                    width: '90%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveChoiceView(0);
                      setChoiceModal(false);
                    }}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'flex-end',
                    }}>
                    <Ionicons
                      name="close-circle"
                      color={GlobalColor.BgPrimary}
                      size={30}
                    />
                  </TouchableOpacity>
                  <View style={{width: '100%'}}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      keyExtractor={item => item.id}
                      data={ChoiceItem}
                      renderItem={renderChoiceProducts}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginLeft: 5,
                        marginVertical: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Poppins-SemiBold',
                          color: GlobalColor.boldTxt,
                        }}>
                        Total Price :
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Poppins-Regular',
                          color: GlobalColor.regularTxt,
                          marginHorizontal: 5,
                        }}>
                        £ {ChoiceTotalPrice}.00
                      </Text>
                    </View>

                    <View
                      style={{
                        borderWidth: 0.5,
                        borderRadius: 1,
                        borderColor: GlobalColor.normalTxt,
                        marginVertical: 5,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent:
                        ActiveChoiceView == 0 ? 'center' : 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      marginTop: 10,
                    }}>
                    {ActiveChoiceView !== 0 ? (
                      <TouchableOpacity
                        onPress={() => {
                          let newState = ActiveChoiceView;
                          setActiveChoiceView(newState - 1);
                        }}
                        style={{
                          width: '48%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingVertical: 10,
                          alignSelf: 'center',
                          backgroundColor: GlobalColor.BgPrimary,
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Poppins-SemiBold',
                            color: '#fff',
                          }}>
                          Back
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                    {ActiveChoiceView !== ChoiceItem.length - 1 ? (
                      <TouchableOpacity
                        onPress={() => {
                          // ChangeActiveChoiceView()
                          let newState = ActiveChoiceView;
                          setActiveChoiceView(newState + 1);
                        }}
                        style={{
                          width: '48%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingVertical: 10,
                          alignSelf: 'center',
                          backgroundColor: GlobalColor.BgPrimary,
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Poppins-SemiBold',
                            color: '#fff',
                          }}>
                          Next
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                    {ActiveChoiceView == ChoiceItem.length - 1 ? (
                      <TouchableOpacity
                        onPress={() => {
                          // console.log('choiceProductId', choiceProductId);
                          // console.log('SelectedChoiceItem', SelectedChoiceItem);
                          // console.log('ChoiceTotalPrice', ChoiceTotalPrice);
                          HandleChoice(
                            choiceProductId,
                            SelectedChoiceItem,
                            ChoiceTotalPrice,
                          );
                          setActiveChoiceView(0);
                          setSelectedChoiceItem([]);
                          setChoiceModal(false);
                        }}
                        style={{
                          width: '48%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingVertical: 10,
                          alignSelf: 'center',
                          backgroundColor: GlobalColor.BgPrimary,
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Poppins-SemiBold',
                            color: '#fff',
                          }}>
                          Finish
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  prodView: {
    width: '100%',
    borderBottomLeftRadius: 65,
    borderBottomRightRadius: 65,
    backgroundColor: GlobalColor.BgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerView: {
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: GlobalColor.BgPrimary,
  },
  prodContainer: {
    // height: 110,
    marginTop: Platform.OS === 'android' ? 10 : null,
    //borderWidth:1,
    paddingHorizontal: 15,
  },
  innerView: {
    width: '90%',
    flexDirection: 'row',
    // backgroundColor: 'purple',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  discountView: {
    paddingVertical: 5,
    marginVertical: 10,
    width: '70%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'relative',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggelView: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  itemListView: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  incrementView: {
    flexDirection: 'row',
    backgroundColor: '#F9E6E7',
    width: 60,
    paddingHorizontal: 5,
    height: 20,
    borderRadius: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartModal: {
    backgroundColor: GlobalColor.BgPrimary,
    // height: 80,
    paddingVertical: 15,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    zIndex: 10000,
  },
  cartBtn: {
    // height: 30,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cartBtnTxt: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: GlobalColor.BgPrimary,
    paddingLeft:0,
  },
  btnView: {
    backgroundColor: '#F9E6E7',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 8,
    flexDirection: 'row',
  },
  quantityView: {
    backgroundColor: '#ffffff',
    width: 25,
    height: 25,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  addressRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
});
export default SingleResturent;
