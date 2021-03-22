import React from 'react'
import { View, Text, requireNativeComponent, StyleSheet} from 'react-native'

const TMapShow = requireNativeComponent("TMapShow")

export default function MapView({getZoom, getCLat, getCLon, getDLat, getDLon, markers}) {

    return (
            <TMapShow
                style={styles.mapview}
                zoom = {getZoom}
                clatitude = {getCLat}
                clongitude = {getCLon}
                dlatitude = {getDLat}
                dlongitude = {getDLon}
                markerdata = {markers}
            />
    )
}

const styles = StyleSheet.create({
    mapview: { 
        flex: 1,
//      alignItems: "center", 
//      justifyContent: "center"
    }
})
