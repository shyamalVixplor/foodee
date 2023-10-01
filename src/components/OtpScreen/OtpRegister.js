import React from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import logoIcon from '../../../assets/images/Insert_block-rafiki.png';

const OtpRegister = ({navigation}) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ paddingLeft: 30 }}>
                    <Image source={backIcon} resizeMode="contain" style={styles.backIconStyle} />
                </TouchableOpacity>
            </View>
            <View style={styles.imgView}>
                <Image source={logoIcon} resizeMode="contain" style={styles.logoStyle} />
            </View>
           <View style={{justifyContent:'center',alignItems:"center",alignSelf:"center",width:"80%",paddingHorizontal:10,marginTop:25}}>
           <Text style={styles.textStyle}>Enter 4 digit code sent
                to your Email</Text>
           </View>
           <View style={styles.inputView}>
               <TextInput placeholder="1" placeholderTextColor="#000" keyboardType="number-pad" style={styles.inputStyle} />
               <TextInput placeholder="2" placeholderTextColor="#000" keyboardType="number-pad" style={styles.inputStyle}/>
               <TextInput placeholder="3" placeholderTextColor="#000" keyboardType="number-pad" style={styles.inputStyle}/>
               <TextInput placeholder="4" placeholderTextColor="#000" keyboardType="number-pad" style={styles.inputStyle} />
           </View>
           <TouchableOpacity 
           onPress={()=> navigation.navigate("Login")}
           style={styles.subBtn}>
               <Text style={styles.subBtnTxt}>Submit</Text>
           </TouchableOpacity>
           <Text style={{fontSize:14,fontFamily:'Poppins-Regular',textAlign:'center',marginTop:25,color:'#ABB4BD'}}>Didn’t recieve a verification code?</Text>
           {/* <View style={styles.codeView}>
               <TouchableOpacity>
               <Text style={{fontSize:14,fontFamily:'Poppins-Regular',color:'#FF1654'}}>Resend code |</Text>
               </TouchableOpacity>
               <TouchableOpacity>
               <Text style={{fontSize:14,fontFamily:'Poppins-Regular',left:5,color:'#FF1654'}}>Change Email</Text>
               </TouchableOpacity>
           </View> */}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    backIconStyle: {
        // height:20,
        // width:20,
    },
    imgView: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        marginTop: 40,
    },
    logoStyle: {
        height: 190,
        width: 200,
        alignSelf: 'center',
    },
    textStyle:{
        fontSize:24,
        fontFamily:"Poppins-Bold",
        textAlign:'center'
    },
    inputView:{
        marginTop:30,
        alignSelf:"center",
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        width:'80%',
        paddingHorizontal:10
    },
    inputStyle:{
        height:50,
        width:50,
        borderBottomColor:"#D8D8D8",
        borderBottomWidth:1,
        fontSize:20,
        fontFamily:"Poppins-Regular",
        textAlign:'center'
    },
    subBtn:{
        marginTop:25,
        height:45,
        width:"80%",
        backgroundColor:'#CB1F2C',
        justifyContent:'center',
        borderRadius:25,
        alignSelf:'center',
        alignItems:'center',
    },
    subBtnTxt:{
        fontSize:17,
        fontFamily:"Poppins-Regular",
        color:'#ffffff',
        textAlign:'center',
    },
    codeView:{
        marginTop:10,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    }

});
export default OtpRegister


