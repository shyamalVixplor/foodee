import React, { useState } from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,FlatList, Platform } from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import heartIcon from '../../../assets/images/hertIcon.png';
import pizzaSquare from '../../../assets/images/chad-montano-MqT0asuoIcU-unsplash.png';
import starRating from '../../../assets/images/star_filled.png';
import starunFill from '../../../assets/images/star_unFilled.png';
import bikeIcon from '../../../assets/images/bikeImg.png';
import bagIcon from '../../../assets/images/bagimg.png';
import plusIcon from '../../../assets/images/plus-circle-fill.png';
import minsIcon from '../../../assets/images/dash-lg.png';
import plusLightIcon from '../../../assets/images/plus.png';

const SingleResturent = ({navigation}) => {
    const [statusDelivery,setStatusDelivery]=useState(true);
    const [statusCollection,setStatusCollection]=useState(false);
    const [DemoData,setDemoData]=useState([1,2,3]);
    const [DemoData1,setDemoData1]=useState([1,2,3]);
    const [plusBtn,setPlusBtn]=useState(true);
   
    const onTogglePress=(value)=>{
        switch (value) {
            case 'delivery':
                setStatusCollection(false);
                setStatusDelivery(true);
                break;
            case 'collection':
                setStatusCollection(true);
                setStatusDelivery(false);
                break;
            default:
                value;
                break;
        }
    }

    const renderMenuList=({index})=>{
       // console.log('index number',index);
        return(
            <View style={styles.itemListView}>
             <View style={{paddingHorizontal:30}}>
             <View style={{flexDirection:'row'}}>
                <View>
                <Text style={{fontSize:11,fontFamily:'Poppins-SemiBold',color:'#4A4B4D'}}>Peri Peri Wrap</Text>
                 <View style={{marginTop:5,width:'80%'}}>
                  <Text style={{fontSize:8,fontFamily:'Poppins-Regular',color:'#B6B7B7'}}>13-15 Tavistock Street ,Covent Garden London
                    WC2E 7, EC1A 2BC</Text>
              </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:"center",alignItems:'center'}}>
                    <Text style={{fontSize:11,fontFamily:'Poppins-Bold',color:'#4A4B4D',right:30}} >£ 0.55</Text>
                   
                   {plusBtn?(
                    <TouchableOpacity
                     onPress={()=> setPlusBtn(false)}
                     >
                    <Image source={plusIcon} resizeMode='contain' style={{left:20}} />
                    </TouchableOpacity>
                   ):(
                    <View style={styles.incrementView}>
                        <TouchableOpacity
                         onPress={()=> setPlusBtn(true)}
                        >
                        <Image source={minsIcon} resizeMode='contain' style={{}} />
                        </TouchableOpacity>
                        <View style={{backgroundColor:'#ffffff',width:20,height:15,borderRadius:2,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:8,fontFamily:'Poppins-Regular',color:'#4A4B4D'}}>1</Text>
                        </View>
                        <TouchableOpacity>
                        <Image source={plusLightIcon} resizeMode='contain' style={{}} />
                        </TouchableOpacity>
                    </View>
                   )} 
                </View>
              </View>

             </View>
              
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.prodView}>
                <SafeAreaView>
                    <View style={styles.headerView}>
                        <TouchableOpacity 
                        onPress={()=> navigation.goBack()}
                         >
                            <Image source={backIcon} resizeMode='contain' style={{ tintColor: '#ffffff', height: 20, width: 20 }} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={heartIcon} resizeMode='contain' style={{ tintColor: '#ffffff', height: 20, width: 20 }} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                <View style={styles.prodContainer}>
                    <View style={styles.innerView}>
                        <Image source={pizzaSquare} resizeMode='contain' style={{}} />
                        <View style={styles.textContainer}>
                            <Text style={{ fontSize: 21, fontFamily: 'Poppins-SemiBold', color: '#ffffff' }}>Balti Brasserie</Text>
                            <View style={{ width: '80%' }}>
                                <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: '#ffffff' }}>92 -94 Liverpool Road, Eccles, Manchester, M17 1 AB</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={starRating} resizeMode='contain' style={{ tintColor: '#ffffff' }} />
                                    <Image source={starRating} resizeMode='contain' style={{ tintColor: '#ffffff' }} />
                                    <Image source={starRating} resizeMode='contain' style={{ tintColor: '#ffffff' }} />
                                    <Image source={starRating} resizeMode='contain' style={{ tintColor: '#ffffff' }} />
                                    <Image source={starunFill} resizeMode='contain' style={{}} />
                                </View>
                                <Text style={{ fontSize: 9, fontFamily: 'Poppins-Medium', color: "#B6B7B7", left: 5, color: '#ffffff' }}>(254) Ratings</Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: "65%", justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={bikeIcon} resizeMode='contain' style={{ tintColor: '#ffffff' }} />
                                    <Text style={{ fontSize: 10, fontFamily: 'Poppins-Regular', left: 5, color: '#ffffff' }}>40 - 60 mins</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={bagIcon} resizeMode='contain' style={{ tintColor: '#ffffff' }} />
                                    <Text style={{ fontSize: 10, fontFamily: 'Poppins-Regular', left: 5, color: '#ffffff' }}>20 - 30 mins</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.dicountView}>
                    <Text style={{ fontSize: 9, fontFamily: 'Poppins-Regular', color: "#CB1F2C" }}>20% OFF ON ALL ORDERS OVER £20</Text>
                </View>
            </View>
              <View style={styles.toggelView}>
                  <TouchableOpacity 
                  onPress={()=> onTogglePress('delivery')}
                  style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:35,width:100,backgroundColor:statusDelivery === true?'#CB1F2C':'#ffffff',borderRadius:60}}>
                  <Image source={bikeIcon} resizeMode='contain' style={{tintColor:statusDelivery === true?'#ffffff':'#B6B7B7'}} />
                     <Text style={{left:3,fontSize:9,fontFamily:'Poppins-Medium',color:statusDelivery === true?'#ffffff':'#B6B7B7'}}>Delivery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                  onPress={()=> onTogglePress('collection')}
                  style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:35,width:100,backgroundColor:statusCollection === true?'#CB1F2C':'#ffffff',borderRadius:60}}>
                  <Image source={bagIcon} resizeMode='contain' style={{tintColor:statusCollection=== true?'#ffffff':'#B6B7B7'}} />
                   <Text style={{left:3,fontSize:9,fontFamily:'Poppins-Medium',color:statusCollection === true?'#ffffff':'#B6B7B7'}}>Collection</Text>
                  </TouchableOpacity>
              </View>
              <View style={{marginTop:30,}}>
                <FlatList
                    style={{marginTop:15,}}
                    //pagingEnabled={true}
                    showsVerticalScrollIndicator={false}
                    //legacyImplementation={false}
                    data={DemoData}
                    renderItem={()=>{
                        return(
                            <View style={{}}>
                                 <Text style={{fontSize:12,fontFamily:'Poppins-Bold',color:'#CB1F2C',paddingHorizontal:30}}>BEST SELLING</Text>
                                 <FlatList
                                  style={{marginTop:15,}} 
                                 showsVerticalScrollIndicator={false}
                                 data={DemoData1}
                                 renderItem={renderMenuList}
                                 keyExtractor={(index) => index.toString()}
                                 ItemSeparatorComponent={() => <View style={{ margin: 8 }}></View>}
                                  />
                            </View>
                        )
                    }}
                    keyExtractor={(index) => index.toString()}
                    ItemSeparatorComponent={() => <View style={{ margin: 8 }}></View>}
                />
               <View style={styles.cartModale}>
                <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center',paddingHorizontal:25}}>
                <View>
                     <Text style={{fontSize:8,fontFamily:'Poppins-SemiBold',color:'#ffffff'}}>Total Price In Cart</Text>
                     <Text style={{fontSize:12,fontFamily:'Poppins-Bold',color:'#ffffff',marginTop:5}}>£ 5.50</Text>
                 </View>
                <TouchableOpacity 
                onPress={()=> navigation.navigate('CART')}
                style={styles.cartBtn}>
                    <Text style={styles.cartBtnTxt}>View Cart</Text>
                </TouchableOpacity>
               </View>
                </View>
            </View>
           
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#ffffff'
    },
    prodView: {
        height: 230,
        width: '100%',
        borderBottomLeftRadius: 65,
        borderBottomRightRadius: 65,
        backgroundColor: '#CB1F2C',
    },
    headerView: {
        marginTop: Platform.OS === 'android'? 25:10,
        height: 40,
        width: '100%',
        paddingHorizontal: 30,
        justifyContent: "space-between",
        flexDirection: 'row',
    },
    prodContainer: {
        height: 110,
        marginTop:Platform.OS === 'android'?10:null,
        //borderWidth:1,
        paddingHorizontal: 30,
    },
    innerView: {
        flexDirection: 'row'
    },
    textContainer: {
        left: 15,
    },
    dicountView: {
        height: 30,
        width: '50%',
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        position: 'relative',
        backgroundColor: '#ffffff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop:Platform.OS==='android'?25:5,
    },
    toggelView:{
        marginTop:40,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    itemListView:{
        height:70,
        width:'100%',
        //borderWidth:0.6,
    },
    incrementView:{
        flexDirection:'row',
        backgroundColor:'#F9E6E7',
        width:60,
        paddingHorizontal:5,
        height:20,
        borderRadius:2,
        justifyContent:'space-between',
        alignItems:'center'
    },
    cartModale:{
        backgroundColor:'#CB1F2C',
        height:80,
        width:'95%',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        position:'absolute',
        top:Platform.OS ==='android'?"40%":'44%',
        borderRadius:8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cartBtn:{
        height:30,
        width:100,
        backgroundColor:'#ffffff',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cartBtnTxt:{
        fontSize:8,
        fontFamily:'Poppins-SemiBold',
        color:'#CB1F2C'

    },
});
export default SingleResturent;


