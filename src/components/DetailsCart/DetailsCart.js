import React, { useState,useRef } from 'react'
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput,Modal, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import down_Icon from '../../../assets/images/down_arrow_nrml.png';
import cancelIcon from '../../../assets/images/crossIcon.png';

const DetailsCart = ({ navigation }) => {
    const fullNameRef = useRef();
    const mobileRef= useRef();
    const emailRef = useRef();
    const addressfirstRef = useRef();
    const addressSecondRef = useRef();
    const cityRef = useRef();
    const pinCodeRef=useRef();
    const [isVisible, setIsVisible] = useState(false);
    const displayModal = (show) => setIsVisible(show);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerView}>
                <View style={styles.navItem}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={backIcon} resizeMode={'contain'} style={{}} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', color: '#4A4B4D' }}>Details</Text>
                </View>
            </View>
            <View style={styles.addressView}>
                <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D'}}>Select Address</Text>
                <TouchableOpacity 
                onPress={()=> displayModal(true)}
                >
                    <Image source={down_Icon} resizeMode="contain" style={{height:15,width:15}} />
                </TouchableOpacity>
            </View>

            <Text style={{fontSize:20,fontFamily:'Poppins-SemiBold',
            color:'#4A4B4D',marginTop:20,textAlign:'center'}}>Confirm Your Details</Text>
            <KeyboardAvoidingView 
             behavior={Platform.OS == 'android' ? 'height' : null}
            >
            <ScrollView
             showsVerticalScrollIndicator={false}
            >
            <View style={styles.inputView}>
                <TextInput 
                 style={styles.inputStyle}
                 placeholder="Full Name"
                 onSubmitEditing={() => mobileRef.current.focus()}
                 blurOnSubmit={false}
                 returnKeyType="next"
                 keyboardType="default"
                 autoCorrect={false}
                 placeholderTextColor='#B6B7B7'
                 />
            </View>
            <View style={styles.inputView}>
                <TextInput 
                 style={styles.inputStyle}
                 onSubmitEditing={() => emailRef.current.focus()}
                 ref={mobileRef}
                 blurOnSubmit={false}
                 placeholder="Mobile Number"
                 keyboardType="number-pad"
                 returnKeyType="next"
                 autoCorrect={false}
                 placeholderTextColor='#B6B7B7'
                 />
            </View>
            <View style={styles.inputView}>
                <TextInput 
                 style={styles.inputStyle}
                 onSubmitEditing={() => addressfirstRef.current.focus()}
                 ref={emailRef}
                 blurOnSubmit={false}
                 placeholder="Email"
                 keyboardType="email-address"
                 returnKeyType="next"
                 autoCapitalize='none'
                 autoCorrect={false}
                 placeholderTextColor='#B6B7B7'
                 />
            </View>
            <View style={styles.inputView}>
                <TextInput 
                 style={styles.inputStyle}
                 onSubmitEditing={() => addressSecondRef.current.focus()}
                 ref={addressfirstRef}
                 blurOnSubmit={false}
                 placeholder="Address 1"
                 keyboardType="default"
                //  autoCapitalize='none'
                returnKeyType="next"
                 autoCorrect={false}
                 placeholderTextColor='#B6B7B7'
                 />
            </View>
            <View style={styles.inputView}>
                <TextInput 
                 style={styles.inputStyle}
                 onSubmitEditing={() => cityRef.current.focus()}
                 ref={addressSecondRef}
                 blurOnSubmit={false}
                 placeholder="Address 2"
                 keyboardType="default"
                 returnKeyType="next"
                //  autoCapitalize='none'
                 autoCorrect={false}
                 placeholderTextColor='#B6B7B7'
                 />
            </View>
            <View style={styles.inputView}>
                <TextInput 
                 style={styles.inputStyle}
                 onSubmitEditing={() => pinCodeRef.current.focus()}
                 ref={cityRef}
                 blurOnSubmit={false}
                 placeholder="City"
                 keyboardType="default"
                 returnKeyType="next"
                //  autoCapitalize='none'
                 autoCorrect={false}
                 placeholderTextColor='#B6B7B7'
                 />
            </View>
            <View style={styles.inputView}>
                <TextInput 
                 style={styles.inputStyle}
                 ref={pinCodeRef}
                 //blurOnSubmit={false}
                 placeholder="Pincode"
                 keyboardType="number-pad"
                //  autoCapitalize='none'
                 autoCorrect={false}
                 placeholderTextColor='#B6B7B7'
                 />
            </View>
            <TouchableOpacity 
            onPress={()=> navigation.navigate('OrderPay')}
            style={styles.saveBtn}>
                <Text style={styles.saveBtnTxt}>Save & Proceed</Text>
            </TouchableOpacity>
            </ScrollView>
            </KeyboardAvoidingView>
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    alert('Modal has now been closed.');
                }}>
                <View style={{ height: "100%", width: "100%", backgroundColor: "#00000080" }}>
                    <View style={{
                        width: "100%", bottom: 0,
                        position: "absolute", height: "54%", borderTopRightRadius: 30,
                        backgroundColor: "white", paddingHorizontal: 10, borderTopLeftRadius: 30,
                    }}
                    >
                     <View style={{marginTop:30,flexDirection:'row',width:'90%',justifyContent:'space-between',alignItems:'center',alignSelf:'center'}}>
                     <Text style={{fontSize:17,fontFamily:'Poppins-Regular',color:'#4A4B4D'}}>Select Address</Text>
                        <TouchableOpacity
                            onPress={() => { displayModal(!isVisible); }}
                            style={{ }}>
                            <Image source={cancelIcon} resizeMode="contain" style={styles.cancelImg} />
                        </TouchableOpacity>
                     </View>
                        <View style={{ justifyContent: "center", alignItems: "center", alignSelf: "center", width: "100%" }}>
                           <View style={styles.addressStyle}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',width:'85%'}}>
                            <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#2D2D2D'}}>Address one</Text>
                            <View style={[styles.radioView,{backgroundColor:'#CB1F2C',}]}></View>
                            </View>
                           </View>
                           <View style={styles.addressStyle}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',width:'85%'}}>
                            <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#2D2D2D'}}>Address Two</Text>
                            <View style={[styles.radioView,{}]}></View>
                            </View>
                           </View>
                           <View style={styles.addressStyle}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',width:'85%'}}>
                            <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#2D2D2D'}}>Address three</Text>
                            <View style={[styles.radioView,{}]}></View>
                            </View>
                           </View>
                           <View style={styles.addressStyle}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',width:'85%'}}>
                            <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#2D2D2D'}}>Address Four</Text>
                            <View style={[styles.radioView,{}]}></View>
                            </View>
                           </View>
                           <View style={styles.addressStyle}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',width:'85%'}}>
                            <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#2D2D2D'}}>Pay in Cash</Text>
                            <View style={[styles.radioView,{}]}></View>
                            </View>
                           </View>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    headerView: {
        height: 40,
        width: '100%',
        paddingHorizontal: 25,
        marginTop:Platform.OS ==='android'?15:10,
    },
    navItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "55%"
    },
    addressView:{
        marginTop:10,
        height:40,
        width:'80%',
        backgroundColor:'#F2F2F2',
        alignSelf:'center',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:30,
        flexDirection:'row',
        borderRadius:30
    },
    inputView:{
        marginTop:20,
        height:50,
        width:'80%',
        backgroundColor:'#F2F2F2',
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:30
    },
    inputStyle:{
        height:50,
        width:'80%',
        borderRadius:30,
        fontSize:17,
        fontFamily:'Poppins-Regular',
        color:'#B6B7B7'
    },
    saveBtn:{
        marginTop:20,
        height:50,
        width:'80%',
        backgroundColor:'#CB1F2C',
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:30,
    },
    saveBtnTxt:{
        fontSize:17,
        fontFamily:'Poppins-Regular',
        color:'#ffffff'
    },
    addressStyle:{
        marginTop:20,
        height:40,
        width:'90%',
        backgroundColor:'#F6F6F6',
        borderWidth:1,
        borderColor:'#d9d9d9',
        borderRadius:6,
        justifyContent:'center',
        alignItems:'center'
    },
    radioView:{
        height:15,
        width:15,
        borderWidth:1,
        borderColor:'#CB1F2C',
        borderRadius:10,
    },

});
export default DetailsCart


