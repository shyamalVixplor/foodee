import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from '../Screens/ProfileScreen/ProfileScreen';
import UpdateProfile from '../Screens/ProfileScreen/UpdateProfile';
import Address from '../Screens/Address/Address';
import ForgotPasswordScreen from '../Screens/ForgotPassword/ForgotPasswordScreen';
import OtpScreen from '../Screens/OTP/OtpScreen';
import OtpRegisterScreen from '../Screens/OTP/OtpRegisterScreen';
import ResetPasswordScreen from '../Screens/ResetPassword/ResetPasswordScreen';
import SuccessScreen from '../Screens/ResetPassword/SuccessScreen';
import OrderHistory from '../Screens/OrderHistory/OrderHistory';
import OrderDetails from '../Screens/OrderDetails/OrderDetails';
import WelcomeScreen from '../Screens/WelcomeScreen/welcomeScreen';
import AuthContext from '../context/AuthContext';
import UserLoginScreen from '../Screens/UserLogin/UserLogin';
import UserRegisterScreen from '../Screens/UserRegister/UserRegister';
import TrackOrder2 from '../Screens/TrackOrder/TrackOrder2';

const ProfileStack = createNativeStackNavigator();
const ProfileStackNavigator = () => {
  const {authContext, AppUserData} = useContext(AuthContext);
  return (
    <ProfileStack.Navigator
      initialRouteName={
        Object.keys(AppUserData).length === 0
          ? 'WelcomeScreen'
          : 'ProfileScreen'
      }
      screenOptions={{header: () => null}}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="UpdateProfile" component={UpdateProfile} />
      <ProfileStack.Screen name="Address" component={Address} />
      <ProfileStack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <ProfileStack.Screen name="OtpScreen" component={OtpScreen} />
      <ProfileStack.Screen
        name="OtpRegisterScreen"
        component={OtpRegisterScreen}
      />
      <ProfileStack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
      <ProfileStack.Screen name="SuccessScreen" component={SuccessScreen} />
      <ProfileStack.Screen name="UserLoginScreen" component={UserLoginScreen} />
      <ProfileStack.Screen
        name="UserRegisterScreen"
        component={UserRegisterScreen}
      />
      <ProfileStack.Screen name="OrderHistory" component={OrderHistory} />
      <ProfileStack.Screen name="TrackOrder2" component={TrackOrder2} />
      <ProfileStack.Screen name="OrderDetails" component={OrderDetails} />
      <ProfileStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigator;
