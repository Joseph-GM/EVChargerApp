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
import CSShortInfo from '../shared/CSShortInfo';

//const SK_API_KEY = 'SK_API_KEY'
    
// const TMapShow = requireNativeComponent("TMapShow")

export default function HomeScreen({navigation}) {

  const [cPosition, setCPosition] = useState([37.512992, 126.7063177])
  const [address, setAddress] = useState({});
  const [csData, setCSData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [markerClick, setMarkerClick] = useState(false);
  const [csName, setCsName] = useState("");
  const [detailPoi, setDetailPoi] = useState({});
  const [csAddr, setCsAddr] = useState("");
  const [totalCsNumber, setTotalCsNumber] = useState("");
  const [availNumber, setAvailNumber] = useState("");

  const URLPoi = 'https://apis.openapi.sk.com/tmap/pois/'

  const countAvailCs = (csdetail) => {
    var count = 0;
    var arrLength = csdetail.length;
    for (var i = 0 ; i < arrLength ; i ++) {
      console.log("충전기 상태 = ", csdetail[i].status)
      if (csdetail[i].status == "2") {
        count = count +1;
      }
    }
    setAvailNumber(count.toString());
  }

  const excuteId = (marker) => {
    console.log ("Main ***** marker click detected", marker)
    if (marker.id != null) {
      axios.get(URLPoi+marker.id.toString(), {
        params: {
          version: 1,
          appKey: SK_API_KEY,
        } 
      })
      .then(response => {
          setDetailPoi(response.data);
          console.log("Suceess getting Detail *****",response.data.poiDetailInfo.name);
          setCsAddr(response.data.poiDetailInfo.bldAddr);
          setTotalCsNumber(response.data.poiDetailInfo.totalCnt);
          countAvailCs(response.data.poiDetailInfo.evChargers);
          setMarkerClick(true);
        })
      .catch(error => {console.log('error')})
    } else {
      setMarkerClick(false)
    }
    setCsName(marker.name.toString());
  } 

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
      return axios.get(URLPoi, {
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
                parentCallback = {excuteId}
              />
            </View>
            <View style={styles.border}>
              <TouchableOpacity
                onPress={this.state}
              >
                {markerClick?
                  <View>
                    <CSShortInfo 
                      csName = {csName}
                      csAddr = {csAddr}
                      totalCsNumber = {totalCsNumber}
                      availNumber = {availNumber}
                    />
                  </View>
                  : <Text style={styles.button}>
                  {address.addressInfo.fullAddress}
                </Text> }
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


