import React, { useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import filterIcon from '../../../assets/images/filterIcon.png';
import searchIcon from '../../../assets/images/search_icon.png';
import pinIcon from '../../../assets/images/MapIcon.png';
import downArrow from '../../../assets/images/down_arrow.png';
import pizzaIcon from '../../../assets/images/pizzaSlice.png';
import starRating from '../../../assets/images/star_filled.png';
import starunFill from '../../../assets/images/star_unFilled.png';
import bikeIcon from '../../../assets/images/bikeImg.png';
import bagIcon from '../../../assets/images/bagimg.png';
import heartIcon from '../../../assets/images/heart-red.png';

const ResturentList = ({navigation}) => {
    const [DemoData,setDemoData]=useState([1,2,3,4,5]);



    const renderResturentList =()=>{
        return(
            <TouchableOpacity 
            onPress={()=> navigation.navigate("SingleResturent")}
            style={styles.restroView}>
               <View style={styles.innerView}>
                  <TouchableOpacity>
                       <Image source={pizzaIcon} resizeMode='contain' style={{height:90,width:90,overflow:'hidden'}} />
                  </TouchableOpacity>
                   <View style={{marginTop:5,left:15}}>
                   <View style={{flexDirection:'row',width:'72%',justifyContent:'space-between'}}>
                   <Text style={{fontSize:14,fontFamily:'Poppins-Bold',color:'#4A4B4D',}}>Balti Brasserie</Text>
                   <View style={{flexDirection:'row',justifyContent:'center',alignItems:"center"}}>
                       <View style={{height:20,width:45,backgroundColor:'#CB1F2C',borderRadius:6,justifyContent:"center",alignItems:"center",right:8}}>
                           <Text style={{fontSize:9,fontFamily:'Poppins-Regular',color:'#ffffff'}}>5% OFF</Text>
                       </View>
                       <Image source={heartIcon} resizeMode="contain" style={{}} />
                   </View>
                   </View>
                   <View style={{flexDirection:'row',alignItems:'center',marginTop:3}}>
                    <View style={{flexDirection:'row'}}>
                        <Image source={starRating} resizeMode='contain' style={styles.ratingImg} />
                        <Image source={starRating} resizeMode='contain' style={styles.ratingImg} />
                        <Image source={starRating} resizeMode='contain' style={styles.ratingImg} />
                        <Image source={starRating} resizeMode='contain' style={styles.ratingImg} />
                        <Image source={starunFill} resizeMode='contain' style={styles.ratingImg} />
                    </View>
                    <Text style={{fontSize:6,fontFamily:'Poppins-Regular',color:"#B6B7B7",left:5}}>(125 Review)</Text>
                   </View>
                   <Text style={{fontSize:9,fontFamily:'Poppins-Regular',color:'#7C7D7E',marginTop:3}}>Indian  |  Thai</Text>
                   <Text style={{fontSize:9,fontFamily:'Poppins-Medium',color:'#7C7D7E',marginTop:3}}>Minimum Order £ 0.55</Text>
                   <View style={{flexDirection:'row',width:"73%",justifyContent:'space-between',alignItems:'center',marginTop:5}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={bikeIcon} resizeMode='contain' style={{}} />
                        <Text style={{fontSize:9,fontFamily:'Poppins-Medium',left:5,color:'#7C7D7E'}}>Delivery (30 min)</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={bagIcon} resizeMode='contain' style={{}} />
                        <Text style={{fontSize:9,fontFamily:'Poppins-Medium',left:5,color:'#7C7D7E'}}>Collection (45 min)</Text>
                    </View>
                   </View>
                   </View>
               </View>
            </TouchableOpacity>
        )
    }
    
    return (
        <SafeAreaView styles={styles.container}>
            <View style={styles.headerView}>
                <TouchableOpacity 
                onPress={()=> navigation.goBack()}
                >
                    <Image source={backIcon} resizeMode="contain" style={styles.backIconStyle} />
                </TouchableOpacity>
                <View style={styles.inputView}>
                    <TextInput placeholder="Search Restaurants" editable={false} style={styles.inputStyle} />
                    <Image source={searchIcon} resizeMode='contain' style={styles.searchImg} />
                </View>
                <TouchableOpacity 
                onPress={()=> navigation.navigate('FilterScreen')}
                >
                    <Image source={filterIcon} resizeMode="contain" style={styles.filterIconStyle} />
                </TouchableOpacity>
            </View>
            <View style={styles.locateView}>
                <View style={styles.pinView}>
                    <Image source={pinIcon} resizeMode="contain" style={{ height: 14, width: 14 }} />
                    <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 9, left: 5,color:'#4A4B4D' }}>Radcliffe Park Rd, Salford M6 7WP, UK</Text>
                </View>
                <View style={styles.downView}>
                    <Text style={{ fontFamily: "Poppins-Regular", fontSize: 9, color: '#CB1F2C', right: 5 }}>Change Location</Text>
                    <Image source={downArrow} resizeMode="contain" style={{}} />
                </View>
            </View>
            <View style={{marginTop:20,}}>
                <FlatList
                
                    //pagingEnabled={true}
                    showsVerticalScrollIndicator={false}
                    //legacyImplementation={false}
                    data={DemoData}
                    renderItem={renderResturentList}
                    keyExtractor={(index) => index.toString()}
                    ItemSeparatorComponent={() => <View style={{ margin: 8 }}></View>}
                />
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerView: {
        marginTop: 5,
        height: 45,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25
    },
    inputView: {
        flexDirection: "row",
        height: 35,
        width: 240,
        borderRadius: 60,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    inputStyle: {
        height: 35,
        width: 160,
        borderRadius: 60,
        fontSize: 8,
        fontFamily: 'Poppins-Light',
    },
    searchImg: {
        height: 16,
        width: 16,
    },
    locateView: {
        marginTop: 25,
        flexDirection: "row",
        width: '100%',
        paddingHorizontal: 25,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pinView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    downView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    restroView:{
        height:130,
        width:"100%",
        borderBottomWidth:1,
        borderBottomColor:'#d9d9d9',
        borderRadius:6,
    },
    innerView:{
        flexDirection:'row',
        paddingHorizontal:25,
    },

})
export default ResturentList


