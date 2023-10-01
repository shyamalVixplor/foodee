import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Platform} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import checkIcon from '../../../assets/images/check.png';

const FilterScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerView}>
                <View style={styles.navItem}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={backIcon} resizeMode={'contain'} style={{}} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', color: '#4A4B4D' }}>Filters</Text>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', color: '#CB1F2C' }}>Clear</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginTop: 20, paddingHorizontal: 25 }}>
                <Text style={{ fontSize: 21, fontFamily: 'Poppins-Bold', color: '#4A4B4D' }}>Filter By Cusines</Text>
            </View>
            <View style={styles.filterView}>
               <View style={{}}>
                  <View style={{flexDirection:'row',}}>
                  <View style={styles.checkBox}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D',left:10}}>African</Text>
                  </View>

                  <View style={{flexDirection:'row',marginTop:15,}}>
                  <View style={styles.checkBox}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D',left:10}}>American</Text>
                  </View>

                  <View style={{flexDirection:'row',marginTop:15}}>
                  <View style={[styles.checkBox,{justifyContent:"center",alignItems:'center',backgroundColor:"#CB1F2C"}]}>
                      <Image source={checkIcon} resizeMode="contain" style={{height:12,width:12,alignSelf:'center',tintColor:'#FFFFFF'}} />
                  </View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D',left:10}}>BBQ</Text>
                  </View>

                  <View style={{flexDirection:'row',marginTop:15,}}>
                  <View style={[styles.checkBox,{justifyContent:"center",alignItems:'center',backgroundColor:"#CB1F2C"}]}>
                  <Image source={checkIcon} resizeMode="contain" style={{height:12,width:12,alignSelf:'center',tintColor:'#FFFFFF'}} />
                  </View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D',left:10}}>Breakfast</Text>
                  </View>

                  <View style={{flexDirection:'row',marginTop:15}}>
                  <View style={[styles.checkBox,{justifyContent:"center",alignItems:'center',backgroundColor:"#CB1F2C"}]}>
                  <Image source={checkIcon} resizeMode="contain" style={{height:12,width:12,alignSelf:'center',tintColor:'#FFFFFF'}} />
                  </View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D',left:10}}>Briyani</Text>
                  </View>

                  <View style={{flexDirection:'row',marginTop:15,}}>
                  <View style={styles.checkBox}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D',left:10}}>Burgers</Text>
                  </View>

                  <View style={{flexDirection:'row',marginTop:15}}>
                  <View style={styles.checkBox}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D',left:10}}>Burrito</Text>
                  </View>

                  <View style={{flexDirection:'row',marginTop:15,}}>
                  <View style={styles.checkBox}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D',left:10}}>Chiken</Text>
                  </View>

                  <View style={{flexDirection:'row',marginTop:15}}>
                  <View style={styles.checkBox}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D',left:10}}>Chinese</Text>
                  </View>

                  <View style={{flexDirection:'row',marginTop:15,}}>
                  <View style={styles.checkBox}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D',left:10}}>Coffee</Text>
                  </View>

               </View>
               <View style={{}}>
                  <View style={{flexDirection:'row',marginTop:15}}>
                  <View style={[styles.checkBox,{right:10}]}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D'}}>Curry</Text>
                  </View>
                   <View style={{flexDirection:'row',marginTop:15}}>
                   <View style={[styles.checkBox,{right:10}]}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D'}}>Dessert</Text>
                   </View>

                   <View style={{flexDirection:'row',marginTop:15}}>
                  <View style={[styles.checkBox,{right:10}]}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D'}}>Drinks</Text>
                  </View>

                   <View style={{flexDirection:'row',marginTop:15}}>
                   <View style={[styles.checkBox,{right:10}]}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D'}}>English Breakfast</Text>
                   </View>

                   <View style={{flexDirection:'row',marginTop:15}}>
                  <View style={[styles.checkBox,{right:10}]}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D'}}>Fish</Text>
                  </View>

                   <View style={{flexDirection:'row',marginTop:15}}>
                   <View style={[styles.checkBox,{right:10}]}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D'}}>Hot Dog</Text>
                   </View>

                   <View style={{flexDirection:'row',marginTop:15}}>
                  <View style={[styles.checkBox,{right:10}]}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D'}}>Indian</Text>
                  </View>

                   <View style={{flexDirection:'row',marginTop:15}}>
                   <View style={[styles.checkBox,{right:10}]}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D'}}>Noodels</Text>
                   </View>

                   <View style={{flexDirection:'row',marginTop:15}}>
                  <View style={[styles.checkBox,{right:10}]}></View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D'}}>Pasta</Text>
                  </View>

                   <View style={{flexDirection:'row',marginTop:15}}>
                   <View style={[styles.checkBox,{right:10}]}>
                   </View>
                   <Text style={{fontSize:12,fontFamily:'Poppins-Medium',color:'#4A4B4D'}}>Peri peri</Text>
                   </View>

               </View>
            </View>

            <TouchableOpacity style={styles.filterBtn}>
                <Text style={styles.filterBtnTxt}>Apply Filter</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    headerView: {
        height: 40,
        width: '100%',
        paddingHorizontal: 25,
        marginTop: Platform.OS === 'android' ? 15 : 10,
    },
    navItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%"
    },
    filterView:{
        marginTop:20,
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:25,
    },
    checkBox:{
        height:20,
        width:20,
        borderWidth:1,
        borderColor:'#d9d9d9',
        borderRadius:4,
    },
    filterBtn:{
        marginTop:30,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        height:50,
        width:'85%',
        backgroundColor:'#CB1F2C',
        borderRadius:30,
    },
    filterBtnTxt:{
        fontSize:17,
        fontFamily:'Poppins-Regular',
        color:'#FFFFFF'
    }
});
export default FilterScreen


