import React, {useState, useContext, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  FlatList,
  Keyboard,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import bikeIcon from '../../../assets/images/bikeImg.png';
import bagIcon from '../../../assets/images/bagimg.png';
import minsIcon from '../../../assets/images/dash-lg.png';
import plusLightIcon from '../../../assets/images/plus.png';
import cancelIcon from '../../../assets/images/crossIcon.png';
import {Platform} from 'react-native';
import pizzaSquare from '../../../assets/images/chad-montano-MqT0asuoIcU-unsplash.png';
import constant from '../../constant/constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GlobalColor from '../../constant/constant';
import {CartState} from '../../context/CartContext';
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import UserService from '../../Services/UserService';
import AlertService from '../../Services/AlertService';
import Star from '../../components/Star/Star';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ApiLoader from '../../components/ApiLoader';

const CartScreen = ({navigation, route}) => {

    let previousPageData;
 if (route.params && route.params.data) {
     previousPageData = route.params.data; 
   }

  const [RestaurantData, setRestaurantData] = useState({});
  const [products, setProducts] = useState([]);
  const [Discount, setDiscount] = useState();
  const [AppliedCoupon, setAppliedCoupon] = useState(0);
  const [DiscountPrice, setDiscountPrice] = useState(0);
  const [discountTYpe, setDiscountTYpe] = useState(null);
  const [discountValue, setDiscountValue] = useState(null);
  const [conditionalAmount, setConditionalAmount] = useState(null);
  const [offdata, setoffdata] = useState(null);
  const [offdatadiscount, setoffdatadiscount] = useState(null);
  const [statusDelivery, setStatusDelivery] = useState(false);
  const [statusCollection, setStatusCollection] = useState(false);
  const [AllergyModal, setAllergyModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [DiscountCode, setDiscountCode] = useState('');
  const [ApplyDiscount, setApplyDiscount] = useState(false);
  const [NewTotalPrice, setNewTotalPrice] = useState(parseFloat());
  const [UpdatedNewTotalPrice, setUpdatedNewTotalPrice] = useState();
  const [Title, setTitle] = useState('');
  const [Instruction, setInstruction] = useState('');
  const [ShowOffer, setShowOffer] = useState(false);
  const {authContext, AppUserData} = useContext(AuthContext);
  const [Loader, setLoader] = useState(false);
  const [Data, setData] = useState([]);
  const {
    state,
    cartItem,
    addItem,
    increment,
    decrement,
    deleteItem,
    totalPrice,
    resID,
    resDis,
    service,
    resCondition,
  } = CartState();

  // console.log('Cart  Item', cartItem);
  // console.log('Total Price', totalPrice);

  // console.log('New Total Price', NewTotalPrice);

  const FindActualDiscount = () => {
    let ActualDiscount;
    if (resDis.length > 0) {
      resDis.forEach(element => {

        setoffdata(element.condition_amount)
        setoffdatadiscount(element.discount_val) 

        if (totalPrice > parseFloat(element.condition_amount)) {
          ActualDiscount = element;
          setDiscountValue(ActualDiscount.discount_val);
          setConditionalAmount(ActualDiscount.condition_amount);
          

          setDiscountTYpe(ActualDiscount.discount_type);
          setShowOffer(true);
        }
      });
    } else {

    
      setDiscountPrice(0);
      setShowOffer(false);
      setDiscountValue(null);
      setConditionalAmount(null);
      setDiscountTYpe(null);
      return;
    }
  };
  const onTogglePress = value => {
    switch (value) {
      case 'delivery':
        setStatusCollection(false);
        setStatusDelivery(true);

        console.log(statusCollection);
        break;
      case 'collection':
        setStatusCollection(true);
        setStatusDelivery(false);
        console.log(statusCollection);
        break;
      default:
        value;
        break;
    }
  };

  useEffect(() => {
    console.log('cart Item', cartItem); 

    // console.log('Previous Page Data ', previousPageData);
    console.log('conditionalAmount', conditionalAmount);
    console.log('Restaurant ID', resID);
    console.log('Restaurant Condition', resCondition);
    // getProfileDetails();


    if(previousPageData==true)
    {
      setStatusCollection(true);
      setStatusDelivery(false);
    }
    else
    {
      setStatusCollection(false);
      setStatusDelivery(true);
    }

   // if (service === 'delivery') {
     // setStatusCollection(false);
     /// setStatusDelivery(true);
    //} else {
      //setStatusCollection(true);
     // setStatusDelivery(false);
   // }

    getSingleRestaurantDetails();
    DiscountApplying();
    if (totalPrice) {
      FindActualDiscount();
    }
  }, [totalPrice, cartItem]);

  const getSingleRestaurantDetails = () => {
    setLoader(true);
    if (resID == null || undefined) {
      setLoader(false);
      return;
    }
    let token = AppUserData.token;
    // let id = route.params.data;
    let data = {
      restaurantid: resID,
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
        


          if (cartItem.length == 0) {
            setRestaurantData([]);
            setDiscount([]);
            setProducts([]);
          } else {
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

  useEffect(() => {
    DiscountApplying();
  }, [deleteItem, increment, decrement]);

  const DiscountApplying = () => {


     
    let ActualDiscount;
    if (resDis.length > 0) {
      resDis.forEach(element => {
        if (totalPrice > parseFloat(element.condition_amount)) {
          setShowOffer(true);
          ActualDiscount = element;
        } else {
          // let fullPrice = parseFloat(totalPrice).toFixed(2);
          ActualDiscount = 0;
          setDiscountPrice(0);
          setShowOffer(false);
          setNewTotalPrice(totalPrice);
          return;
        }
      });
    } else {
      ActualDiscount = 0;
      setDiscountPrice(0);
      setShowOffer(false);
      return;
    }

    if (ActualDiscount == undefined) {
      setNewTotalPrice(totalPrice);
    } else {
      console.log('ActualDiscount', ActualDiscount);
      let fullPrice = parseFloat(totalPrice);
      let discountValue =
        ActualDiscount.discount_val == undefined
          ? null
          : ActualDiscount.discount_val;
      let conditionalAmount = ActualDiscount.condition_amount;
      let discountTYpe = ActualDiscount.discount_type;
      console.log('Full Price', fullPrice);
      console.log('type of Total Price', typeof fullPrice);
      console.log('discountValue', discountValue);
      setDiscountPrice(discountValue);
      console.log('Type of discountValue', typeof discountValue);
      console.log('conditionalAmount', conditionalAmount);
      console.log('type of conditionalAmount', typeof conditionalAmount);
      if (fullPrice >= conditionalAmount && discountTYpe === 'flat_amount') {
        console.log(
          `Your Total Price ${fullPrice} is greater than Conditional Amount ${conditionalAmount}`,
        );

        let updatedPrice = fullPrice - discountValue;
        let FixedUpdatedPrice = parseFloat(updatedPrice).toFixed(2);
        console.log('UpdatedPrice', updatedPrice);
        console.log('FixedUpdatedPrice', parseFloat(FixedUpdatedPrice));
        setNewTotalPrice(parseFloat(FixedUpdatedPrice));
        return;
      } else if (fullPrice >= conditionalAmount) {
        console.log('Now percentage discount will apply');
        let updatedPrice = (fullPrice * discountValue) / 100;
        setDiscountPrice(updatedPrice);
        let finalPrice = fullPrice - updatedPrice;
        console.log('Updated Price', updatedPrice);
        console.log('finalPrice', finalPrice);
        setNewTotalPrice(parseFloat(finalPrice).toFixed(2));
        return;
      } else {
        let fullPrice = parseFloat(totalPrice);
        setDiscountPrice(0);
        return setNewTotalPrice(fullPrice);
      }
    }
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

  const getProfileDetails = () => {
    setLoader(true);
    let token = AppUserData.token;
    setLoader(true);
    UserService.Post('user/user-profile', {}, token)
      .then(response => {
        setLoader(false);
        // console.log('Response=>', response);
        if (response.error == false) {
          setData(response.data.profile);
          AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setData({});

          AlertService.dangerAlert(response.message);
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

  const VerifyCoupon = () => {
    console.log('Coupon name', DiscountCode);
    setLoader(true);
    if (resCondition > totalPrice) {
      // AlertService.warningAlert(
      //   `Total Price must be more than £ ${resCondition}`,
      // );
      AlertOccurred(
        'Alert',
        `Total Price must be more than £ ${resCondition}`,
        'ok',
      );
      setLoader(false);
      setDiscountCode('');
      return;
    }
    if (
      totalPrice === null ||
      cartItem.length === 0 ||
      NewTotalPrice === null
    ) {
      return;
    }
    let data = {
      discountCode: DiscountCode,
      subTotal: NewTotalPrice,
    };

    let token = AppUserData.token;
    // console.log('API Data', data);

    UserService.Post('orders/validate-coupon-code', data, token)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        console.log('Total Price', totalPrice);
        console.log('NewTotalPrice', NewTotalPrice);
        if (response.error == false) {
          let discountPrice = response.data.discount;
          let updatedTotalPrice = NewTotalPrice - discountPrice;
          console.log('updatedTotalPrice=>', updatedTotalPrice);
          setUpdatedNewTotalPrice(parseFloat(updatedTotalPrice).toFixed(2));
          setAppliedCoupon(discountPrice);
          // AlertService.successAlert(response.message);
          AlertOccurred('Success', response.message, 'ok');
          // setApplyDiscount(true);
          // setDiscountCode('');
          setLoader(false);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          // setApplyDiscount(false);
          AlertOccurred('Success', response.message, 'ok');
          // AlertService.dangerAlert(response.message);
          // setDiscountCode('');
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('response data', error);
        if (error.response) {
          // client received an error response (5xx, 4xx)
          AlertOccurred('Success', error.response.data.error.message, 'ok');
          // AlertService.dangerAlert(error.response.data.error.message);
        } else if (error.request) {
          // client never received a response, or request never left
          // AlertService.dangerAlert('Network Error');
          AlertOccurred('Success', 'Network Error', 'ok');
        } else {
          // anything else
          // AlertService.dangerAlert('Something Went Wrong');
          AlertOccurred('Success', 'Something Went Wrong', 'ok');
        }
      });
  };

  const OrderPlace = () => {
    setLoader(true);
    if (totalPrice === null || cartItem.length === 0) {
      return;
    }

    let orderItems = [];
    cartItem.map(data => {
      // console.log('Cart Data', data);
      orderItems.push({
        restaurant_name: data.restaurant_name,
        item_name: data.item_name,
        item_price: data.price,
        quantity: data.qty,
        choices: data.choicesAvailable === 'No' ? null : data.choice,
      });
    });
    console.log('DiscountPrice', DiscountPrice);
    let data = {
      restaurant_id: resID,
      payment_status: 'pending',
      discount_type: discountTYpe,
      discount_val: parseFloat(DiscountPrice).toFixed(2),
      coupon_code: AppliedCoupon == 0 ? '' : DiscountCode,
      coupon_val: AppliedCoupon,
      total_amount: totalPrice,
      amount_payable:
        UpdatedNewTotalPrice == null || undefined
          ? NewTotalPrice
          : UpdatedNewTotalPrice,
      user_id: Data.id,
      order_status: 'pending',
      discount_type: discountTYpe,
      service_type: statusCollection == true ? 'pickup' : 'delivery',
      special_instruction: Instruction,
      allergy_info: Title,
      order_item: orderItems,
    };
    console.log('Order Place Data', data);
    let token = AppUserData.token;
    console.log('API Data', data);
    UserService.Post('orders/order-place', data, token)
      .then(response => {
        setLoader(false);
        console.log('Response=>', response);
        if (response.error == false) {
          let orderDetails = {
            orderID: response.data.OrderId,
            resID: resID,
          };
          setInstruction('');
          setTitle('');
          var servicetype="";
          if (data.service_type == 'pickup') {
            servicetype="DetailsCartScreenCollection";
          }
          else
          {
            servicetype="DetailsCartScreen";
          }


        navigation.navigate(servicetype, {
        // navigation.navigate('DetailsCartScreenCollection', {
            data: orderDetails,
        });


          
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setApplyDiscount(false);

          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
          setDiscountCode('');
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

  const displayModal = show => setIsVisible(show);
  const renderProducts = ({item, index}) => {
    let ItemP = item.price;
    let ChoiceItemP = 0;
    if (item.choicesAvailable === 'Yes' && item.choice) {
      item.choice.map((data, index) => {
        ChoiceItemP = parseFloat(ChoiceItemP) + parseFloat(data.price);
      });
    }
    let ItemAndChoiceP = parseFloat(ItemP) + parseFloat(ChoiceItemP);
    // console.log('Item Price', ItemP);
    // console.log('Choice Item Price', ChoiceItemP);
    // console.log('Both Item Price', ItemAndChoiceP);

    return (
      <View>
        <View style={[styles.mainRow, {alignItems: 'flex-start'}]}>
          <View style={{width: '30%'}}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Bold',
                color: constant.boldTxt,
              }}>
              {item.qty} x {item.item_name}
            </Text>
            {item.choicesAvailable === 'Yes'
              ? item.choice
                ? item.choice.map((data, index) => {
                    // console.log('Choice Data', data);
                    return (
                      <View
                        style={{
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
                        {item.choice.length - 1 == index ? null : (
                          <Text style={[styles.itemName, {marginRight: 5}]}>
                            +
                          </Text>
                        )}
                      </View>
                    );
                  })
                : null
              : null}
          </View>
          <View style={styles.innerRow}>
            <View style={styles.btnView}>
              <TouchableOpacity
                onPress={() => {
                  decrement(item.id, item);
                }}>
                <MaterialIcons
                  name="remove"
                  color={GlobalColor.BgPrimary}
                  size={16}
                />
              </TouchableOpacity>
              <View style={styles.quantityView}>
                <Text style={styles.quantityTxt}>{item.qty}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  increment(item.id, item);
                }}>
                <MaterialIcons
                  name="add"
                  color={GlobalColor.BgPrimary}
                  size={16}
                />
              </TouchableOpacity>
            </View>
            {item.choicesAvailable === 'Yes' ? (
              <Text style={styles.priceTxt}>£{ItemAndChoiceP}</Text>
            ) : (
              <Text style={styles.priceTxt}>£{item.price}</Text>
            )}
            <TouchableOpacity
              style={{marginLeft: 5}}
              onPress={() => {
                // deleteItem(item.id, item);
                deleteItem(item);
              }}>
              <Ionicons
                name="trash-outline"
                color={GlobalColor.BgPrimary}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const EmptyView = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        <Image
          source={require('../../../assets/images/order.png')}
          style={{height: 200, width: 400, resizeMode: 'contain'}}
        />
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Poppins-SemiBold',
            color: constant.BgPrimary,
          }}>
          You haven’t added any item to cart.
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {Loader == true ? (
        <ApiLoader />
      ) : (
        <View style={{flex: 1}}>
          {cartItem.length == 0 ? (
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
                    color: constant.boldTxt,
                  }}>
                  Cart
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.prodView,
                {
                  backgroundColor:
                    cartItem.length > 0 ? GlobalColor.BgPrimary : '#fff',
                },
              ]}>
              <SafeAreaView>
                <View style={styles.headerView}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="chevron-back"
                      size={20}
                      color={cartItem.length == 0 ? constant.boldTxt : '#fff'}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity>
                    <Ionicons
                      name="heart-outline"
                      size={20}
                      color={cartItem.length == 0 ? constant.boldTxt : '#fff'}
                    />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
              {RestaurantData.length !== 0 ? (
                <View style={styles.prodContainer}>
                  <View style={styles.innerView}>
                    <Image
                      source={{uri: RestaurantData.image_url}}
                      resizeMode="contain"
                      style={{
                        resizeMode: 'contain',
                        height: '100%',
                        width: '28%',
                        // borderRadius: 8,
                      }}
                    />
                    <View style={{width: '70%', marginLeft: '4%'}}>
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
                      {/* <View style={{width: '80%'}}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'Poppins-Regular',
                          color: '#ffffff',
                        }}>
                        {RestaurantData.address1} {RestaurantData.address2}{' '}
                        {RestaurantData.city}
                        {RestaurantData.country}
                      </Text>
                    </View> */}
                      {RestaurantData.ratings == null || undefined ? null : (
                        <Star rating={RestaurantData.ratings} />
                      )}
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '75%',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 5,
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
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
                          <MaterialIcons
                            name="work-outline"
                            size={16}
                            color="#fff"
                          />
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
                  <View
                    style={{
                      marginTop: 5,
                      width: '80%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>

                   

                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Poppins-Regular',
                        textAlign: 'center',
                        
                      }}>
            {(offdatadiscount)}% OFF ON ALL ORDERS OVER £{offdata} 
 
                      
                    </Text>

                    

                     
                  </View>
                </View>
              ) : null}
            </View>
          )}
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
                  statusDelivery === true ? constant.BgPrimary : '#ffffff',
                borderRadius: 60,
              }}>
              <MaterialIcons
                name="two-wheeler"
                size={25}
                color={statusDelivery === true ? '#fff' : constant.regularTxt}
              />
              <Text
                style={{
                  left: 3,
                  fontSize: 12,
                  marginTop: 3,
                  fontFamily: 'Poppins-Medium',
                  color:
                    statusDelivery === true ? '#ffffff' : constant.regularTxt,
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
                  statusCollection === true ? constant.BgPrimary : '#ffffff',
                borderRadius: 60,
              }}>
              <MaterialIcons
                name="work-outline"
                size={20}
                color={statusCollection === true ? '#fff' : constant.regularTxt}
              />
              <Text
                style={{
                  left: 3,
                  fontSize: 12,
                  marginTop: 3,
                  fontFamily: 'Poppins-Medium',
                  color:
                    statusCollection === true ? '#ffffff' : constant.regularTxt,
                }}>
                Collection
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAllergyModal(true)}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: 35,
                paddingHorizontal: 20,
                backgroundColor: '#ffffff',
                borderRadius: 60,
              }}>
               
              <Text
                style={{
                  left: 3,
                  fontSize: 12,
                  marginTop: 3,
                  fontFamily: 'Poppins-Medium',
                  textDecorationLine: 'underline',
                  color:
                    statusCollection === true ? 'black' : constant.regularTxt,
                }}>
                 Allergen info
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                marginTop: 15,
                justifyContent: 'center',
                paddingHorizontal: 10,
                paddingVertical: 20,
                borderWidth: 2,
                borderColor: '#F5F5F5',
                borderRadius: 7,
                // backgroundColor: 'green',
              }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                data={cartItem}
                renderItem={renderProducts}
                ListEmptyComponent={EmptyView}
                inverted={cartItem.length > 0 ? true : false}
              />
            </View>

            {/* <KeyboardAwareScrollView> */}
            <View style={styles.discountView}>
              <TextInput
                placeholder="Discount Code"
                style={styles.inputStyle}
                value={DiscountCode}
                onChangeText={txt => {
                  setDiscountCode(txt);
                }}
              />
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => {
                  Keyboard.dismiss();
                  if (DiscountCode === '') {
                    // AlertService.dangerAlert('Please Enter Valid Discount Code');
                    AlertOccurred(
                      'Success',
                      'Please Enter Valid Discount Cod',
                      'ok',
                    );
                    return;
                  } else {
                    VerifyCoupon();
                  }
                }}>
                <Text style={styles.applyBtnTxt}>Apply</Text>
              </TouchableOpacity>
            </View>
            {/* </KeyboardAwareScrollView> */}

            <View style={{marginTop: 15}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  paddingHorizontal: 30,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Bold',
                    color: constant.boldTxt,
                  }}>
                  Delivery Instructions
                </Text>
                <TouchableOpacity
                  onPress={() => displayModal(true)}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Medium',
                      color: constant.BgPrimary,
                    }}>
                    + Add Notes
                  </Text>
                </TouchableOpacity>
              </View>
              {Title && Instruction !== '' ? (
                <View
                  style={{
                    width: '95%',
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 15,
                    alignSelf: 'center',
                    borderRadius: 8,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins-Medium',
                      color: constant.BgPrimary,
                    }}>
                    {Title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Regular',
                      color: constant.regularTxt,
                    }}>
                    {Instruction}
                  </Text>
                </View>
              ) : (
                <View />
              )}

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  paddingHorizontal: 30,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Bold',
                    color: constant.boldTxt,
                  }}>
                  Sub Total
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Bold',
                    color: constant.BgPrimary,
                  }}>
                  £
                  {cartItem.length == 0 ? 0 : parseFloat(totalPrice).toFixed(2)}
                </Text>
                

              </View>

              
              
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  paddingHorizontal: 30,
                  marginTop: 10,
                }}>
              
 

              </View>
              

              {DiscountPrice == 0 ? null : (
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: 30,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Bold',
                      color: constant.boldTxt,
                    }}>
                    Discount
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Bold',
                      color: constant.BgPrimary,
                    }}>
                    £
                    {cartItem.length == 0
                      ? 0
                      : parseFloat(DiscountPrice).toFixed(2)}
                  </Text>
                </View>
              )}


              {cartItem.length == 0 || ShowOffer == true ? null : (
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: 30,
                    marginTop: 10,
                  }}>
                  {discountTYpe === 'percentage' ? (
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'Poppins-Medium',
                        color: constant.BgPrimary,
                      }}>

Spend £{(offdata- totalPrice).toFixed(2)}  more to get {offdatadiscount}% off 

                      
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'Poppins-Medium',
                        color: constant.BgPrimary,
                      }}>
                      Spend £{(offdata- totalPrice).toFixed(2)}  more to get {offdatadiscount}% off 
                       
                    </Text>
                  )}
                </View>
              )}


              {AppliedCoupon == 0 || undefined ? null : (
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: 30,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Bold',
                      color: constant.boldTxt,
                    }}>
                    Coupon Discount
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Bold',
                      color: constant.BgPrimary,
                    }}>
                    £{AppliedCoupon}
                  </Text>
                </View>
              )}

              {AppliedCoupon == 0 || undefined ? null : (
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: 30,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Bold',
                      color: constant.boldTxt,
                    }}>
                    {DiscountCode}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins-Bold',
                      color: constant.BgPrimary,
                    }}>
                    Applied
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  paddingHorizontal: 30,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-SemiBold',
                    color: constant.mediumTxt,
                  }}>
                  Total
                </Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: 'Poppins-Bold',
                    color: constant.BgPrimary,
                  }}>
                  £{''}
                  {cartItem.length == 0
                    ? 0
                    : UpdatedNewTotalPrice == null || undefined
                    ? parseFloat(NewTotalPrice).toFixed(2)
                    : UpdatedNewTotalPrice}
                </Text>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            disabled={cartItem.length == 0 ? true : false}
            onPress={() => {
               console.log('2222222', Object.keys(AppUserData).length);
              if (Object.keys(AppUserData).length === 0) {
                let orderData = {
                  conditionalAmount: conditionalAmount,
                  discountType: discountTYpe,
                  discountVal: discountValue,
                  restaurantCondition: resCondition,
                  restaurantID: resID,
                  service: statusCollection == true ? 'pickup' : 'delivery',
                };
                let AllData = {
                  productData: orderData,
                  amountPayable: NewTotalPrice,
                  newAmountPayable: UpdatedNewTotalPrice,
                  allergy: Title,
                  instruction: Instruction,
                  discountType: discountTYpe,
                  discountVal: DiscountPrice,
                  coupon_code: AppliedCoupon == 0 ? '' : DiscountCode,
                  couponVal: AppliedCoupon,
                };

                console.log('All Data of Order', AllData);

                navigation.navigate('LoginScreen', {data: AllData});
              } else {
                OrderPlace();
              }
            }}
            style={[
              styles.checkOutBtn,
              {
                backgroundColor:
                  cartItem.length == 0 ? constant.boldTxt : constant.BgPrimary,
              },
            ]}>
            <Text style={styles.checkOutBtnTxt}>Checkout</Text>
          </TouchableOpacity>
          <Modal
            animationType={'slide'}
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
              alert('Modal has now been closed.');
            }}>
            <Pressable
              onPress={() => {
                displayModal(!isVisible);
              }}
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: '#00000080',
              }}>
              <KeyboardAwareScrollView
                style={{
                  width: '100%',
                  bottom: 0,
                  position: 'absolute',
                  borderTopRightRadius: 30,
                  backgroundColor: 'white',
                  paddingHorizontal: 10,
                  paddingBottom: 20,
                  borderTopLeftRadius: 30,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    displayModal(!isVisible);
                  }}
                  style={{alignSelf: 'flex-end', margin: 10}}>
                  <Image
                    source={cancelIcon}
                    resizeMode="contain"
                    style={styles.cancelImg}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: '100%',
                  }}>
                  {/* <TextInput
                placeholder="Any food allergy ?"
                value={Title}
                placeholderTextColor={constant.mediumTxt}
                onChangeText={txt => {
                  setTitle(txt);
                }}
                multiline={true}
                style={[styles.inputStyleModal, {marginTop: 15}]}
              /> */}
                  <TextInput
                    placeholder="Instructions for order"
                    value={Instruction}
                    onChangeText={txt => {
                      setInstruction(txt);
                    }}
                    placeholderTextColor={constant.mediumTxt}
                    multiline={true}
                    style={[styles.inputStyleModal, {marginTop: 30}]}
                  />
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => {
                      displayModal(!isVisible);
                    }}>
                    <Text style={styles.addBtnTxt}>Add</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </Pressable>
          </Modal>

          <Modal transparent={true} visible={AllergyModal}>
            <Pressable
              onPress={() => {
                setAllergyModal(false);
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
                  borderRadius: 15,
                  width: '90%',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  
                }}>
                <View
                  style={{
                    width: '100%',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: GlobalColor.BgPrimary,
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins-SemiBold',
                      color: '#fff',
                    }}>
                    Allergy Info
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setAllergyModal(false);
                    }}>
                    <Ionicons name="close-circle" color={'#fff'} size={25} />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Regular',
                    color: constant.BgPrimary,
                    padding: 15,
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
            </Pressable>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerView: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  navItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  toggelView: {
    width: '50%',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
  discountView: {
    marginTop: 15,
    width: '80%',
    //borderWidth:1,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 30,
    paddingVertical: 5,
  },
  inputStyle: {
    height: 45,
    width: '65%',
    paddingLeft: 15,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  applyBtn: {
    height: 35,
    width: 90,
    backgroundColor: constant.BgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  applyBtnTxt: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  checkOutBtn: {
    marginTop: 10,
    height: 55,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: constant.BgPrimary,
    borderRadius: 30,
    marginBottom: 10,
  },
  checkOutBtnTxt: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  cancelImg: {
    alignSelf: 'center',
    // height:30,
    // width:30,
    // tintColor:"#494949"
  },
  inputStyleModal: {
    height: 90,
    width: '80%',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 15,
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: constant.regularTxt,
  },
  addBtn: {
    marginTop: 20,
    height: 45,
    width: '80%',
    backgroundColor: constant.BgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  addBtnTxt: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  mainRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 10,
  },
  itemName: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: GlobalColor.mediumTxt,
  },
  innerRow: {
    flexDirection: 'row',
    width: '60%',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor:'green'
  },
  btnView: {
    backgroundColor: '#F9E6E7',
    width: '50%',
    marginHorizontal: 20,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginRight: 10,
    flexDirection: 'row',
  },
  quantityView: {
    backgroundColor: '#ffffff',
    width: 30,
    height: 25,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityTxt: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: constant.regularTxt,
  },
  separator: {
    alignSelf: 'center',
    height: 2,
    width: '105%',
    backgroundColor: '#F5F5F5',
    marginVertical: 10,
  },
  priceTxt: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: constant.mediumTxt,
  },

  prodView: {
    width: '100%',
    borderBottomLeftRadius: 65,
    borderBottomRightRadius: 65,
    backgroundColor: GlobalColor.BgPrimary,
    paddingBottom: 10,
  },
  prodContainer: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: 'green'
  },
  innerView: {
    width: '95%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  textContainer: {
    left: 15,
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
export default CartScreen;
