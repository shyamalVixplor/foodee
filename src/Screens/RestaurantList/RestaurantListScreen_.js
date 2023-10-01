import React, { useState, useContext, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Keyboard,
} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import filterIcon from '../../../assets/images/filterIcon.png';
import searchIcon from '../../../assets/images/search_icon.png';
import pinIcon from '../../../assets/images/MapIcon.png';
import downArrow from '../../../assets/images/down_arrow.png';
import pizzaIcon from '../../../assets/images/pizzaSlice.png';
import starRating from '../../../assets/images/star_filled.png';
import starunFill from '../../../assets/images/star_unFilled.png';
import bikeIcon from '../../../assets/images/bikeImg.png';
import bagIcon from '../../../assets/images/bagimg.png';
import heartIcon from '../../../assets/images/heart-red.png';
import constant from '../../constant/constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AlertService from '../../Services/AlertService';
import AuthContext from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import UserService from '../../Services/UserService';
import CheckBox from '@react-native-community/checkbox';
import Star from '../../components/Star/Star';
import moment from 'moment';
import ApiLoader from '../../components/ApiLoader';

const RestaurantListScreen = ({ navigation, route }) => {
  const RestaurantType = route.params.type;
  const [Loader, setLoader] = useState(false);
  const [SearchText, setSearchText] = useState('');
  const [FilteredDataSource, setFilteredDataSource] = useState(
    route.params.data,
  );
  const { authContext, AppUserData } = useContext(AuthContext);
  const [DemoData, setDemoData] = useState(route.params.data);
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [FilterModal, setFilterModal] = useState(false);
  const [PostCode, setPostCode] = useState(route.params.pincode);

  const [CuisinesData, setCuisinesData] = useState([]);
  const [MultipleCuisines, setMultipleCuisines] = useState([]);
  const [Refresh, setRefresh] = useState(false);
  const TodayName = moment().format('dddd');
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

  const getRestaurantDetails = () => {
    let token = AppUserData.token;
    let data = {
      postcode: PostCode,
    };
    console.log('Post Code ', data);
    // return;
    setLoader(true);
    UserService.Post('restaurant/search-postcode', data, token)
      .then(response => {
        setLoader(false);
        console.log('Restaurant List Response=>', response);
        if (response.error == false) {
          let responseData = response.data.restaurantList;
          // console.log('Restaurant Data=>', responseData);
          if (responseData !== undefined) {
            setDemoData(responseData);
          }
          setIsModalVisible(false);
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setDemoData([]);

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

  useEffect(() => {
    console.log('Restaurant Details==>', route.params);
    getCuisinesData();
  }, []);

  const getCuisinesData = () => {
    setRefresh(true);
    setLoader(true);
    let token = AppUserData.token;
    UserService.Post('general/plateform-cuisines', {}, token)
      .then(response => {
        setRefresh(false);
        setLoader(false);
        // console.log('Response=>', response);
        if (response.error == false) {
          let ResponseArray = response.data.plateformCuisines;
          let newResponseArray = ResponseArray.map(v => ({
            ...v,
            checked: false,
          }));
          // console.log('CuisinesData of response', newResponseArray);
          setCuisinesData(newResponseArray);
          // AlertService.successAlert(response.message);
        } else {
          setRefresh(false);
          setLoader(false);
          console.log('Error', response.message);
          // AlertService.dangerAlert(response.message);
          AlertOccurred('Alert', response.message, 'ok');
          setCuisinesData([]);
        }
      })
      .catch(error => {
        setRefresh(false);
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

  const getFilteredRestaurant = () => {

    if (MultipleCuisines.length == 0) {
      AlertOccurred('Alert', 'Please choose cuisines', 'OK')
      return
    }
    setRefresh(true);
    setLoader(true);
    let token = AppUserData.token;
    let data = {
      postcode: PostCode,
      cuisineList: MultipleCuisines,
    };
    console.log('Filter params', data);
    UserService.Post('restaurant/search-cuisines', data, token)
      .then(response => {
        setRefresh(false);
        setLoader(false);
        // console.log('Filter Restaurant data=>', response);
        if (response.error == false) {
          let ResponseArray = response.data.restaurantList;
          console.log('ResponseArray', ResponseArray);
          // navigation.push('RestaurantListScreen', {
          //   data: ResponseArray,
          //   pincode: PostCode,
          // });
          setFilteredDataSource(ResponseArray);
          setFilterModal(false);

          // AlertService.successAlert(response.message);
        } else {
          setRefresh(false);
          setLoader(false);
          console.log('Error', response.message);
          // AlertService.dangerAlert(response.message);
          AlertOccurred("Alert", response.message, 'OK')
        }
      })
      .catch(error => {
        setRefresh(false);
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


  const getWorkingDays = resID => {
    let token = AppUserData.token;
    let data = {
      restaurantId: resID,
    };
    setLoader(true);
    UserService.Post('restaurant/restaurant-workingDays', data, token)
      .then(response => {
        setLoader(false);
        console.log('Restaurant Working Days=>', response);
        // return;
        if (response.error == false) {
          let responseData = response.data;
          responseData.find(element => {
            if (element.day == TodayName) {
              if (element.status == 'close') {
                AlertOccurred(
                  'Warning',
                  'Sorry Today our restaurant is closed.',
                  'OK',
                );
              } else {
                navigation.navigate('SingleRestaurantScreen', { data: resID });
              }
            }
          });
        } else {
          setLoader(false);
          AlertOccurred('Alert', response.message, 'ok');
          return;
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

  const renderRestaurantList = ({ item, index }) => {
    return (
      <View>
        <View style={[styles.statusView, {
          backgroundColor:
            item.restaurantOpenStatus.status === 'open'
              ? constant.BgSuccess
              : constant.BgPrimary,
        }]}>
          <Text
            style={{ 
              color: '#fff', 
            }}>
            {item.restaurantOpenStatus.status === 'open' ? 'Open' : 'Close'}
          </Text>
        </View>

        <TouchableOpacity
          disabled={item.restaurantOpenStatus.status === 'open' ? false : true}
          onPress={() => {
            getWorkingDays(item.id);
          }}
          style={styles.restroView}>
          <View style={styles.innerView}>
            <Image
              source={{ uri: item.image_url }}
              resizeMode="contain"
              style={{
                height: 120,
                width: 90,
                overflow: 'hidden',
                marginHorizontal: 10,
                alignSelf: 'center'
              }}
            />

            <View style={{ marginTop: 5, left: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '70%',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                    color: constant.boldTxt,
                  }}>
                  {item.name}
                </Text>
                <View
                  style={{
                    width: '75%',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}>
                  {/* <MaterialIcons
                    name="favorite-border"
                    size={20}
                    color={constant.BgPrimary}
                  /> */}
                </View>
              </View>
              {item.ratings == null || undefined ? null : (
                <Star rating={item.ratings} color={constant.BgPrimary} />
              )}
                 <View style={styles.addressRow}>
                <View
                  style={{
                    // flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}>
                  {item.address1 === '' || null || undefined ? null : (
                    <Text style={styles.addressText}>{item.address1}</Text>
                  )}
                  {/* {item.address1 === '' ||
                  null ||
                  undefined ||
                  item.address2 === '' ||
                  null ||
                  undefined ? null : (
                    <Text style={styles.addressText}>, </Text>
                  )} */}
                  {item.address2 === '' || null || undefined ? null : (
                    <Text style={styles.addressText}>,{item.address2}</Text>
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
                  {item.city === '' || null || undefined ? null : (
                    <Text style={styles.addressText}>{item.city}</Text>
                  )}
                  {item.city === '' ||
                  null ||
                  undefined ||
                  item.postcode === '' ||
                  null ||
                  undefined ? null : (
                    <Text style={styles.addressText}>, </Text>
                  )}
                  {item.postcode === '' || null || undefined ? null : (
                    <Text style={styles.addressText}>{item.postcode}</Text>
                  )}
                </View>
              </View>
              {/* {item.address1 && item.address2 ? (
                <Text
                  style={{
                    width: '50%',
                    fontSize: 9,
                    fontFamily: 'Poppins-Regular',
                    color: constant.regularTxt,
                    marginTop: 3,
                  }}>
                  {item.address1} | {item.address2}, {' '}{item.postcode}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 9,
                    fontFamily: 'Poppins-Regular',
                    color: constant.regularTxt,
                    marginTop: 3,
                  }}>
                  Not Found | Not Found
                </Text>
              )} */}
              {item.minimum_order_value ? (
                <Text
                  style={{
                    fontSize: 9,
                    fontFamily: 'Poppins-Medium',
                    color: constant.regularTxt,
                    marginTop: 3,
                  }}>
                  Minimum Order £ {item.minimum_order_value}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 9,
                    fontFamily: 'Poppins-Medium',
                    color: constant.regularTxt,
                    marginTop: 3,
                  }}>
                  Minimum Order £ 0.00
                </Text>
              )}
              <View
                style={{
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginBottom: 5,
                  }}>
                  <MaterialIcons
                    name="two-wheeler"
                    size={22}
                    color={constant.BgPrimary}
                  />
                  <Text
                    style={{
                      fontSize: 9,
                      fontFamily: 'Poppins-Medium',
                      left: 5,
                      color: constant.regularTxt,
                    }}>
                    Delivery({item.delivery_time_min}-{item.delivery_time_max}{' '}mins)
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <Feather
                    name="shopping-bag"
                    size={16}
                    color={constant.BgPrimary}
                  />
                  <Text
                    style={{
                      fontSize: 9,
                      fontFamily: 'Poppins-Medium',
                      left: 5,
                      color: constant.mediumTxt,
                    }}>
                    Collection ({item.pickup_time_min}-{item.pickup_time_max}{' '}
                    mins)
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}>
                {item.discount
                  ? item.discount.map(data => {
                    return (
                      <View>
                        {data.discount_type === 'percentage' ? (
                          <Text
                            style={{
                              fontSize: 9,
                              fontFamily: 'Poppins-Regular',
                              color: constant.boldTxt,
                              marginTop: 5,
                            }}>
                            {data.discount_val}% OFF ON ALL ORDERS OVER £
                            {data.condition_amount}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: 9,
                              fontFamily: 'Poppins-Regular',
                              color: constant.boldTxt,
                              marginTop: 2,
                            }}>
                            £{data.discount_val} OFF ON ALL ORDERS OVER £
                            {data.condition_amount}
                          </Text>
                        )}
                      </View>
                    );
                  })
                  : item.discount_array.map(data => {
                    return (
                      <View>
                        {data.discount_type === 'percentage' ? (
                          <Text
                            style={{
                              fontSize: 9,
                              fontFamily: 'Poppins-Regular',
                              color: constant.boldTxt,
                            }}>
                            {data.discount_val}% OFF ON ALL ORDERS OVER £
                            {data.condition_amount}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: 9,
                              fontFamily: 'Poppins-Regular',
                              color: constant.boldTxt,
                              marginTop: 5,
                            }}>
                            £{data.discount_val} OFF ON ALL ORDERS OVER £
                            {data.condition_amount}
                          </Text>
                        )}
                      </View>
                    );
                  })}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCuisinesItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 8,
          }}>
          <CheckBox
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            value={item.checked}
            tintColors={{ true: constant.BgPrimary, false: '#B6B7B7' }}
            onValueChange={() => {
              console.log('Item Selected', item);
              OnChangedValue(item, index);
            }}
          />
          <TouchableOpacity
            style={{ width: '70%', marginLeft: 10 }}
            onPress={() => {
              OnChangedValue(item, index);
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                color: constant.mediumTxt,
              }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ListEmptyView = () => {
    return (
      <View
        style={{
          width: '100%',
          minHeight: 400,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Poppins-Medium',
            color: constant.mediumTxt,
          }}>
          No platform cuisines found.
        </Text>
      </View>
    );
  };

  const OnChangedValue = (item, index) => {
    // console.log('Checked Item', item, index);
    // return;
    let newData = [...CuisinesData];
    let selectedCuisine = [];
    newData[index].checked = !newData[index].checked;
    // console.log('newData', newData);
    setCuisinesData(newData);
    CuisinesData.forEach(element => {
      newData.forEach(data => {
        if (element.id == data.id && data.checked == true) {
          selectedCuisine.push(parseInt(element.id));
        } else {
          return;
        }
      });
    });
    // console.log('selectedCuisine', selectedCuisine);
    setMultipleCuisines(selectedCuisine);
  };

  const ClearSelectedCuisines = () => {
    let newData = [...CuisinesData];
    newData.forEach(element => {
      console.log('Element', element);
      element.checked = false;
    });
    setCuisinesData(newData);
  };

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = DemoData.filter(function (item) {
        const itemData = item.name ? item.name : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearchText(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(DemoData);
      setSearchText(text);
    }
  };

  return (
    Loader == true ? (
      <ApiLoader />): <SafeAreaView styles={styles.container}>
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="chevron-left"
            size={30}
            color={constant.BgPrimary}
          />
        </TouchableOpacity>
        <View style={styles.inputView}>
          <TextInput
            placeholder="Search Restaurants"
            // editable={false}
            onChangeText={text => searchFilterFunction(text)}
            value={SearchText}
            style={styles.inputStyle}
          />
          <Ionicons name="search" size={20} color={constant.BgPrimary} />
        </View>
        <TouchableOpacity
          onPress={() => {
            setFilterModal(true);
          }}
        // onPress={() => navigation.navigate('FilterScreen', {data: PostCode})}
        >
          <MaterialIcons
            name="filter-list"
            size={30}
            color={constant.mediumTxt}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.locateView}>
        <View style={styles.pinView}>
          <MaterialIcons name="place" color={constant.BgPrimary} size={20} />
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 12,
              left: 5,
              color: constant.mediumTxt,
            }}>
            {PostCode}
          </Text>
        </View>
        <View style={styles.downView}>
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true);
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 12,
                color: constant.regularTxt,
                right: 5,
              }}>
              Change Location
            </Text>
          </TouchableOpacity>

          <MaterialIcons
            name="keyboard-arrow-down"
            size={20}
            color={constant.BgPrimary}
          />
        </View>
      </View>
      {RestaurantType ? (
        <Text
          style={{
            marginLeft: '8%',
            marginTop: 10,
            fontFamily: 'Poppins-SemiBold',
            fontSize: 16,
            color: constant.mediumTxt,
          }}>
          {RestaurantType}
        </Text>
      ) : null}
      <View>
        <FlatList
          //pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          //legacyImplementation={false}
          data={FilteredDataSource}
          renderItem={renderRestaurantList}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{ margin: 8 }}></View>}
        />
      </View>
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
            <View style={styles.inputView2}>
              <MaterialIcons
                name="place"
                size={25}
                color={constant.BgPrimary}
              />
              <TextInput
                maxLength={10}
                placeholder={'Enter your postcode'}
                value={PostCode}
                placeholderTextColor={constant.normalTxt}
                onChangeText={txt => {
                  setPostCode(txt);
                }}
                style={styles.inputStyle}
              // editable={false}
              />
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  if (PostCode !== '') {
                    getRestaurantDetails();
                  } else {
                    // AlertService.dangerAlert('Please Enter PostCode');
                    AlertOccurred('Alert', 'Please Enter PostCode', 'ok');
                  }
                }}
                style={styles.findBtn}>
                <Text style={styles.findBtnText}>FIND</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal transparent={true} visible={FilterModal}>
        <Pressable
          // onPress={() => {
          //   setFilterModal(false);
          // }}
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
                setFilterModal(false);
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'flex-end',
                marginTop: -10
              }}>
              <Ionicons
                name="close-circle"
                color={constant.BgPrimary}
                size={30}
              />
            </TouchableOpacity>
            <View style={{ width: '100%' }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8
                  // paddingHorizontal: 25,
                }}>
                <Text
                  style={{
                    fontSize: 21,
                    fontFamily: 'Poppins-Bold',
                    color: constant.boldTxt,
                  }}>
                  Filter By Cuisines
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    ClearSelectedCuisines();
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'Poppins-Medium',
                      color: constant.BgPrimary,
                    }}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={CuisinesData}
                renderItem={renderCuisinesItem}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={ListEmptyView}
                numColumns={2}
                refreshControl={
                  <RefreshControl
                    refreshing={Refresh}
                    onRefresh={() => getCuisinesData()}
                  />
                }
              />

              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => {
                  getFilteredRestaurant();
                }}>
                <Text style={styles.filterBtnTxt}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
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
    marginTop: 5,
    paddingVertical: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  inputView: {
    flexDirection: 'row',
    width: 240,
    borderRadius: 60,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputStyle: {
    width: 160,
    borderRadius: 60,
    fontSize: 12,
    fontFamily: 'Poppins-Light',
  },
  searchImg: {
    height: 16,
    width: 16,
  },
  locateView: {
    marginTop: 25,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pinView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restroView: {
    // height: 130,
    width: '100%',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
    borderRadius: 6,
    // backgroundColor: 'yellow'
  },
  innerView: {
    flexDirection: 'row',
    // paddingHorizontal: 15,
    width: '100%',
    justifyContent: 'space-between',
  },
  inputView2: {
    height: 50,
    //position:'absolute',
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'green',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  findBtn: {
    height: 35,
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: constant.BgPrimary,
    marginRight: 5,
  },
  findBtnText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  filterBtn: {
    // marginTop: 30,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    marginTop: 30,
    marginBottom: 10,
    width: '60%',
    backgroundColor: constant.BgPrimary,
    borderRadius: 30,
  },
  filterBtnTxt: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
  statusView: {
    padding: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingLeft: 10,
    paddingLeft: 10,
    position: 'absolute',
    zIndex: 100,
    right: 0,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressRow: {
    width: '100%',
    // flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  addressText: {
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
    color: constant.regularTxt,
    lineHeight: 16,
  },
});
export default RestaurantListScreen;
