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
import {SK_API_KEY} from '../shared/Appkey';

//const SK_API_KEY = 'SK_API_KEY'
    
// const TMapShow = requireNativeComponent("TMapShow")

export default function HomeScreen({navigation}) {

  const [cPosition, setCPosition] = useState([37.512992, 126.7063177])
  const [address, setAddress] = useState({});
  const [csData, setCSData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const secondCSData = async(templat, templon) => {
    try{
      return axios.get('https://apis.openapi.sk.com/tmap/pois', {
      params: {
      version: 1,
      count: 20,
      searchKeyword: "EV충전소",
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
        axios
        .all([firstAddress(templat,templon), secondCSData(templat,templon)])
        .then(
          axios.spread((...response) => {
            const first = response[0].data;
            const second = response[1].data;
            setAddress(first);
            setCSData(second.searchPoiInfo.pois.poi);
            setIsLoading(false);

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
            <View style={ styles.wrapper }>
              <MapView
                getZoom = {10}
                getCLat = {cPosition[0]}
                getCLon = {cPosition[1]}
                markers = {csData}
              />
            </View>
            <View style={styles.border}>
              <TouchableOpacity
                onPress={this.state}
              >
                <Text style={styles.button}>
                  {address.addressInfo.fullAddress}
                </Text>
              </TouchableOpacity>
            </View>
            <View styel={styles.buttonView}>
              <Button 
                style = {styles.buttonText}
                title = "Go To List View"
                onPress = {()=> navigation.navigate('List',{markerInfo: csData, currentLoc: cPosition}) }
              />
            </View> 
          </>
          }
        </View>
      );
    
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
      justifyContent: "center"
  
    },
    buttonText: {
      fontSize: 15, color: "black"
    },
    buttonView:{
      flex:1
    }
  });


