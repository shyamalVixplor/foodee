import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../Screens/Home/HomeScreen';
import RestaurantListScreen from '../Screens/RestaurantList/RestaurantListScreen';
import SingleRestaurantScreen from '../Screens/singleResturent/SingleResturentScreen';
import CartStackNavigator from './CartStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
// import TrackOrder2 from '../Screens/TrackOrder/TrackOrder2';
// import OrderDetails from '../Screens/OrderDetails/OrderDetails';

const HomeStack = createNativeStackNavigator();
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{header: () => null}}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen
        name="RestaurantListScreen"
        component={RestaurantListScreen}
      />
      <HomeStack.Screen
        name="SingleRestaurantScreen"
        component={SingleRestaurantScreen}
      />
      <HomeStack.Screen
        name="CartStackNavigator"
        component={CartStackNavigator}
      />
      {/* <HomeStack.Screen name="TrackOrder2" component={TrackOrder2} />
      <HomeStack.Screen name="OrderDetails" component={OrderDetails} /> */}
      <HomeStack.Screen
        name="ProfileStackNavigator"
        component={ProfileStackNavigator}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
