import React, { useRef } from 'react'
import { SafeAreaView, StyleSheet, Text, View,TextInput,Image,TouchableOpacity,ImageBackground, KeyboardAvoidingView,Platform, ScrollView, ToastAndroid } from 'react-native';
import checkIcon from '../../../assets/images/check.png';
import eyeIcon from '../../../assets/images/eye.png';
import bgImage from '../../../assets/images/bgImage.png';
import { useState } from 'react/cjs/react.development';
import { URL } from '../../api/api';

const Register = ({navigation}) => {
    const firstNameRef = useRef();
    const lastNameRef= useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const passwordRef = useRef();
    const confirmpassRef = useRef();
    const [firstName,setFirstName]=useState('');
    const [lastName,setLastName]=useState('');
    const [email,setEmail]=useState('');
    const [moblie,setMobile]=useState('');
    const [password,setPassword]=useState('');
   // const [confirmPass,setConfirmPass]=useState('');
    const [error,setError]=useState('');

    const onPressRegister=()=>{
        fetch(URL+"foodee-dev/api/user/register-user", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname:firstName,
                lastname:lastName,
                email:email,
                phone:moblie,
                password:password,
            })
        }).then((res)=> res.json())
        .then((response)=>{
            console.log("data register",response);
            if (response.status =='200') {
                ToastAndroid.show(response.message,ToastAndroid.SHORT);
                navigation.navigate("Login");
            }else{
                ToastAndroid.show(response.message,ToastAndroid.SHORT);
            }

        }).catch((err)=>{
            console.log("error",err);
        })
    }

  const validateForm = () => {
        const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
        const mob = /^[1-9]{1}[0-9]{9}$/;
        if (firstName.length === 0) {
          setError("First name cannot be Empty");
          ToastAndroid.show('First name cannot be Empty', ToastAndroid.SHORT);
          return
        }
        if (lastName.length === 0) {
            setError("Last name cannot be Empty");
            ToastAndroid.show('Last name cannot be Empty', ToastAndroid.SHORT);
            return
          }
        if (email.length === 0) {
          setError("email required");
          ToastAndroid.show('Email cannot be Empty', ToastAndroid.SHORT);
          return
        }
        if (!regex.test(email.trim())) {
          this.setState({ error: "Email not valid" });
          ToastAndroid.show('Email not valid', ToastAndroid.SHORT);
          return
        }
        if (moblie.length === 0) {
            setError("Phone number cannot be Empty ");
            ToastAndroid.show("Phone number must be more then 9 ", ToastAndroid.SHORT);
            return
          }
          if (moblie.length != 10) {
            setError("Phone number must be 10");
            ToastAndroid.show("Phone number must be 10 ", ToastAndroid.SHORT);
            return
          }
          if (!mob.test(moblie)) {
            setError("Phone number is not valid");
            ToastAndroid.show("Phone number is not valid ", ToastAndroid.SHORT);
            return
          }
          if (password.length === 0) {
            setError("password cannot be Empty ");
            ToastAndroid.show("password cannot be Empty ", ToastAndroid.SHORT);
            return
          }
        //   if (confirmPass.length === 0) {
        //     setError("confirm password cannot be Empty ");
        //     ToastAndroid.show("confirm password cannot be Empty ", ToastAndroid.SHORT);
        //     return
        //   }
        //   if (confirmPass !== password) {
        //     setError("password does not match");
        //     ToastAndroid.show("password does not match", ToastAndroid.SHORT);
        //     return
        //   }
        onPressRegister();
          
      }

    return (
        <ImageBackground source={bgImage} style={styles.bgImageStyle}>
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Sign Up</Text>
            <KeyboardAvoidingView 
             behavior={Platform.OS == 'android' ? 'padding' : null}
            >
            <ScrollView
             showsVerticalScrollIndicator={false}
            >
            <View style={styles.outerViewStyle}>
                <TextInput placeholder={"First Name"} 
                onSubmitEditing={() => lastNameRef.current.focus()}
                blurOnSubmit={false}
                keyboardType="default"
                returnKeyType="next"
                onChangeText={(text)=> setFirstName(text)}
                placeholderTextColor="#666666" style={styles.inputStyle} />
                <Image source={checkIcon} resizeMode="contain" style={styles.checkIconStyle} />
            </View>
            <View style={styles.outerViewStyle}>
                <TextInput placeholder={"Last Name"} 
                 onSubmitEditing={() => emailRef.current.focus()}
                 ref={lastNameRef}
                 onChangeText={(text)=> setLastName(text)}
                 blurOnSubmit={false}
                 keyboardType="default"
                 returnKeyType="next"
                 placeholderTextColor="#666666" style={styles.inputStyle} />
                <Image source={checkIcon} resizeMode="contain" style={styles.checkIconStyle} />
            </View>
            <View style={styles.outerViewStyle}>
                <TextInput placeholder={"Email"}
                 onSubmitEditing={() => phoneRef.current.focus()}
                 ref={emailRef}
                 blurOnSubmit={false}
                 keyboardType="email-address"
                 onChangeText={(text)=> setEmail(text)}
                 returnKeyType="next"
                 autoCapitalize="none"
                 placeholderTextColor="#666666" style={styles.inputStyle} />
                <Image source={checkIcon} resizeMode="contain" style={styles.checkIconStyle} />
            </View>
            <View style={styles.outerViewStyle}>
                <TextInput placeholder={"Phone"}
                 onSubmitEditing={() => passwordRef.current.focus()}
                 ref={phoneRef}
                 blurOnSubmit={false} 
                 maxLength={10}
                 returnKeyType="next"
                 onChangeText={(text)=> setMobile(text)}
                 keyboardType="phone-pad"
                 placeholderTextColor="#666666" style={styles.inputStyle} />
                <Image source={checkIcon} resizeMode="contain" style={styles.checkIconStyle} />
            </View>
            <View style={styles.outerViewStyle}>
                <TextInput placeholder={"Password"}
                 //onSubmitEditing={() => confirmpassRef.current.focus()}
                 ref={passwordRef}
                // blurOnSubmit={false} 
                 secureTextEntry
                 returnKeyType="next"
                 onChangeText={(text)=> setPassword(text)}
                 keyboardType="default"
                 placeholderTextColor="#666666" style={styles.inputStyle} />
                <Image source={eyeIcon} resizeMode="contain" style={styles.checkIconStyle} />
            </View>
            {/* <View style={styles.outerViewStyle}>
                <TextInput placeholder={"Confirm Password"}
                 ref={confirmpassRef}
                //  blurOnSubmit={false}
                 onChangeText={(text)=> setConfirmPass(text)}
                 returnKeyType='done'  
                 secureTextEntry
                 keyboardType="default"
                 placeholderTextColor="#666666" style={styles.inputStyle} />
                <Image source={eyeIcon} resizeMode="contain" style={styles.checkIconStyle} />
            </View> */}
            <TouchableOpacity 
           onPress={()=> navigation.navigate("OtpRegister")}
            style={styles.registerBtn}>
                <Text style={styles.registerBtnTxt}>Register</Text>
            </TouchableOpacity>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImageStyle:{
        width:"100%",
        height:"100%",
        flex:1
    },
    heading: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 30,
    },
    outerViewStyle: {
        flexDirection: "row",
        height: 45,
        width: "80%",
        justifyContent: 'center',
        alignItems: "center",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#d9d9d9",
        borderRadius: 20,
        paddingHorizontal: 15,
        marginTop: 20
    },
    inputStyle: {
        color: "#666666",
        height: 45,
        width: "93%",
        paddingLeft: 12,
    },
    checkIconStyle: {
        height: 18,
        width: 18,
        tintColor: "#FDB100",
        alignSelf: "center"
    },
    registerBtn: {
        height: 45,
        width: "80%",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: 'center',
        backgroundColor: '#CC2A37',
        borderRadius: 20,
        marginTop: 30,
    },
    registerBtnTxt: {
        fontSize: 18,
        fontWeight: "500",
        color: 'white',
        textAlign: "center"
    },
});
export default Register


