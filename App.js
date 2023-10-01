import React, { useState, useEffect, useMemo, useRef, useReducer } from 'react';
import { StyleSheet, Text, View, Image, Dimensions ,TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import SplashScreen from './src/Screens/SplashScreen';
import MainNavigator from './src/Navigation/MainNavigator';
import CartContextProvider from './src/context/CartContext';
import { StripeProvider } from '@stripe/stripe-react-native';
import PublishableKey from './src/api/StripePublishableKey';
import RNBootSplash from 'react-native-bootsplash';
import NetInfo from '@react-native-community/netinfo';
import NoConnection from './src/Screens/Connection/NoConnection';
import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from '@react-native-async-storage/async-storage';


const slides = [
  {
    id: 1,
    image: require('./src/assets/intro1.jpg')
  }
]

  ;

const App = ({ navigation }) => {
  const netStatus = React.createContext(NetConnection);
  const mountedRef = useRef(true);
  const [showHomePage, setShowHomePage] = useState()
  const [onBoarding, setOnBoarding] = useState(null)
  const [Loader, setLoader] = useState(false);


  const buttonLabel = (label) => {
    return (
      <View style={{
        padding: 12
      }}>


      </View>
    )
  }
  
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };



    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
      console.log('Bootsplash has been hidden successfully');
    });
    return () => { };
  }, []);

  const callFun = () => {
    NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setNetConnection(state.isConnected);
    });
  };
  useEffect(() => {
    async function fetchData() {
      try { 
        const onboarding = await AsyncStorage.getItem('onboarding');
        setOnBoarding(onboarding);
        if (!onboarding) {
           AsyncStorage.setItem('onboarding', 'onboarding');


        } 
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    callFun();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [StripeKey, setStripeKey] = useState(PublishableKey);
  const [NetConnection, setNetConnection] = useState();

  StatusBar.setBarStyle('light-content', true);

  const handlePress = () => {
    //setShowHomePage(true);
    setOnBoarding('onboarding');
  }

  const win = Dimensions.get('window');
  const ratio = win.width/541; //541 is actual image width



  if (!onBoarding) {
    return (

      <StripeProvider
        publishableKey={
          'pk_live_51JZXSmK8cSb7ySyt5KRF4FXQYEkWfenJIndoKbFUilkoL0wwtU04Snl20JjiUKweaz6UxpMeOzhu5X4c86WOoF8F00px6ELkxt'
        } //Live StripePublishableKey
        merchantIdentifier="merchant.identifier">
        <StatusBar
          barStyle={Platform.OS == 'ios' ? 'dark-content' : 'light-content'}
        />
        <AppIntroSlider
          data={slides}
          renderItem={({ item }) => {
            return (
              <View style={{
                flex: 1,
                alignItems: 'center',
              }}>


               <TouchableOpacity activeOpacity={.5} onPress={handlePress}>

                  <Image
                    source={item.image}
                    style={{
                      height: win.height,
                    }}
                    resizeMode="contain"
                  />

                </TouchableOpacity>

                <Text style={{
                


                }}>
                  {item.title}
                </Text>
                <Text style={{
                  textAlign: 'center',
                  paddingTop: 5,

                }}>
                  {item.description}
                </Text>
              </View>
            )
          }}
          activeDotStyle={{
          

            width: 30,
          }}
          showSkipButton
          renderNextButton={() => buttonLabel("Next")}
          renderSkipButton={() => buttonLabel("Skip")}
          renderDoneButton={() => buttonLabel("")}
          onDone={() => {
           // setShowHomePage(true);
          }}
        />
      </StripeProvider>
    );
  };

  return (
    <CartContextProvider>
      <MainNavigator />
    </CartContextProvider>
  )

};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
