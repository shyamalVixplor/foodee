import React, { useContext, useEffect, useState,useRef } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Platform,
  PermissionsAndroid,
  Keyboard,
  Modal,
  Alert,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import constant from '../../constant/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import AuthContext from '../../context/AuthContext';
import UserService from '../../Services/UserService';
import AlertService from '../../Services/AlertService';
import Geolocation from '@react-native-community/geolocation';
import AuthService from '../../Services/AuthService';
import { PostCodeState } from '../../context/PostCodeContext';
import Star from '../../components/Star/Star';
import GlobalColor from '../../constant/constant';
import moment from 'moment';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import { AddressFinder, PostcodeLookup } from "@ideal-postcodes/address-finder";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

console.disableYellowBox = true;

const HomeScreen = ({ navigation }) => {
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const { authContext, AppUserData } = useContext(AuthContext);
  const [Loader, setLoader] = useState(false);
  const [Data, setData] = useState();
  const [Popular, setPopular] = useState([]);
  const [Recommended, setRecommended] = useState([]);
  const { changePostCode } = PostCodeState();
  const contextValue = PostCodeState();
  const [PostCode, setPostCode] = useState('');
  const [PostalCode, setPostalCode] = useState('');
  const [dispData, setDispData] = useState([]);
  // console.log('contextValue', contextValue);
  const mountedRef = useRef(true);

  const context = useRef();

  const TodayName = moment().format('dddd');
  const refSearch = useRef();
  const [postcode, setPostcode] = useState("");

  useEffect(() => {
    if (Platform.OS == 'android') {
      _findCoordinates();
    }
    allFunction()

    return () => {
      mountedRef.current = false;
    };
  }, []);


  useEffect(() => {

  }, []);

  const allFunction = () => {
    getPopularRestaurant(PostCode);
    getRecommendedRestaurant(PostCode);
  }
  const _findCoordinates = async () => {
    try {
      //const granted = await PermissionsAndroid.request(
      //  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //  );
     // const coarseGranted = await PermissionsAndroid.request(
       // PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
   //   );
     // LocationServicesDialogBox.checkLocationServicesIsEnabled({
       // message:
        //  'This app wants to change your device settingsUse GPS for location',
       // ok: 'YES',
       // cancel: 'NO',
   //   }).then(res => {
        console.log('Location service', res);
        console.log('Fine Location Granted', granted);
        console.log('Access Fine Location Granted', coarseGranted);
        if (res.enabled == true) {
          if (granted && coarseGranted === PermissionsAndroid.RESULTS.GRANTED) {
            //Geolocation.getCurrentPosition(position => {
            //  console.log('Current Position', position);
             // let latitude = position.coords.latitude;
             // let longitude = position.coords.longitude;
           //   console.log('Lat ', latitude);
            //  console.log('Long ', longitude);
            //  getLocation(latitude, longitude);
               
              
           // });
          }
        }
     // });
    } catch (error) {
      console.log('Location Error ', error);
    }
  };

  const getLocation = async (text) => {
    console.log("Text", text)
    if(text.length > 1){
      //let realText = text.replace(/ /g,"%");
      let realText = text;
      // let url = 'https://api.ideal-postcodes.co.uk/v1/postcodes/'+realText+'?api_key=ak_lcywt626OyibyCtsib4L9u0vkJlPg'
      let url = 'https://api.ideal-postcodes.co.uk/v1/autocomplete/addresses?query='+realText+'&api_key=ak_lcywt626OyibyCtsib4L9u0vkJlPg'
      console.log("url", url)
      try {
        let res = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        console.log("res", res.data)
        if(res.data && res.data.result.hits && res.data.result.hits.length > 0){
          setDispData(res.data.result.hits)
        }
        else
        {
          setDispData(res.data.result.hits)
          
        }
      
        // return res.data;
      } catch (e) {
        console.log("err", e)
      }
    }
  };

 

  const getRestaurantDetails = (postcode, suggestion) => {
    authContext.location({
      postcode: postcode,
      location: suggestion
    })
    storeData = async () => {
      try {
        await AsyncStorage.setItem('locationitem', suggestion)
        await AsyncStorage.setItem('locationpostcode', postcode)
      } catch (e) {
        // saving error
      }
    } 

   storeData();

    //  console.log("authContext", authContext.location)
    let Code = postcode; 



    if (Code !== '') {
      let data = {
        code: Code,
        updated: true,
      };
    }
    let token = AppUserData.token;
    let data;
    if (postcode != null) {
      data = {
        postcode: postcode,
      };
    } 

    setLoader(true);
    UserService.Post('restaurant/search-postcode', data, token)
      .then(response => {
        setLoader(false); 
        //  console.log('Response=>', response);
          
        if (response.error == false) {
          let responseData = response.data;
          console.log('Restaurant Data=>', response);
          if (responseData !== undefined) {
            navigation.navigate('RestaurantListScreen', {
              data: responseData,
              pincode: PostCode,
            });
            setDispData([])
            setPostalCode('')
          }

          // setData(response.data.restaurantList);
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setData([]);
          AlertOccurred('Alert', 'No Restaurant Found In This Postcode.', 'ok');
          // setIsModalVisible(true);
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('response data', error);
        if (error.response) {
          // client received an error response (5xx, 4xx)
          // AlertService.dangerAlert(error.response.data.error.message);
          AlertOccurred('Alert', 'error.response.data.error.message', 'ok');
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

  const getPopularRestaurant = postCode => {
    let token = AppUserData.token;
    let data = {
      postcode: postCode,
    };
    console.log('API DATA', data);
    setLoader(true);
    UserService.Post('restaurant/popular-restaurants', data, token)
      .then(response => {
        setLoader(false);
        console.log('Popular Restaurant=>', response);
        if (response.error == false) {
          let responseData = response.data;
          console.log('Restaurant Data=>', responseData);
          if (responseData !== undefined) {
            setPopular(responseData);
            // navigation.navigate('RestaurantListScreen', {
            //   data: responseData,
            //   pincode: PostCode,
            // });
          }
          // setData(response.data.restaurantList);
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setPopular([]);

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
          AlertOccurred('Alert', error.response.data.error.mess, 'ok');
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

  const getRecommendedRestaurant = postCode => {
    let token = AppUserData.token;
    let data = {
      postcode: postCode,
    };
    console.log('Recommended api payload', data);
    setLoader(true);
    UserService.Post('restaurant/recommended-restaurants', data, token)
      .then(response => {
        setLoader(false);
        console.log('Recommended Restaurant=>', response);
        if (response.error == false) {
          let responseData = response.data;
          // console.log('Restaurant Data=>', responseData);
          if (responseData !== undefined) {
            setRecommended(responseData);
            // navigation.navigate('RestaurantListScreen', {
            //   data: responseData,
            //   pincode: PostCode,
            // });
          }
          // setData(response.data.restaurantList);
          // AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setRecommended([]);

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
          AlertOccurred('Alert', 'error.response.data.error.message', 'ok');
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

  // http://observancedev.com/foodee-dev/api/restaurant/restaurant-workingDays

  // payload:
  // {
  //     "restaurantId" : 6
  // }

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
                navigation.navigate('SingleRestaurantScreen', {
                  data: resID,
                });
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

  const renderPopularItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        disabled={item.restaurantOpenStatus.status === 'open' ? false : true}
        style={styles.listStylePop}
        onPress={() => {
          getWorkingDays(item.restaurant_id);
        }}>
        <Image source={{ uri: item.image_url }} style={styles.imgStyle} />
        {item.ratings == null || undefined ? null : (
          <Star rating={item.ratings} color={GlobalColor.BgPrimary} />
        )}
        <Text style={styles.prodName}>{item.name}</Text>
        <View style={{width: '85%',alignItems:'center'}}>
          {item.address1 === '' || null || undefined ? null : (
            <Text style={styles.addressText}>{item.address1}</Text>
          )}
          {item.address2 === '' || null || undefined ? null : (
            <Text style={styles.addressText}>{item.address2}</Text>
          )}
          {item.postcode === '' || null || undefined ? null : (
            <Text style={styles.addressText}>{item.postcode}</Text>
          )}
        </View>
        {/* <Text style={styles.addressText}>
          {item.address1}
          {', '}
          {item.address2}
          {', '}
          {item.city}
          {', '}
          {item.postcode}
        </Text> */}
        <View style={[styles.rStatus, {
          backgroundColor:
            item.restaurantOpenStatus.status === 'open'
              ? constant.BgSuccess
              : constant.BgPrimary,
        }]}>
          <Text
            style={{
              color: '#fff',
              fontSize: 10,
            }}>
            {item.restaurantOpenStatus.status === 'open' ? 'Open' : 'Close'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecommend = ({ item, index }) => {
    return (
      <TouchableOpacity
        disabled={item.restaurantOpenStatus.status === 'open' ? false : true}
        style={styles.listStylePop}
        onPress={() => {
          getWorkingDays(item.restaurant_id);
        }}>
        <Image source={{ uri: item.image_url }} style={styles.imgStyle} />

        {item.ratings == null || undefined ? null : (
          <Star rating={item.ratings} color={GlobalColor.BgPrimary} />
        )}
        <Text style={styles.prodName}>{item.name}</Text>
        <View style={{width: '85%',alignItems:'center'}}>
          {item.address1 === '' || null || undefined ? null : (
            <Text style={styles.addressText}>{item.address1}</Text>
          )}
          {item.address2 === '' || null || undefined ? null : (
            <Text style={styles.addressText}>{item.address2}</Text>
          )}
          {item.postcode === '' || null || undefined ? null : (
            <Text style={styles.addressText}>{item.postcode}</Text>
          )}
        </View>
        {/* <Text style={styles.addressText}>
          {item.address1}
          {', '}
          {item.address2}
          {', '}
          {item.city}
          {', '}
          {item.postcode}
        </Text> */}
        <View style={[styles.rStatus, {
          backgroundColor:
            item.restaurantOpenStatus.status === 'open'
              ? constant.BgSuccess
              : constant.BgPrimary,
        }]}>
          <Text
            style={{
              color: '#fff',
              fontSize: 10,
            }}>
            {item.restaurantOpenStatus.status === 'open' ? 'Open' : 'Close'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  console.log("disp", dispData)
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>

    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* <Spinner
        visible={Loader}
        textContent={'Loading...'}
        textStyle={{color: '#fff'}}
      /> */}
      <ImageBackground
        source={require('../../../assets/images/delivery-bg.png')}
        style={styles.bgImage}>
        <View
          style={{ backgroundColor: '#00000080', height: 270, width: '100%' }}>
          <StatusBar barStyle="light-content" />
          <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Get your favorite food online.</Text>
            <View style={styles.inputView}>
              <MaterialIcons
                style={{paddingLeft:2}}
                name="place"
                size={25}
                color={constant.BgPrimary}
              /> 
              <TextInput style={styles.postcode} placeholder='Enter Your Postcode' onChangeText={(text) => {setPostalCode(text), getLocation(text)}} value={PostalCode}></TextInput>
             
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  console.log(PostalCode) 
                  console.log('lllllllllllllll') 
                  if (PostalCode !== '') {
                     getRestaurantDetails(PostalCode);
                  } else {
                    AlertOccurred('Alert', 'Please Enter PostCode', 'ok');
                  }
                }}
                style={styles.findBtn}>
                <Text style={styles.findBtnText}>SEARCH</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          
        </View>
        
      </ImageBackground>
      {/* <SafeAreaView style={styles.container}> */}
      {/* <KeyboardAvoidingView> */}
        {(dispData && dispData.length > 0 ) ?
               <View style={{position:"absolute",elevation: 4, width:283, backgroundColor:"white", zIndex:99, borderWidth:0.3, top:"27%", marginLeft:"auto", marginRight:"auto", alignSelf:"center" }}>
                 <FlatList
                    data={dispData}
                    renderItem={({item}) =>
                    <TouchableOpacity onPress={()=> getRestaurantDetails(PostalCode, item.suggestion)} style={{borderBottomWidth:0.3, height:35, textAlign:"center", justifyContent:"center", paddingLeft:15, }}>
                       <Text>{item.suggestion}</Text>
                    </TouchableOpacity>
                    }
                    style={{height:300}}
                    scrollEnabled={true}
                    keyExtractor={item => item.id}
                  />
               </View>
        :null}
        
      {/* </KeyboardAvoidingView> */}
     
        {/* </SafeAreaView> */}
      <ScrollView showsVerticalScrollIndicator={false} 
        style={styles.underScrollView}>
        {
          Loader ? (
            <View style={{ marginTop: 30, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
              <ActivityIndicator size="large" color={GlobalColor.BgPrimary} />
            </View>
          ) : (<View>
            <View style={styles.popularView}>
              <Text style={styles.textStyleMost}>Top Restaurants</Text>
              
            </View>
            <View style={styles.popularStyleLayout}>
              <FlatList
                horizontal
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                //legacyImplementation={false}
                data={Popular}
                renderItem={renderPopularItem}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => (
                  <View style={{ marginHorizontal: 5 }}></View>
                )}
              />
            </View>
             
            
          </View>)
        }
      </ScrollView>
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
                { marginTop: 20, color: GlobalColor.BgPrimary },
              ]}>
              Warning !
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                color: constant.boldTxt,
                textAlign: 'center',
                marginVertical: 20,
              }}>
              No Restaurant Found In This Postcode.
            </Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    //    flex: 1,
    // height:"100%"
    //backgroundColor:"#ffffff"
  },
  bgImage: {
    // height: 270,
    width: '100%',
    // opacity: 0.8,
    // borderWidth:1,
    position: 'absolute', zIndex: 1
  },
  underScrollView: {
    position: 'relative', 
    zIndex: 0, 
    paddingTop: 270
  },
  postcode: {
    left: 0,
    width:180,
    fontSize: 14,
    fontWeight: "500",
    textAlign:'left',
    
    

  },
  heading: {
    marginTop: Platform.OS === 'android' ? 20 : 40,
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    //textAlign:'center',
    color: '#ffffff',
    width: '80%',
    left: 40,
  },
  imgStyle: {
    resizeMode: 'contain',
    height: 80,
    width: '50%',
    marginLeft: '3%',
    // backgroundColor:'yellow'
    // borderRadius: 15,
  },
  inputView: {
    marginTop: 10,
    height: 40,
    width: '80%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingRight: '3%',
    alignItems:'center'
  },
  pinIconStyle: {
    height: 20,
    width: 20,
    alignSelf: 'center',
    resizeMode: 'contain',
    left: 10,
  },
  inputStyle: {
    height: 50,
    width: '70%',
    paddingLeft: 10,
  },
  findBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: constant.BgPrimary,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  findBtnText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  foodViewLayout: {
    marginTop: Platform.OS === 'android' ? 45 : 25,
    height: 105,
    width: '80%',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 0,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  ffStyle: {
    height: 40,
    width: 40,
    alignSelf: 'center',
  },
  ffTextStyle: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginTop: 5,
  },
  popularView: {
    // marginTop: 10,
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 2,
    // backgroundColor: 'yellow',
  },
  textStyleMost: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: constant.boldTxt,
    marginVertical: 10
  },
  textStyleViewAll: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: constant.BgPrimary,
  },
  popularStyleLayout: {
    width: '95%',
    // marginTop: 15,
    marginLeft: 5,
    // borderWidth: 1,
  },
  listStylePop: {
    alignSelf: 'center',
    height: 200,
    width: 200,
    //borderWidth:1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 4,
    borderRadius: 8,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starView: {
    flexDirection: 'row',
    marginTop: 8,
    //justifyContent:'center',
    //alignItems:'center'
  },
  prodName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: constant.boldTxt,
    textAlign: 'center',
    marginVertical: 5,
    width: '70%',
  },
  addressText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: constant.regularTxt,
    width: '85%',
    textAlign: 'center',
  },

  rStatus: {
    padding: 5,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 10,
    paddingHorizontal: 10,
    position: 'absolute',
    left: 0,
    top: 10,
  }
});
export default HomeScreen;
