import React from 'react'
import { SafeAreaView, StyleSheet, Text, View,TouchableOpacity,Image, ImageBackground, Platform } from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import bgIcon from '../../../assets/images/demo.png';
import rightIcon from '../../../assets/images/right_arrow_nrml.png';
import heartIcon from '../../../assets/images/newHeart.png';

const ProfileScreen = ({navigation}) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop:Platform.OS ==='android'?15:10 }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ paddingLeft: 30 }}>
                    <Image source={backIcon} resizeMode="contain" style={styles.backIconStyle} />
                </TouchableOpacity>
            </View>
           <View style={styles.nameView}>
               <ImageBackground source={bgIcon} style={styles.imgStyle}>
                   <Text style={styles.textStyle}>DS</Text>
               </ImageBackground>
               <Text style={{fontSize:18,fontFamily:"Poppins-Medium",color:"#4A4B4D",marginTop:10}}>Deep Saha</Text>
               <Text style={{fontSize:14,fontFamily:"Poppins-Regular",color:"#4A4B4D",marginTop:8}}>youremail@gmail.com</Text>
               <TouchableOpacity style={styles.editBtnView}>
                   <Text style={styles.editBtnTxt}>Edit Profile</Text>
                   <Image source={rightIcon} resizeMode="contain" style={{left:5,tintColor:'#ffffff',height:10,width:10}} />
               </TouchableOpacity>
           </View>
           <View style={[styles.layoutView,{marginTop:30}]}>
            <Image source={heartIcon} resizeMode="contain" style={styles.iconStyle} />
            <Text style={{fontSize:15,fontFamily:'Poppins-SemiBold'}} >Favourites</Text>
            <Image source={rightIcon} resizeMode='contain' style={styles.iconRightImg} />
           </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff',
        // justifyContent:'center',
        // alignItems:'center',
    },
    nameView:{
      marginTop:30,
      justifyContent:'center',
      alignItems:'center',
      alignSelf:"center"
     // backgroundColor:'#CB1F2C'
    },
    imgStyle:{
        height:90,
        width:90,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    textStyle:{
        fontSize:25,
        fontFamily:"Poppins-Bold",
        color:'#CB1F2C'
    },
    editBtnView:{
        marginTop:10,
        backgroundColor:"#CB1F2C",
        height:30,
        width:110,
        borderRadius:40,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:"center",
        alignSelf:'center'
    },
    editBtnTxt:{
        fontSize:12,
        fontFamily:"Poppins-Regular",
        color:'#ffffff'
    },
    layoutView:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:'center',
        alignSelf:'center',
        width:'80%',

    }
})
export default ProfileScreen


