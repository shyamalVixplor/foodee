import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import lock from '../../../assets/images/lockIcon.png';
import checkIcon from '../../../assets/images/check.png';
import bgImage from '../../../assets/images/bgImage.png';
import { URL } from '../../api/api';

const apiUrl = URL;
const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const onPressSend = () => {
        fetch(URL+"foodee-dev/api/user/forget-password", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        }).then((res)=> res.json())
        .then((response)=>{
            //console.log(response);
            if (response.status =='200') {
                ToastAndroid.show(response.message,ToastAndroid.SHORT);
                navigation.navigate("ResetPassword");
            }else{
                ToastAndroid.show(response.message,ToastAndroid.SHORT);
            }

        }).catch((err)=>{
            console.log("error",err);
        })
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
        onPressSend();
    }
   
    return (
        <ImageBackground source={bgImage} style={styles.bgImageStyle}>
            <SafeAreaView style={styles.container}>
                <View
                    style={styles.lockView}>
                    <Image source={lock} resizeMode="contain" style={styles.lockIconStyle} />
                </View>
                <View style={styles.textView}>
                    <Text style={styles.textStyle}>Forgot Your</Text>
                    <Text style={styles.textStyle}>Password?</Text>
                </View>
                <View style={styles.textViewCheck}>
                    <Text style={styles.textStyleCheck}>Check your mail to Reset</Text>
                    <Text style={styles.textStyleCheck}>your Password</Text>
                </View>
                <View style={styles.outerViewStyle}>
                    <TextInput placeholder={"Enter Your Email"}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        //value={email}
                        onChangeText={(text) => setEmail(text)}
                        placeholderTextColor="#666666" style={styles.inputStyle} />
                    <Image source={checkIcon} resizeMode="contain" style={styles.checkIconStyle} />
                </View>
                <TouchableOpacity
                    onPress={()=> navigation.navigate("OtpScreen")}
                    style={styles.loginBtn}>
                    <Text style={styles.loginBtnTxt}>Send</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImageStyle: {
        width: "100%",
        height: "100%",
        flex: 1
    },
    lockView: {
        marginTop: 30,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        height: 80,
        width: 80,
        backgroundColor: "#FFFFFF",
        borderRadius: 40,
        borderWidth: 0.8,
        borderColor: "#d9d9d9"
    },
    lockIconStyle: {
        height: 30,
        width: 30,
        alignSelf: "center",
    },
    textStyle: {
        fontSize: 25,
        fontWeight: "500",
        textAlign: "center",
    },
    textView: {
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
        marginTop: 30,
    },
    textViewCheck: {
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 30,
    },
    textStyleCheck: {
        fontSize: 20,
        fontWeight: "300",
        textAlign: "center",
        color: "#666666"
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
});
export default ForgotPassword


