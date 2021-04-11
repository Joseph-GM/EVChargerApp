import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MapView from './MapView'
import axios from 'axios';
import {SK_API_KEY} from '../shared/Appkey';
import { parse } from '@babel/core';


export default function SearchRoute({route}) {
    const currentPosition = route.params.cPosition //cPosition is Array
    const destination = [route.params.dLatitude, route.params.dLongitude]
    const destLatitude = parseFloat(destination[0]);
    const destLongitude = parseFloat(destination[1]);
    const URLRoute = "https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result";
    const URLPoi = "https://apis.openapi.sk.com/tmap/pois";

    const [csData, setCSData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [routeData, setRouteData] = useState([]);
    const [totalDistanceKm, setTotalDistanceKm] = useState("");
    const [totalTime, setTotalTime] = useState("");
    const [fare, setFare] = useState("");


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
          csGetPoint.push([currentPosition[1],currentPosition[0]]);
          var count = 1.0;
          var totalDist = 0.0;
          var allArr = response.data.features;
          var length = allArr.length;
          
          for (var i = 0; i < length ; i++) {
            if (allArr[i].geometry.type == "LineString") {
              var cordi = allArr[i].geometry.coordinates;
              polyline.push(...cordi);
              var totalDist = totalDist + Number(allArr[i].properties.distance)
              if (totalDist > count*50000.0) {
                pointLength = cordi.length-1;
                csGetPoint.push(cordi[pointLength])
                count = count+1;
              }
            }
          };
    
          setRouteData(polyline);
          console.log("polyline******", polyline)
          csGetPoint.push([destLongitude, destLatitude]); //목적지 좌표를 push(목적지 데이타 string 임)
          console.log("csGetPoint", csGetPoint);
          getCSData(csGetPoint);
          var distanceNumber = parseFloat(response.data.features[0].properties.totalDistance)*0.001;
          setTotalDistanceKm(distanceNumber.toFixed(1).toString());
          var timeNumber = parseFloat(response.data.features[0].properties.totalTime)
          var minute = timeNumber/60.0;
          setTotalTime(minute.toFixed(0).toString());
          setFare(response.data.features[0].properties.totalFare)
        })
        .catch(errors => {console.log(errors)}) 
    }
    
    getCSData = async(csGetPoint) => {
      response = [];
      for (var i = 0; i < csGetPoint.length; i++) {
        await axios.get(URLPoi, {
          params: {
            version: 1,
            count: 10,
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
      setIsLoading(false);
    
    }
    
    
    useEffect( () => {
        getRoute();
    },[]);

    return (
        <View style={styles.container}>
                {isLoading? <Text>Data is Loading </Text> : 
                <>
                <View style={styles.wrapper}>
                  {console.log("CSDATA************", csData)}
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
                <View style={styles.border}>
                  <Text style={styles.button}>
                    총거리 : {totalDistanceKm} km
                  </Text>
                  <Text style={styles.button}>
                    총시간 : {totalTime} 분
                  </Text>
                  <Text style={styles.button}>
                    요금 : {fare} 원
                  </Text>
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
    border: {
      borderColor: "#eee", 
      borderBottomWidth: 1, 
      flex:1,
      alignItems: "center",
      justifyContent: "center", 
    },
})
