import React from 'react'
import { View, Text, requireNativeComponent, StyleSheet} from 'react-native'

//const TMapShow = requireNativeComponent("TMapShow")

export default function MapView() {

    return (
        <View>
            {/* <TMapShow
                style={ styles.wrapper }
                zoom = {10}
                clatitude = {cPosition[0]}
                clongitude = {cPosition[1]}
                markerdata = {csData}
            /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
      flex: 1, 
      alignItems: "center", 
      justifyContent: "center"
    }
})
