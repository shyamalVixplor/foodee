//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GlobalColor from '../../constant/constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
// create a component
const Star = props => {
  const {rating} = props;
  const {color} = props;
  const FloatRate = parseFloat(rating).toFixed(1);
  if (FloatRate == 1) {
    return (
      <View style={styles.starView}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
        </View>
        <Text
          style={{
            fontSize: 9,
            fontFamily: 'Poppins-Medium',
            left: 5,
            color: color == null || undefined ? '#ffffff' : color,
          }}>
          ({FloatRate}) Ratings
        </Text>
      </View>
    );
  } else if (FloatRate > 1 && FloatRate < 2) {
    return (
      <View style={styles.starView}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-half"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
        </View>
        <Text
          style={{
            fontSize: 9,
            fontFamily: 'Poppins-Medium',
            left: 5,
            color: color == null || undefined ? '#ffffff' : color,
          }}>
          ({FloatRate}) Ratings
        </Text>
      </View>
    );
  } else if (FloatRate == 2) {
    return (
      <View style={styles.starView}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
        </View>
        <Text
          style={{
            fontSize: 9,
            fontFamily: 'Poppins-Medium',
            left: 5,
            color: color == null || undefined ? '#ffffff' : color,
          }}>
          ({FloatRate}) Ratings
        </Text>
      </View>
    );
  } else if (FloatRate > 2 && FloatRate < 3) {
    return (
      <View style={styles.starView}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-half"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
        </View>
        <Text
          style={{
            fontSize: 9,
            fontFamily: 'Poppins-Medium',
            left: 5,
            color: color == null || undefined ? '#ffffff' : color,
          }}>
          ({FloatRate}) Ratings
        </Text>
      </View>
    );
  } else if (FloatRate == 3) {
    return (
      <View style={styles.starView}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
        </View>
        <Text
          style={{
            fontSize: 9,
            fontFamily: 'Poppins-Medium',
            left: 5,
            color: color == null || undefined ? '#ffffff' : color,
          }}>
          ({FloatRate}) Ratings
        </Text>
      </View>
    );
  } else if (FloatRate > 3 && FloatRate < 4) {
    return (
      <View style={styles.starView}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-half"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
        </View>
        <Text
          style={{
            fontSize: 9,
            fontFamily: 'Poppins-Medium',
            left: 5,
            color: color == null || undefined ? '#ffffff' : color,
          }}>
          ({FloatRate}) Ratings
        </Text>
      </View>
    );
  } else if (FloatRate == 4) {
    return (
      <View style={styles.starView}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-outline"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
        </View>
        <Text
          style={{
            fontSize: 9,
            fontFamily: 'Poppins-Medium',
            left: 5,
            color: color == null || undefined ? '#ffffff' : color,
          }}>
          ({FloatRate}) Ratings
        </Text>
      </View>
    );
  } else if (FloatRate > 4 && FloatRate < 5) {
    return (
      <View style={styles.starView}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star-half"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
        </View>
        <Text
          style={{
            fontSize: 9,
            fontFamily: 'Poppins-Medium',
            left: 5,
            color: color == null || undefined ? '#ffffff' : color,
          }}>
          ({FloatRate}) Ratings
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.starView}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
          <Ionicons
            name="star"
            size={16}
            color={color == null || undefined ? '#fff' : color}
          />
        </View>
        <Text
          style={{
            fontSize: 9,
            fontFamily: 'Poppins-Medium',
            left: 5,
            color: color == null || undefined ? '#ffffff' : color,
          }}>
          ({FloatRate}) Ratings
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  starView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
});

//make this component available to the app
export default Star;
