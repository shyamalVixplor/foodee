import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

const SettingScreen = () => {
    return (
        <SafeAreaView style={styles.container}> 
            <Text>SettingScreen</Text>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ffffff",
        justifyContent:"center",
        alignItems:'center'
    }
})
export default SettingScreen


