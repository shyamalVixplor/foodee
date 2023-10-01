import React,{useContext, useState} from 'react'
import { View, Text, StyleSheet, TextInput, Image, SafeAreaView, TouchableOpacity, ImageBackground, ToastAndroid, } from 'react-native'
import checkIcon from '../../../assets/images/check.png';
import eyeIcon from '../../../assets/images/eye.png';
import fabIcon from '../../../assets/images/fbIcon.png';
import googleIcon from '../../../assets/images/google.png';
import bgImage from '../../../assets/images/bgImage.png';
import { URL } from '../../api/api';
// import { GlobaleContext } from '../../context/AuthContext';


const Login = ({navigation}) => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    // const {setToken}=useContext(GlobaleContext);

  const onPressLogin=()=>{
        fetch(URL+"foodee-dev/api/user/user-login", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email:email,
                password:password,
            })
        }).then((res)=> res.json())
        .then((response)=>{
            console.log("login data",response);
            if (response.status =='200') {
                ToastAndroid.show(response.message,ToastAndroid.SHORT);
                setToken(response.data.token);
                navigation.navigate("Home");
            }else{
                ToastAndroid.show(response.message,ToastAndroid.SHORT);
            }
        }).catch((err)=>{
            console.log("error",err);
        });
    }

    const validateForm = () => {
        const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
        if (email.length === 0) {
          setError("email required");
          ToastAndroid.show('Email cannot be Empty', ToastAndroid.SHORT);
          return
        }
        if (!regex.test(email.trim())) {
           setError("Email not valid");
          ToastAndroid.show('Email not valid', ToastAndroid.SHORT);
          return
        }
        if (password.length === 0) {
            setError("password cannot be Empty ");
            ToastAndroid.show("password cannot be Empty ", ToastAndroid.SHORT);
            return
          }
        onPressLogin();
      }
      
    return (
        <ImageBackground source={bgImage} style={styles.bgImageStyle}>
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Login</Text>
            <View style={styles.outerViewStyle}>
                <TextInput placeholder={"Email"} 
                keyboardType="email-address"
                onChangeText={(text)=> setEmail(text)}
                placeholderTextColor="#666666" style={styles.inputStyle} />
                <Image source={checkIcon} resizeMode="contain" style={styles.checkIconStyle} />
            </View>
            <View style={styles.outerViewStyle}>
                <TextInput placeholder={"Password"} 
                secureTextEntry
                onChangeText={(text)=> setPassword(text)}
                placeholderTextColor="#666666" style={styles.inputStyle} />
                <Image source={eyeIcon} resizeMode="contain" style={styles.checkIconStyle} />
            </View>
            <TouchableOpacity 
            onPress={()=> navigation.navigate("bottomTab")}
            style={styles.loginBtn}>
                <Text style={styles.loginBtnTxt}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=> navigation.navigate("Register")}
            style={styles.accBtn}>
                <Text style={styles.accBtnTxt} >Create Your Account</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=> navigation.navigate("ForgotPassword")}
            style={styles.forgotBtn}>
                <Text style={styles.forgotBtnTxt} >Lost Your Password ?</Text>
            </TouchableOpacity>
            <View style={styles.orStyleView}>
                <Text style={styles.orStyleText}>OR</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: "400", color: "#666666", textAlign: 'center', marginTop: 20 }}>Login Via</Text>
            <View style={styles.socialIconStyle}>
                <TouchableOpacity style={styles.fabView}>
                    <Text style={styles.textStyle}>Facebook</Text>
                    <Image source={fabIcon} resizeMode="contain" style={styles.fabIconStyle} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.googleView}>
                    <Text style={styles.textStyle}>Google</Text>
                    <Image source={googleIcon} resizeMode="contain" style={styles.googleIconStyle} />
                </TouchableOpacity>
            </View>
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
    loginBtn: {
        height: 45,
        width: "80%",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: 'center',
        backgroundColor: '#CC2A37',
        borderRadius: 20,
        marginTop: 20,
    },
    loginBtnTxt: {
        fontSize: 18,
        fontWeight: "500",
        color: 'white',
        textAlign: "center"
    },
    forgotBtn: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    forgotBtnTxt: {
        fontSize: 16,
        fontWeight: "500",
        color: "#666666",
    },
    accBtn:{
        marginTop: 30,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    accBtnTxt:{
        fontSize: 16,
        fontWeight: "500",
        color: "#666666",
    },
    orStyleView: {
        marginTop: 20,
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: "#FDB100",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
    },
    orStyleText: {
        fontSize: 15,
        fontWeight: "400",
        color: "white",
    },
    socialIconStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        width: "70%",
        marginTop: 40
    },
    fabView: {
        flexDirection: 'row',
        height: 45,
        width: 110,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textStyle: {
        fontSize: 15,
        fontWeight: "400",
        textAlign: 'center',
        color: '#666666'
    },
    googleView: {
        flexDirection: 'row',
        height: 45,
        width: 115,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    fabIconStyle: {
        height: 23,
        width: 23,
        alignSelf: 'center',
    },
    googleIconStyle:{
        height: 23,
        width: 23,
        alignSelf: 'center',
        left:4
    }
    // footerStyle:{
    //     bottom:0,
    //     top:0,
    //    //alignSelf:"flex-end",
    //    height:40,
    //    width:"100%"
    // },
})

export default Login
