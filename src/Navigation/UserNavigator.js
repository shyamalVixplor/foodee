import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from '../Navigation/BottomTabNavigator';
import OrderSuccessScreen from '../Screens/OrderSuccess/OrderSuccessScreen';
import LoginScreen from '../Screens/Login/LoginScreen';
import RegisterScreen from '../Screens/Register/RegisterScreen';
import ForgotPasswordScreen from '../Screens/ForgotPassword/ForgotPasswordScreen';
import OtpScreen from '../Screens/OTP/OtpScreen';
import OtpRegisterScreen from '../Screens/OTP/OtpRegisterScreen';
import ResetPasswordScreen from '../Screens/ResetPassword/ResetPasswordScreen';
import SuccessScreen from '../Screens/ResetPassword/SuccessScreen';
import welcomeScreen from '../Screens/WelcomeScreen/welcomeScreen';
import NoConnection from '../Screens/Connection/NoConnection';

const UserStack = createNativeStackNavigator();
const UserNavigator = () => {
  return (
    <UserStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="BottomTabs">
      <UserStack.Screen name="BottomTabs" component={BottomTabs} />
      <UserStack.Screen
        name="OrderSuccessScreen"
        component={OrderSuccessScreen}
      />
      <UserStack.Screen name="LoginScreen" component={LoginScreen} />
      <UserStack.Screen name="RegisterScreen" component={RegisterScreen} />
      <UserStack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <UserStack.Screen name="OtpScreen" component={OtpScreen} />
      <UserStack.Screen
        name="OtpRegisterScreen"
        component={OtpRegisterScreen}
      />
      <UserStack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
      <UserStack.Screen name="SuccessScreen" component={SuccessScreen} />
      <UserStack.Screen name="welcomeScreen" component={welcomeScreen} />
      <UserStack.Screen name="NoConnection" component={NoConnection} />
    </UserStack.Navigator>
  );
};

export default UserNavigator;
