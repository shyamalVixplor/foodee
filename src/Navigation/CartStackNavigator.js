import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CartScreen from '../Screens/Cart/CartScreen';
import DetailsCartScreen from '../Screens/DetailsCart/DetailsCartScreen'; 
import DetailsCartScreenCollection from '../Screens/DetailsCart/DetailsCartScreenCollection';
import OrderPayScreen from '../Screens/OrderPay/OrderPayScreen';
import OrderPayScreenCollection from '../Screens/OrderPay/OrderPayScreenCollection';
import PaymentScreen from '../Screens/Payment/PaymentScreen';
import OrderSuccessScreen from '../Screens/OrderSuccess/OrderSuccessScreen';
import TrackOrder2 from '../Screens/TrackOrder/TrackOrder2';
import OrderDetails from '../Screens/OrderDetails/OrderDetails';
import LoginScreen from '../Screens/Login/LoginScreen';
import RegisterScreen from '../Screens/Register/RegisterScreen'; 

const CartStack = createNativeStackNavigator();

const CartStackNavigator = () => {
  return (
    <CartStack.Navigator
      initialRouteName="CartScreen"
      screenOptions={{header: () => null}}>
      {/* Main Cart Screen */}
      <CartStack.Screen name="CartScreen" component={CartScreen} />
      <CartStack.Screen name="LoginScreen" component={LoginScreen} />
      <CartStack.Screen name="RegisterScreen" component={RegisterScreen} />

      <CartStack.Screen name="DetailsCartScreen" component={DetailsCartScreen}/>
      <CartStack.Screen name="DetailsCartScreenCollection" component={DetailsCartScreenCollection}/>
      
      <CartStack.Screen name="OrderPayScreen" component={OrderPayScreen} />
      <CartStack.Screen name="OrderPayScreenCollection" component={OrderPayScreenCollection} />

      <CartStack.Screen
        name="OrderSuccessScreen"
        component={OrderSuccessScreen}
      />
      <CartStack.Screen name="PaymentScreen" component={PaymentScreen} />
      <CartStack.Screen name="TrackOrder2" component={TrackOrder2} />
      <CartStack.Screen name="OrderDetails" component={OrderDetails} />
    </CartStack.Navigator>
  );
};

export default CartStackNavigator;
