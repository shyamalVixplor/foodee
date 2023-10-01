import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
  RefreshControl,
} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import checkIcon from '../../../assets/images/check.png';
import constant from '../../constant/constant';
import Spinner from 'react-native-loading-spinner-overlay';
import UserService from '../../Services/UserService';
import AlertService from '../../Services/AlertService';
import AuthContext from '../../context/AuthContext';
import CheckBox from '@react-native-community/checkbox';
import ApiLoader from '../../components/ApiLoader';

const FilterScreen = ({navigation, route}) => {
  // console.log('postcode', route.params.data);
  let PostCode = route.params.data;
  const [Loader, setLoader] = useState(false);
  const [CuisinesData, setCuisinesData] = useState([]);
  const [MultipleCuisines, setMultipleCuisines] = useState([]);
  const [FilteredRestaurant, setFilteredRestaurant] = useState([]);
  const [Refresh, setRefresh] = useState(false);
  const {authContext, AppUserData} = useContext(AuthContext);
  useEffect(() => {
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
        console.log('Response=>', response);
        if (response.error == false) {
          let ResponseArray = response.data.plateformCuisines;
          let newResponseArray = ResponseArray.map(v => ({
            ...v,
            checked: false,
          }));
          // console.log('CuisinesData of response', newResponseArray);
          setCuisinesData(newResponseArray);
          AlertService.successAlert(response.message);
        } else {
          setRefresh(false);
          setLoader(false);
          console.log('Error', response.message);
          AlertService.dangerAlert(response.message);
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
          // console.log('ResponseArray', ResponseArray);
          // navigation.push('RestaurantListScreen', {
          //   data: ResponseArray,
          //   pincode: PostCode,
          // });
          let newData = {
            data: ResponseArray,
            pincode: PostCode,
          };
          console.log('newData', newData);
          navigation.navigate({
            name: 'RestaurantListScreen',
            data: {
              data: ResponseArray,
              pincode: PostCode,
            },
            merge: true,
          });

          AlertService.successAlert(response.message);
        } else {
          setRefresh(false);
          setLoader(false);
          console.log('Error', response.message);
          AlertService.dangerAlert(response.message);
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

  const renderItem = ({item, index}) => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: '80%',
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 8,
          }}>
          <CheckBox
            value={item.checked}
            tintColors={{true: constant.BgPrimary, false: '#B6B7B7'}}
            onValueChange={() => {
              // console.log('Item Selected', item);
              OnChangedValue(item, index);
            }}
          />
          <TouchableOpacity
            style={{width: '70%', marginLeft: 10}}
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

  return Loader == true ? (
    <ApiLoader />
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={backIcon} resizeMode={'contain'} style={{}} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Poppins-Medium',
              color: constant.mediumTxt,
            }}>
            Filters
          </Text>
          <TouchableOpacity>
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
      </View>
      <View style={{marginTop: 20, paddingHorizontal: 25}}>
        <Text
          style={{
            fontSize: 21,
            fontFamily: 'Poppins-Bold',
            color: constant.boldTxt,
          }}>
          Filter By Cusines
        </Text>
      </View>

      <FlatList
        data={CuisinesData}
        renderItem={renderItem}
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
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: '100%',
  },
  filterBtn: {
    // marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    marginBottom: 30,
    width: '85%',
    backgroundColor: constant.BgPrimary,
    borderRadius: 30,
  },
  filterBtnTxt: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
});
export default FilterScreen;
