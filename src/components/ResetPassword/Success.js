import React from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import checkIcon from '../../../assets/images/check.png';

const Success = ({navigation}) => {
    return (
        <SafeAreaView style={styles.container}>
           <View style={styles.checkView}>
               <Image source={checkIcon} style={styles.checkStyle} />
           </View>
           <Text style={{fontSize:24,fontFamily:'Poppins-Bold',color:"#374151",marginTop:20}}>Success</Text>
           <Text style={{fontSize:16,fontFamily:'Poppins-Regular',color:'#6B7280',marginTop:20}}>Your new password has been set</Text>
           <View style={styles.loginView}>
               <Text style={{color:'#6B7280',fontSize:16,fontFamily:'Poppins-SemiBold'}}>Cleck here</Text>
               <TouchableOpacity 
               onPress={()=> navigation.navigate("Login")}
                style={{left:6}}>
                   <Text style={{color:'#CB1F2C',fontSize:16,fontFamily:'Poppins-SemiBold'}}>Login</Text>
               </TouchableOpacity>
           </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FFFFFF'
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
    loginView:{
        flexDirection:'row',
        marginTop:20,
        justifyContent:'center',
        alignItems:'center'
    }
})
export default Success


