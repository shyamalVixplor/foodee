import React from 'react'
import { SafeAreaView, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, TextInput } from 'react-native';
import keyImg from '../../../assets/images/keyIcon.png';
import checkIcon from '../../../assets/images/check.png';
import bgImage from '../../../assets/images/bgImage.png';

const ResetPassword = ({navigation}) => {
    return (
        <ImageBackground source={bgImage} style={styles.bgImageStyle}>
            <SafeAreaView style={styles.container}>
                <View
                    // onPress={()=> navigation.navigate("ResetPassword")}
                    style={styles.lockView}>
                    <Image source={keyImg} resizeMode="contain" style={styles.lockIconStyle} />
                </View>
                <View style={styles.textView}>
                    <Text style={styles.textStyle}>Reset Your</Text>
                    <Text style={styles.textStyle}>Password?</Text>
                </View>
                <View style={styles.outerViewStyle}>
                    <TextInput placeholder={"New Password"}
                        keyboardType="default"
                        secureTextEntry
                        placeholderTextColor="#666666" style={styles.inputStyle} />
                    <Image source={checkIcon} resizeMode="contain" style={styles.checkIconStyle} />
                </View>
                <View style={styles.outerViewStyle}>
                    <TextInput placeholder={"Confirm Password"}
                        keyboardType="default"
                        secureTextEntry
                        placeholderTextColor="#666666" style={styles.inputStyle} />
                    <Image source={checkIcon} resizeMode="contain" style={styles.checkIconStyle} />
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Success")}
                    style={styles.loginBtn}>
                    <Text style={styles.loginBtnTxt}>Done</Text>
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
        marginBottom:30,
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
export default ResetPassword;


