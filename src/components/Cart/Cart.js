import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import backIcon from '../../../assets/images/BackIcon-arrow.png';
import bikeIcon from '../../../assets/images/bikeImg.png';
import bagIcon from '../../../assets/images/bagimg.png';
import minsIcon from '../../../assets/images/dash-lg.png';
import plusLightIcon from '../../../assets/images/plus.png';
import cancelIcon from '../../../assets/images/crossIcon.png';
import {Platform} from 'react-native';

const Cart = ({navigation}) => {
  const [statusDelivery, setStatusDelivery] = useState(true);
  const [statusCollection, setStatusCollection] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const onTogglePress = value => {
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
  };

  const displayModal = show => setIsVisible(show);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={backIcon} resizeMode={'contain'} style={{}} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Poppins-Medium',
              color: '#4A4B4D',
            }}>
            Cart
          </Text>
        </View>
      </View>
      <View style={styles.toggelView}>
        <TouchableOpacity
          onPress={() => onTogglePress('delivery')}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 35,
            width: 100,
            backgroundColor: statusDelivery === true ? '#CB1F2C' : '#ffffff',
            borderRadius: 60,
          }}>
          <Image
            source={bikeIcon}
            resizeMode="contain"
            style={{tintColor: statusDelivery === true ? '#ffffff' : '#B6B7B7'}}
          />
          <Text
            style={{
              left: 3,
              fontSize: 9,
              fontFamily: 'Poppins-Medium',
              color: statusDelivery === true ? '#ffffff' : '#B6B7B7',
            }}>
            Delivery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTogglePress('collection')}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 35,
            width: 100,
            backgroundColor: statusCollection === true ? '#CB1F2C' : '#ffffff',
            borderRadius: 60,
          }}>
          <Image
            source={bagIcon}
            resizeMode="contain"
            style={{
              tintColor: statusCollection === true ? '#ffffff' : '#B6B7B7',
            }}
          />
          <Text
            style={{
              left: 3,
              fontSize: 9,
              fontFamily: 'Poppins-Medium',
              color: statusCollection === true ? '#ffffff' : '#B6B7B7',
            }}>
            Collection
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 30}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 50,
          }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Poppins-Medium',
              color: '#4A4B4D',
            }}>
            1x Peri Peri Wrap
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={[styles.incrementView, {right: 30}]}>
              <TouchableOpacity
              //onPress={()=> setPlusBtn(true)}
              >
                <Image source={minsIcon} resizeMode="contain" style={{}} />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  width: 20,
                  height: 15,
                  borderRadius: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: 'Poppins-Regular',
                    color: '#4A4B4D',
                  }}>
                  1
                </Text>
              </View>
              <TouchableOpacity>
                <Image source={plusLightIcon} resizeMode="contain" style={{}} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Bold',
                color: '#4A4B4D',
              }}>
              £16
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 50,
            marginTop: 25,
          }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Poppins-Medium',
              color: '#4A4B4D',
            }}>
            1x Smokey Grill Burger
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={[styles.incrementView, {right: 30}]}>
              <TouchableOpacity
              //onPress={()=> setPlusBtn(true)}
              >
                <Image source={minsIcon} resizeMode="contain" style={{}} />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  width: 20,
                  height: 15,
                  borderRadius: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: 'Poppins-Regular',
                    color: '#4A4B4D',
                  }}>
                  1
                </Text>
              </View>
              <TouchableOpacity>
                <Image source={plusLightIcon} resizeMode="contain" style={{}} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Bold',
                color: '#4A4B4D',
              }}>
              £14
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 50,
            marginTop: 25,
          }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Poppins-Medium',
              color: '#4A4B4D',
            }}>
            1x Poppadums
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={[styles.incrementView, {right: 30}]}>
              <TouchableOpacity
              //onPress={()=> setPlusBtn(true)}
              >
                <Image source={minsIcon} resizeMode="contain" style={{}} />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  width: 20,
                  height: 15,
                  borderRadius: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: 'Poppins-Regular',
                    color: '#4A4B4D',
                  }}>
                  1
                </Text>
              </View>
              <TouchableOpacity>
                <Image source={plusLightIcon} resizeMode="contain" style={{}} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Bold',
                color: '#4A4B4D',
              }}>
              £17
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 50,
            marginTop: 25,
          }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Poppins-Medium',
              color: '#4A4B4D',
            }}>
            1x Peri Peri Wrap
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={[styles.incrementView, {right: 30}]}>
              <TouchableOpacity
              //onPress={()=> setPlusBtn(true)}
              >
                <Image source={minsIcon} resizeMode="contain" style={{}} />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  width: 20,
                  height: 15,
                  borderRadius: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: 'Poppins-Regular',
                    color: '#4A4B4D',
                  }}>
                  1
                </Text>
              </View>
              <TouchableOpacity>
                <Image source={plusLightIcon} resizeMode="contain" style={{}} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Bold',
                color: '#4A4B4D',
              }}>
              £15
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 50,
            marginTop: 25,
          }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Poppins-Medium',
              color: '#4A4B4D',
            }}>
            1x Smokey Grill Burger
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={[styles.incrementView, {right: 30}]}>
              <TouchableOpacity
              //onPress={()=> setPlusBtn(true)}
              >
                <Image source={minsIcon} resizeMode="contain" style={{}} />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  width: 20,
                  height: 15,
                  borderRadius: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: 'Poppins-Regular',
                    color: '#4A4B4D',
                  }}>
                  1
                </Text>
              </View>
              <TouchableOpacity>
                <Image source={plusLightIcon} resizeMode="contain" style={{}} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Bold',
                color: '#4A4B4D',
              }}>
              £6
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.discountView}>
        <TextInput
          placeholder="Discount Code"
          editable={false}
          style={styles.inputStyle}
        />
        <TouchableOpacity style={styles.applyBtn}>
          <Text style={styles.applyBtnTxt}>Apply</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 25}}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingHorizontal: 30,
          }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Poppins-Bold',
              color: '#4A4B4D',
            }}>
            Delivery Instrusctions
          </Text>
          <TouchableOpacity
            onPress={() => displayModal(true)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={plusLightIcon}
              resizeMode="contain"
              style={{right: 10}}
            />
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Poppins-Medium',
                color: '#CB1F2C',
              }}>
              Add Notes
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingHorizontal: 30,
            marginTop: 20,
          }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Poppins-Bold',
              color: '#4A4B4D',
            }}>
            Sub Total
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Poppins-Bold',
              color: '#CB1F2C',
            }}>
            £68
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingHorizontal: 30,
            marginTop: 20,
          }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Poppins-SemiBold',
              color: '#4A4B4D',
            }}>
            Total
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontFamily: 'Poppins-Bold',
              color: '#CB1F2C',
            }}>
            £68
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailsCart')}
        style={styles.checkOutBtn}>
        <Text style={styles.checkOutBtnTxt}>Checkout</Text>
      </TouchableOpacity>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          alert('Modal has now been closed.');
        }}>
        <View
          style={{height: '100%', width: '100%', backgroundColor: '#00000080'}}>
          <View
            style={{
              width: '100%',
              bottom: 0,
              position: 'absolute',
              height: '54%',
              borderTopRightRadius: 30,
              backgroundColor: 'white',
              paddingHorizontal: 10,
              borderTopLeftRadius: 30,
            }}>
            <TouchableOpacity
              onPress={() => {
                displayModal(!isVisible);
              }}
              style={{alignSelf: 'flex-end', margin: 10}}>
              <Image
                source={cancelIcon}
                resizeMode="contain"
                style={styles.cancelImg}
              />
            </TouchableOpacity>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: '100%',
              }}>
              <TextInput
                placeholder="Any food allergy ?"
                placeholderTextColor="#B6B7B7"
                multiline={true}
                style={[styles.inputStyleModal, {marginTop: 15}]}
              />
              <TextInput
                placeholder="Instructions for order"
                placeholderTextColor="#B6B7B7"
                multiline={true}
                style={[styles.inputStyleModal, {marginTop: 30}]}
              />
              <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addBtnTxt}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    width: '55%',
  },
  toggelView: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  incrementView: {
    flexDirection: 'row',
    backgroundColor: '#F9E6E7',
    width: 60,
    paddingHorizontal: 5,
    height: 20,
    borderRadius: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountView: {
    marginTop: 25,
    height: 50,
    width: '80%',
    //borderWidth:1,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 30,
  },
  inputStyle: {
    height: 45,
    width: '65%',
    paddingLeft: 15,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  applyBtn: {
    height: 35,
    width: 90,
    backgroundColor: '#CB1F2C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  applyBtnTxt: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  checkOutBtn: {
    marginTop: 20,
    height: 55,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#CB1F2C',
    borderRadius: 30,
  },
  checkOutBtnTxt: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  cancelImg: {
    alignSelf: 'center',
    // height:30,
    // width:30,
    // tintColor:"#494949"
  },
  inputStyleModal: {
    height: 90,
    width: '80%',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 15,
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#B6B7B7',
  },
  addBtn: {
    marginTop: 20,
    height: 45,
    width: '80%',
    backgroundColor: '#CB1F2C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  addBtnTxt: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
});
export default Cart;
