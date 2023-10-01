import React, {useContext, useEffect, useState} from 'react';
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
import {PostCodeState} from '../../context/PostCodeContext';
import ApiLoader from '../ApiLoader';

const HomeScreen = ({navigation}) => {
  const [DemoData, setDemoData] = useState([1, 2, 3]);
  const {authContext, AppUserData} = useContext(AuthContext);
  const [Loader, setLoader] = useState(false);
  const [Data, setData] = useState();
  const [PostCode, setPostCode] = useState('');
  const {state, changePostCode} = PostCodeState();
  console.log('State', state);
  useEffect(() => {
    findCoordinates();

    if (state.postcode != null || state.postcode !== '') {
      getRestaurantDetails();
    }
  }, []);

  const findCoordinates = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted) {
        Geolocation.getCurrentPosition(info => {
          let latitude = info.coords.latitude;
          let longitude = info.coords.longitude;
          getLocation(latitude, longitude);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getLocation = (lat, long) => {
    AuthService.ThirtPartyGet(
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
        lat +
        ',' +
        long +
        '&key=AIzaSyBMwouPgA9rfQ4kRHKnaXR3FxPzjPytxFs',
    ).then(res => { 
      console.log("8888787888");
      console.log(res);
      let postcode = res.results[0].address_components[6].long_name;
      console.log('postcode', postcode);
      let data = {
        code: postcode,
        updated: false,
      };
      changePostCode(data);
    });
  };
  const getRestaurantDetails = () => {
    let token = AppUserData.token;
    let data;
    if (state.postcode != null) {
      data = {
        postcode: state.postcode,
      };
    }

    console.log('Post Code ', data);
    // return;
    setLoader(true);
    UserService.Post('restaurant/search-postcode', data, token)
      .then(response => {
        setLoader(false);
        // console.log('Response=>', response);
        if (response.error == false) {
          let responseData = response.data.restaurantList;
          // console.log('Restaurant Data=>', responseData);
          if (responseData !== undefined) {
            navigation.navigate('RestaurantListScreen', {
              data: responseData,
              postCode: data.postcode,
            });
          }
          // setData(response.data.restaurantList);
          AlertService.successAlert(response.message);
        } else {
          setLoader(false);
          console.log('Error', response.message);
          setData([]);

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

  const renderPopularItem = () => {
    return (
      <View style={styles.listStylePop}>
        <Image
          source={require('../../../assets/images/pizzaImg.png')}
          style={styles.imgStyle}
        />
        <View style={styles.starView}>
          <MaterialIcons name="star" size={16} color={constant.BgPrimary} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Poppins-Regular',
              color: constant.BgPrimary,
              textAlign: 'center',
              left: 8,
            }}>
            4.9
          </Text>
          <Text
            style={{
              fontSize: 9,
              fontFamily: 'Poppins-Regular',
              color: constant.normalTxt,
              textAlign: 'center',
              left: 10,
            }}>
            (124 Ratings)
          </Text>
        </View>
        <Text style={styles.prodName}>Volta Do Mar</Text>
        <Text style={styles.addressText}>
          13-15 Tavistock Street ,Covent Garden London Wc2E 7, Ec1A 2Bc
        </Text>
      </View>
    );
  };
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
    Loader == true ? (
      <ApiLoader />
    ) : (
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <ImageBackground
          source={require('../../../assets/images/delivery-bg.png')}
          style={styles.bgImage}>
          <View
            style={{backgroundColor: '#00000080', height: 270, width: '100%'}}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
              <Text style={styles.heading}>Get your Favorite food online.</Text>
              <View style={styles.inputView}>
                <MaterialIcons
                  name="place"
                  size={25}
                  color={constant.BgPrimary}
                />
                <TextInput
                  placeholder={'Enter your postcode'}
                  value={state.postcode}
                  placeholderTextColor={constant.normalTxt}
                  onChangeText={txt => {
                    let data = {
                      code: txt,
                      updated: true,
                    };

                    changePostCode(data);
                  }}
                  style={styles.inputStyle}
                  // editable={false}
                />
                <TouchableOpacity
                  onPress={() => {
 
                     
                    if (PostCode !== '') {
                      getRestaurantDetails();
                    } else {
                      AlertService.dangerAlert('Please Enter PostCode111');
                    }
                  }}
                  style={styles.findBtn}>
                  <Text style={styles.findBtnText}>FIND</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.foodViewLayout}>
                <View>
                  <Image
                    source={require('../../../assets/images/burger.png')}
                    style={styles.ffStyle}
                  />
                  <Text style={styles.ffTextStyle}>Fast Food</Text>
                </View>
                <View>
                  <Image
                    source={require('../../../assets/images/italianIcon.png')}
                    style={styles.ffStyle}
                  />
                  <Text style={styles.ffTextStyle}>Italian</Text>
                </View>
                <View>
                  <Image
                    source={require('../../../assets/images/indianIcon.png')}
                    style={styles.ffStyle}
                  />
                  <Text style={styles.ffTextStyle}>Indian</Text>
                </View>
                <View>
                  <Image
                    source={require('../../../assets/images/englishIcon.png')}
                    style={styles.ffStyle}
                  />
                  <Text style={styles.ffTextStyle}>English</Text>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </ImageBackground>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginTop: 90}}>
          <View style={styles.popularView}>
            <Text style={styles.textStyleMost}>Most Popular</Text>
            <Text style={styles.textStyleViewAll}>View all</Text>
          </View>
          <View style={styles.popularStyleLayout}>
            <FlatList
              horizontal
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              //legacyImplementation={false}
              data={DemoData}
              renderItem={renderPopularItem}
              keyExtractor={index => index.toString()}
              ItemSeparatorComponent={() => <View style={{margin: 10}}></View>}
            />
          </View>
          <View style={[styles.popularView, {marginTop: 25}]}>
            <Text style={styles.textStyleMost}>Recommended</Text>
            <Text style={styles.textStyleViewAll}>View all</Text>
          </View>
          <View style={styles.popularStyleLayout}>
            <FlatList
              horizontal
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              //legacyImplementation={false}
              data={DemoData}
              renderItem={renderPopularItem}
              keyExtractor={index => index.toString()}
              ItemSeparatorComponent={() => <View style={{margin: 10}}></View>}
            />
          </View>
        </ScrollView>
      </View>
    )
    // </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    //    flex: 1,
    // height:"100%"
    //backgroundColor:"#ffffff"
  },
  bgImage: {
    height: 270,
    width: '100%',
    // opacity: 0.8,
    //borderWidth:1,
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
  inputView: {
    marginTop: 10,
    height: 50,
    //position:'absolute',
    width: '80%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 5,
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
    height: 35,
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: constant.BgPrimary,
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
    // position:'absolute',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 2,
  },
  textStyleMost: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: constant.boldTxt,
  },
  textStyleViewAll: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: constant.BgPrimary,
  },
  popularStyleLayout: {
    marginTop: 15,
    left: 40,
    //height:"50%",
    // borderWidth:1
  },
  listStylePop: {
    height: 195,
    width: 195,
    //borderWidth:1,
    borderRadius: 8,
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
    marginTop: 4,
    left: 5,
    color: constant.boldTxt,
  },
  addressText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    left: 5,
    color: constant.normalTxt,
    width: '85%',
  },
});
export default HomeScreen;
