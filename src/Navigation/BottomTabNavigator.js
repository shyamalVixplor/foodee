import React from 'react';
import {View, Text, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import SettingsScreen from '../Screens/SettingScreen/SettingScreen';
import CartStackNavigator from './CartStackNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import constant from '../constant/constant';
import {CartState} from '../context/CartContext';
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
  const data = CartState();
  // console.log('Data', data);
  return (
    <Tab.Navigator
      initialRouteName="HomeStackNavigator"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Poppins-Regular',
        },
        tabBarActiveTintColor: '#CB1F2C',
        tabBarInactiveTintColor: '#4A4B4D',
      })}>
      <Tab.Screen
        name={'HomeStackNavigator'}
        component={HomeStackNavigator}
        options={{
          headerStatusBarHeight:0,
          tabBarLabel: 'HOME',
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="home-outline"
              type="Ionicons"
              color={color}
              size={size}
            />
          ),
          // unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="CartStackNavigator"
        component={CartStackNavigator}
        options={({route})=>({
          headerStatusBarHeight:0,
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? ""
            console.log("RouteName",routeName)
            if (routeName === 'OrderSuccessScreen') {
              return { display: "none" }
            }
            return
          })(route),

          tabBarLabel: 'CART',
          tabBarBadge:
            data.cartItem == undefined || data.cartItem.length == 0
              ? null
              : data.cartItem.length,
          // tabBarBadge: 0,
          tabBarBadgeStyle: {
            backgroundColor: constant.BgPrimary,
            fontSize: 8,
            fontFamily: 'Poppins-Regular',
            color:
              data.cartItem == undefined || data.cartItem.length == 0
                ? 'transparent'
                : '#fff',
          },
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="cart-outline"
              type="Ionicons"
              color={color}
              size={size}
            />
          ),
          unmountOnBlur: true,
        })}
      />
      <Tab.Screen
        name={'ProfileStackNavigator'}
        component={ProfileStackNavigator}
        options={{
          headerStatusBarHeight:0,
          tabBarLabel: 'ACCOUNT',
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="person-circle-outline"
              type="Ionicons"
              color={color}
              size={size}
            />
          ),
          unmountOnBlur: true,
        }}
      />
      {/* <Tab.Screen
        name={'SettingsScreen'}
        component={SettingsScreen}
        options={{
          tabBarLabel: 'SETTINGS',
          tabBarIcon: ({color, size}) => (
            <Feather name="settings" type="Feather" color={color} size={size} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
