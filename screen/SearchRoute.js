import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MapView from './MapView'
import axios from 'axios';
import {SK_API_KEY} from '../shared/Appkey';
import { parse } from '@babel/core';
import qs from 'qs';

export default function SearchRoute({route}) {
    const currentPosition = route.params.cPosition //cPosition is Array
    const destination = [route.params.dLatitude, route.params.dLongitude]
    const destLatitude = parseFloat(destination[0]);
    const destLongitude = parseFloat(destination[1]);
    const URLRoute = "https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result";
    const URLPoi = "https://apis.openapi.sk.com/tmap/pois";
    const URLPoiRoute = "https://apis.openapi.sk.com/tmap/poi/findPoiRoute?version=1";

    const [csData, setCSData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [routeData, setRouteData] = useState([]);
    const [totalDistanceKm, setTotalDistanceKm] = useState("");
    const [totalTime, setTotalTime] = useState("");
    const [fare, setFare] = useState("");


    const getRoute = async() => {
        
        let data = {
          startX: currentPosition[1],
          startY: currentPosition[0],
          endX: destination[1],
          endY: destination[0],
          searchOption: 0,
        }

        await axios({
          method: 'POST',
          url: URLRoute, 
          params: {
            appKey : SK_API_KEY,
           },
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
          },
          data: qs.stringify(data), 
         })
        .then(response => {
          var polyline = [];
          var linescript = "";
          var csGetPoint = [];
//          csGetPoint.push([currentPosition[1],currentPosition[0]]);
          var count = 1.0;
          var totalDist = 0.0;
          const allArr = response.data.features;
          var length = allArr.length;
          
          const distanceNumber = parseFloat(response.data.features[0].properties.totalDistance)*0.001;
          setTotalDistanceKm(distanceNumber.toFixed(1).toString());
          const timeNumber = parseFloat(response.data.features[0].properties.totalTime)
          const minute = timeNumber/60.0;
          setTotalTime(minute.toFixed(0).toString());
          setFare(response.data.features[0].properties.totalFare)

          for (var i = 0; i < length ; i++) {
            if (allArr[i].geometry.type == "LineString") {
              var cordi = allArr[i].geometry.coordinates;
              polyline.push(...cordi);
              totalDist = totalDist + Number(allArr[i].properties.distance)
                if (totalDist > count*distanceNumber*1000/2.0) {
                  pointLength = cordi.length-1;
                  csGetPoint.push(cordi[pointLength])
                count = count+1;
                }
            }
          };
          setRouteData(polyline);

          linescript = polyline[0][0] + "," + polyline[0][1];

          for (var i = 1; i < polyline.length ; i++) {
            var xdata = polyline[i][0];
            var ydata = polyline[i][1];
            linescript = linescript + "_" + xdata + "," + ydata ;
          }

          console.log("csGetPoint*************************", csGetPoint);

          getCSData(linescript, csGetPoint);
          
        })
        .catch(errors => {console.log(errors)})
    }

    const getCSData = async(linescript, csGetPoint) => {
      console.log("linescript *************** ", linescript)
      response = [];
      const userpoint = csGetPoint[0];
      console.log("****************userX********** = ", userpoint[0]);
      console.log("****************userY********** = ", userpoint[1]);
      let data = {
        count: "60",
        startX: currentPosition[1],
        startY: currentPosition[0],
        endX: destination[1],
        endY: destination[0],
        userX: userpoint[0],
        userY: userpoint[1],
        lineString: linescript,
//        searchKeyword: "EV충전소",
        searchType: "category",
        searchCategory: "C03",
//        radius : ,
        sort: "score",
      }
      await axios({
        method: 'post',
        url: URLPoiRoute,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        },
        params: {
          appKey: SK_API_KEY,
        },
        data: qs.stringify(data),
      })
        .then(
          resp => {
            response.push(...resp.data.searchPoiInfo.pois.poi);
            console.log("Number of finded EVCharger", response.length)   
          })
        .catch(error => console.log('error in POI', error))
      
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
