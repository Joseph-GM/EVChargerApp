import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MapView from './MapView'
import axios from 'axios';
import {SK_API_KEY} from '../shared/Appkey';


export default function SearchRoute({route}) {
    const currentPosition = route.params.cPosition //cPosition is Array
    const destination = [route.params.dLatitude, route.params.dLongitude]
    //const SK_API_KEY = 'SK_API_KEY'
    const SK_API_KEY = "SK_API_KEY";
    const URLRoute = "https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result";
    const URLPoi = "https://apis.openapi.sk.com/tmap/pois";

    const [csData, setCSData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [routeData, setRouteData] = useState([]);
    const [csData, setCSData] = useState([]);


    const getRoute = () => {
        var csTempData = [];  
        axios.get(URLRoute, {
           params: {
            appKey : SK_API_KEY,
            startX : currentPosition[1].toString(),
            startY : currentPosition[0].toString(),
            endX : destination[1].toString(),
            endY : destination[0].toString(),
           }, 
         })
        .then(response => {
          var polyline = [];
          var csGetPoint = [];
          csGetPoint.push(currentPosition);
          var count = 1.0;
          var totalDist = 0.0;
          var allArr = response.data.features;
          var length = allArr.length;
          
          for (var i = 0; i < length ; i++) {
            if (allArr[i].geometry.type == "LineString") {
              var cordi = allArr[i].geometry.coordinates;
              polyline.push(...cordi);
              var totalDist = totalDist + Number(allArr[i].properties.distance)
              if (totalDist > count*1000.0) {
                pointLength = cordi.length-1;
                csGetPoint.push(cordi[pointLength])
                count = count+1;
              }
            }
          };
    
          setRouteData(polyline);
          csGetPoint.push(destination);
          getCSData(csGetPoint);
        })
        .catch(errors => {console.log(errors)}) 
    }
    
    getCSData = async(csGetPoint) => {
      response = [];
      console.log("In getCSDATA", csGetPoint);
      for (var i = 0; i < csGetPoint.length; i++) {
        await axios.get(URLPoi, {
          params: {
            version: 1,
            count: 2,
            searchKeyword: "EV충전소",
            centerLat: csGetPoint[i][1].toString(),
            centerLon: csGetPoint[i][0].toString(),
            appKey: SK_API_KEY,
          }
        })
        .then(
          resp => {
            response.push(...resp.data.searchPoiInfo.pois.poi)
          }
          )
      };
      setCSData(response);
    
    }
    
    
    useEffect( () => {
        getRoute();
    },[]);

    return (
        <View style={styles.container}>
                {isLoading? <Text>Data is Loading </Text> : 
                <>
                <View style={styles.wrapper}>
                    <MapView 
                    getZoom = {10}
                    getCLat = {currentPosition[0]}
                    getCLon = {currentPosition[1]}
                    getDLat = {parseFloat(destination[0])}
                    getDLon = {parseFloat(destination[1])}
                    markers = {csData}
                    pathdata = {routeData}
                />
                </View>
                <View>
                    <Text>Route Created!</Text>
                </View>
                </>
            }
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
//      alignItems: "center",
      justifyContent: "center"
    },
    wrapper: {
      flex: 5, alignItems: "stretch",
    },
})
