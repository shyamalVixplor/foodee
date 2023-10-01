import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../Screens/Login/LoginScreen';
import RegisterScreen from '../Screens/Register/RegisterScreen';
import ForgotPasswordScreen from '../Screens/ForgotPassword/ForgotPasswordScreen';
import OtpScreen from '../Screens/OTP/OtpScreen';
import OtpRegisterScreen from '../Screens/OTP/OtpRegisterScreen';
import ResetPasswordScreen from '../Screens/ResetPassword/ResetPasswordScreen';
import SuccessScreen from '../Screens/ResetPassword/SuccessScreen';
import welcomeScreen from '../Screens/WelcomeScreen/welcomeScreen';
// import OrderSuccessScreen from '../Screens/OrderSuccess/OrderSuccessScreen';
// import FilterScreen from '../Screens/FilterScreen/FilterScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'welcomeScreen'}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="OtpRegisterScreen" component={OtpRegisterScreen} />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      <Stack.Screen name="welcomeScreen" component={welcomeScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
