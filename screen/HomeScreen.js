import React, { useState, useEffect } from 'react'
import { SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    requireNativeComponent,
    Button, } from 'react-native'

import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import MapView from './MapView';

const SK_API_KEY = 'SK_API_Key'
    
const TMapShow = requireNativeComponent("TMapShow")

export default function HomeScreen({navigation}) {
//  const [clat, setClatitude] = useState(37.512992);
//  const [clon, setClongitude] = useState(126.7063177);
  const [cPosition, setCPosition] = useState([37.512992, 126.7063177])
  const [address, setAddress] = useState({});
  const [csData, setCSData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* const firstAddress = axios.get('https://apis.openapi.sk.com/tmap/geo/reversegeocoding', {
    params: {
      version: 1,
      lat: cPosition[0].toString(),
      lon: cPosition[1].toString(),
      appKey: SK_API_KEY,
      format: "json",
      callback: "result",
    } 
  }) */

  const firstAddress = async(templat, templon) => {
    try {
    return axios.get('https://apis.openapi.sk.com/tmap/geo/reversegeocoding', {
    params: {
      version: 1,
      lat: templat.toString(),
      lon: templon.toString(),
      appKey: SK_API_KEY,
      format: "json",
      callback: "result",
    } 
  })
  } catch(error) {
    console.log("error in getting address - firstAddress")
  }
  }

  /* const secondCSData = axios.get('https://apis.openapi.sk.com/tmap/pois', {
    params: {
      version: 1,
      count: 20,
      searchKeyword: "전기차충전소",
      centerLat: cPosition[0].toString(),
      centerLon: cPosition[1].toString(),
      appKey: SK_API_KEY,
    } 
  }) */

  const secondCSData = async(templat, templon) => {
    try{
      return axios.get('https://apis.openapi.sk.com/tmap/pois', {
      params: {
      version: 1,
      count: 20,
      searchKeyword: "전기차충전소",
      centerLat: templat.toString(),
      centerLon: templon.toString(),
      appKey: SK_API_KEY,
    } 
  })
    } catch(error) {
      console.log("error in getting CS datas - secondCSData")
    }
  }
  useEffect( () => {

    Geolocation.getCurrentPosition(
      position => {
        /* setClatitude(position.coords.latitude);
        setClongitude(position.coords.longitude); */
        const templat = position.coords.latitude
        const templon = position.coords.longitude
        setCPosition([templat, templon])
        console.log('cPosition')
        console.log(cPosition[0],cPosition[1])
        console.log('temp')
        console.log(templat, templon)
        axios
        .all([firstAddress(templat,templon), secondCSData(templat,templon)])
        .then(
          axios.spread((...response) => {
            const first = response[0].data;
            const second = response[1].data;
            console.log("ADDRESS*************************")
            console.log(JSON.stringify(first));
            setAddress(first);
            setCSData(second.searchPoiInfo.pois.poi);
            setIsLoading(false);
            console.log("Monitor How many times!!***********")
            console.log(isLoading)

//            console.log("CSInfo*************************")
//            console.log(JSON.stringify(second));
          })
        )
        .catch(erros => {
          console.log("error")
        })
      });
  }, []);

  

      return (
        <View style={styles.container}>
          {isLoading? <Text> Data is Loading </Text> :
          <>
            <TMapShow 
            style={ styles.wrapper }
            zoom = {10}
            clatitude = {cPosition[0]}
            clongitude = {cPosition[1]}
            markerdata = {csData}
          />
          <TouchableOpacity
            style={[styles.border]}
            onPress={this.state}
          >
            <Text style={styles.button}>
              {address.addressInfo.fullAddress}
            </Text>
          </TouchableOpacity>
          <Button 
            title = "Go To List View"
            onPress = {()=> navigation.navigate('List',{markerInfo: csData, currentLoc: cPosition}) }
          />
          </>
          }
        </View>
      );
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1, alignItems: "stretch"
    },
    wrapper: {
      flex: 5, alignItems: "center", justifyContent: "center"
    },
    border: {
      borderColor: "#eee", 
      borderBottomWidth: 1, 
      flex:1,
      alignItems: "center",
      justifyContent: "center"
  
    },
    button: {
      fontSize: 15, color: "black"
    }
  });


