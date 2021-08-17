import React, {useState, useEffect} from 'react'
import { View, Text, requireNativeComponent, StyleSheet} from 'react-native'

const TMapShow = requireNativeComponent("TMapShow")

export default function MapView({getZoom, getCLat, getCLon, getDLat, getDLon, markers, pathdata, parentCallback}) {
    
    update = e => {
        console.log("Marker Clicked detected in Mapview");
        if (e.nativeEvent.name) {
            console.log(e.nativeEvent);
            parentCallback(e.nativeEvent);
        }        
    }
    return (
            <TMapShow
                style={styles.mapview}
                zoom = {getZoom}
                clatitude = {getCLat}
                clongitude = {getCLon}
                dlatitude = {getDLat}
                dlongitude = {getDLon}
                markerdata = {markers}
                routesdata = {pathdata}
                onUpdate={this.update}
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
