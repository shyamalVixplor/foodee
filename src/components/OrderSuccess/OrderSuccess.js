import React from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import checkIcon from '../../../assets/images/check.png';

const OrderSuccess = ({navigation}) => {
    return (
        <View style={styles.container}>
              <View style={styles.checkView}>
               <Image source={checkIcon} style={styles.checkStyle} />
           </View>
           <Text style={{fontSize:24,fontFamily:'Poppins-Bold',color:"#374151",marginTop:20}}>Success</Text>
           <View style={{width:'75%',marginTop:10,height:85,}}>
           <Text style={{fontSize:16,fontFamily:'Poppins-Regular',color:"#6B7280"}}>Your items has been placcd and is on it’s way to being processed</Text>
           </View>
           <TouchableOpacity style={styles.trackBtn}>
               <Text style={styles.trackBtnTxt}>Track order</Text>
           </TouchableOpacity>
           <TouchableOpacity 
            onPress={()=> navigation.navigate('Home')}
           style={styles.backHomeBtn}>
               <Text style={styles.backHomeBtnTxt}>Back Home</Text>
           </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff',
        justifyContent:'center',
        alignItems:'center',
    },
    checkView:{
        height:80,
        width:80,
        borderRadius:40,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#CB1F2C',
    },
    checkStyle:{
        height:25,
        width:25,
        alignSelf:'center',
        tintColor:'#ffffff'
    },
    trackBtn:{
        marginTop:5,
        height:50,
        width:'80%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#CB1F2C',
        borderRadius:25,
    },
    trackBtnTxt:{
        fontSize:17,
        fontFamily:'Poppins-Regular',
        color:'#FFFFFF'
    },
    backHomeBtn:{
        marginTop:20,
        height:50,
        width:'80%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FFFFFF',
        borderRadius:25,
        borderWidth:1,
        borderColor:'#CB1F2C'
    },
    backHomeBtnTxt:{
        fontSize:17,
        fontFamily:'Poppins-Regular',
        color:'#CB1F2C',
    }

});
export default OrderSuccess


