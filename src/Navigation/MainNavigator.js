import React, {useState, useEffect, useMemo, useReducer, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View, Text, ActivityIndicator, Switch} from 'react-native';
import AuthNavigator from './AuthNavigator';
import UserNavigator from './UserNavigator';
import SplashScreen from '../Screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../context/AuthContext';
// import {CartState} from '../context/CartContext';
import RestaurantContext from '../context/RestaurantContext';

const MainNavigator = () => {
  const [AppUserData, setAppUserData] = React.useState({});
  const [updated, setUpdated] = useState(false);
  // const {getCartItemFromAsyncStorage} = CartState();
  const mountedRef = useRef(true);

  const initialLoginState = {
    isLoading: true,
    isSignOut: false,
    userToken: null,
  };
  let options = {AppUserData, setAppUserData};
  const loginReducer = (prevState, action) => {
    // console.log('NewData', action);
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          isSignOut: false,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          isSignOut: true,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          isSignOut: false,
          userToken: action.token,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);
  const authContext = useMemo(
    () => ({
      signIn: async data => {
        // console.log('user data got', data);
        let userToken = data.token;
        console.log('UserToken going to set', userToken);
        // return

        try {
          if (userToken !== null) {
            await AsyncStorage.setItem('userToken', userToken).then(
              dispatch({type: 'LOGIN', token: userToken}),
              // console.log('loginState', loginState),
            );
            // await AsyncStorage.setItem('userData', userToken).then(
            //   dispatch({type: 'LOGIN', token: userToken}),
            //   console.log('loginState', loginState),
            // );
          }
        } catch (e) {
          console.log('Error==>', e);
        }
        setAppUserData({
          token: data.token,
          data: data.data,
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken').then(
            setAppUserData({}),
            dispatch({type: 'LOGOUT'}),
            console.log('loginState', loginState),
          );
          // await AsyncStorage.removeItem('userData').then(
          //   dispatch({type: 'LOGOUT'}),
          //   setAppUserData({
          //     token: null,
          //     data: null,
          //   }),
          //   console.log('loginState', loginState),
          // );
        } catch (e) {
          console.log('Error==>', e);
        }
      },
      signUp: () => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      location: async data => {
        dispatch({type: 'LOCATION', location: data.location, postcode: postcode});
      }
    }),
    [],
  );
  // const getCartData = async () => {
  //   let cartData;
  //   try {
  //     cartData = await AsyncStorage.getItem('ADD_TO_CART');
  //     // console.log('cartData==>', cartData);
  //     let cartFromAsnc =
  //       JSON.parse(cartData) == null ? {} : JSON.parse(cartData);
  //     console.log('cartFromAsnc==>', cartFromAsnc);
  //     getCartItemFromAsyncStorage(cartFromAsnc);
  //   } catch (e) {
  //     console.log('Error==>', e);
  //   }
  // };
  useEffect(() => {
    fetchUserData();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchUserData = async () => {
    let userToken;
    try {
      userToken = await AsyncStorage.getItem('userToken');
      userData = await AsyncStorage.getItem('userData');
      console.log('User Token found ==>', userToken);
    } catch (e) {
      console.log('Error==>', e);
    } finally {
      setUpdated(false);
    }
    console.log('userToken', userToken);
    if (userToken) {
      setAppUserData({
        token: userToken,
      });
    } else {
      dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
    }
    dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
  };

  return (
    <AuthContext.Provider value={{...options, authContext}}>
      <NavigationContainer>
        <RestaurantContext>
          <UserNavigator />
        </RestaurantContext>
      </NavigationContainer>
    </AuthContext.Provider>
  );

  // return (
  //   <AuthContext.Provider value={{...options, authContext}}>
  //     <NavigationContainer>
  //       {loginState.userToken !== null ? (
  //         <UserNavigator />
  //       ) : (
  //         <AuthNavigator />
  //       )}
  //     </NavigationContainer>
  //   </AuthContext.Provider>
  // );
};

export default MainNavigator;
