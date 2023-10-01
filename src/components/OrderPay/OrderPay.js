import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Platform, Switch } from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import clockImg from '../../../assets/images/clockIcon.png';

const OrderPay = ({ navigation }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [cashStatus, setCashStatus] = useState(false);
    const [cardStatus, setCardStatus] = useState(false);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const onPressRadioBtn = (value) => {
        switch (value) {
            case 'cash':
                setCashStatus(true);
                setCardStatus(false);
                break;
            case 'card':
                setCardStatus(true);
                setCashStatus(false);
                navigation.navigate("Payment");
                break;

            default:
                value;
                break;
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerView}>
                <View style={styles.navItem}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={backIcon} resizeMode={'contain'} style={{}} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', color: '#4A4B4D' }}>Pay and Complete Your Order</Text>
                </View>
            </View>
            <View style={{ marginTop: 10, paddingHorizontal: 25 }}>
                <Text style={{ fontSize: 13, fontFamily: 'Poppins-Regular', color: '#7C7D7E' }}>Delivery Address</Text>
                <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: '70%' }}>
                        <Text style={{ fontSize: 13, fontFamily: 'Poppins-Medium', color: '#4A4B4D' }}>92 -94 Liverpool Road, Eccles,
                            Manchester, M17 1 AB</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 13, fontFamily: 'Poppins-Medium', color: '#CB1F2C' }}>Change</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 }}>
                <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#363636' }}>Collection Time</Text>
                <Text style={{ fontSize: 13, fontFamily: 'Poppins-Medium', color: '#CB1F2C' }}>View all</Text>
            </View>
            <View style={styles.collectionView}>
                <View style={styles.collectionItem}>
                    <Image source={clockImg} resizeMode='contain' style={{ right: 5 }} />
                    <Text style={{ fontSize: 11, fontFamily: 'Poppins-Regular', color: '#363636' }}>08:30 AM</Text>
                </View>
                <View style={styles.collectionItem2}>
                    <Image source={clockImg} resizeMode='contain' style={{ right: 5, tintColor: '#ffffff' }} />
                    <Text style={{ fontSize: 11, fontFamily: 'Poppins-Regular', color: '#ffffff' }}>09:00 AM</Text>
                </View>
                <View style={styles.collectionItem}>
                    <Image source={clockImg} resizeMode='contain' style={{ right: 5 }} />
                    <Text style={{ fontSize: 11, fontFamily: 'Poppins-Regular', color: '#363636' }}>09:30 AM</Text>
                </View>
            </View>
            <View style={styles.collectionView2}>
                <View style={styles.collectionItem}>
                    <Image source={clockImg} resizeMode='contain' style={{ right: 5 }} />
                    <Text style={{ fontSize: 11, fontFamily: 'Poppins-Regular', color: '#363636' }}>10:00 AM</Text>
                </View>
                <View style={styles.collectionItem}>
                    <Image source={clockImg} resizeMode='contain' style={{ right: 5, }} />
                    <Text style={{ fontSize: 11, fontFamily: 'Poppins-Regular', color: '#363636' }}>10:30 AM</Text>
                </View>
                <View style={styles.collectionItem}>
                    <Image source={clockImg} resizeMode='contain' style={{ right: 5 }} />
                    <Text style={{ fontSize: 11, fontFamily: 'Poppins-Regular', color: '#363636' }}>11:00 AM</Text>
                </View>
            </View>
            <View style={{ marginTop: 20, paddingHorizontal: 25 }}>
                <View style={styles.switchItem}>
                    <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4A4B4D' }}>Get SMS updates on order status</Text>
                    <Switch
                        trackColor={{ false: "#CED1D9", true: "#CB1F2C" }}
                        thumbColor={isEnabled ? "#FFFFFF" : "#FFFFFF"}
                        ios_backgroundColor="#CED1D9"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                <View style={[styles.switchItem, { marginTop: 10 }]}>
                    <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4A4B4D' }}>Want offers from foodee</Text>
                    <Switch
                    //  onValueChange={toggleSwitch}
                    // value={isEnabled}
                    />
                </View>
                <View style={[styles.switchItem, { marginTop: 10 }]}>
                    <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4A4B4D' }}>Want offers from Volta do Mar</Text>
                    <Switch
                    //  onValueChange={toggleSwitch}
                    //   value={isEnabled}
                    />
                </View>
            </View>
            <Text style={{ color: '#7C7D7E', fontSize: 13, fontFamily: 'Poppins-Regular', marginTop: 25, paddingHorizontal: 25 }}>Payment method</Text>
            <View style={{ marginTop: 25, paddingHorizontal: 25, }}>
                <View style={styles.payTabStyle}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '85%' }}>
                        <Text style={{ color: '#2D2D2D', fontSize: 12, fontFamily: 'Poppins-Medium', }}>Pay in Cash</Text>
                        <TouchableOpacity
                            onPress={() => onPressRadioBtn('cash')}
                            style={[styles.radioBtn, { backgroundColor:cashStatus === true? '#CB1F2C':'#FFFFFF' }]}></TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.payTabStyle, { marginTop: 15 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '85%' }}>
                        <Text style={{ color: '#2D2D2D', fontSize: 12, fontFamily: 'Poppins-Medium', }}>Pay with card</Text>
                        <TouchableOpacity
                            onPress={() => onPressRadioBtn('card')}
                            style={[styles.radioBtn,{ backgroundColor:cardStatus === true? '#CB1F2C':'#FFFFFF' }]}></TouchableOpacity>
                    </View>
                </View>
            </View>
           {cashStatus === true? 
            <TouchableOpacity
                onPress={() => navigation.navigate('OrderSuccess')}
                style={styles.saveBtn}>
                <Text style={styles.saveBtnTxt}>Save & Proceed</Text>
            </TouchableOpacity>
            :
            null
           }
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
        marginTop: Platform.OS === 'android' ? 15 : 10,
    },
    navItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "80%"
    },
    collectionView: {
        marginTop: 15,
        flexDirection: 'row',
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        width: '100%'
    },
    collectionView2: {
        marginTop: 20,
        flexDirection: 'row',
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        width: '100%'
    },
    collectionItem: {
        flexDirection: 'row',
        height: 35,
        width: 95,
        //borderWidth:1,
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor:'#FFFFFF',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.36,
        shadowRadius: 5,
        elevation: 9,
    },
    collectionItem2: {
        flexDirection: 'row',
        height: 35,
        width: 95,
        //borderWidth:1,
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: '#CB1F2C',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.36,
        shadowRadius: 5,
        elevation: 9,
    },
    switchItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    payTabStyle: {
        height: 45,
        width: '100%',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: '#F6F6F6',
        borderColor: '#d9d9d9'
    },
    radioBtn: {
        height: 18,
        width: 18,
        borderWidth: 1,
        borderColor: '#CB1F2C',
        borderRadius: 10,
    },
    saveBtn: {
        marginTop: 20,
        ///paddingHorizontal:25,
        backgroundColor: '#CB1F2C',
        height: 50,
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 25,
    },
    saveBtnTxt: {
        fontSize: 17,
        fontFamily: 'Poppins-Regular',
        color: '#FFFFFF',
    }

})
export default OrderPay


