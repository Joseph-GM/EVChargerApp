import React, { useState, useEffect } from 'react'
import { SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    requireNativeComponent, } from 'react-native'

import axios from 'axios'
import Geolocation from '@react-native-community/geolocation';

const SK_API_KEY = 'l7xxb0267913faf84de39d5c80d951a60836'
    
const TMapShow = requireNativeComponent("TMapShow")

export default function HomeScreen() {
  const [clat, setClatitude] = useState(37.512992);
  const [clon, setClongitude] = useState(126.7063177);
  const [address, setAddress] = useState({});
  const [csData, setCSData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const firstAddress = axios.get('https://apis.openapi.sk.com/tmap/geo/reversegeocoding', {
    params: {
      version: 1,
      lat: clat.toString(),
      lon: clon.toString(),
      appKey: SK_API_KEY,
      format: "json",
      callback: "result",
    } 
  })

  const secondCSData = axios.get('https://apis.openapi.sk.com/tmap/pois', {
    params: {
      version: 1,
      count: 20,
      searchKeyword: "전기차충전소",
      centerLat: clat.toString(),
      centerLon: clon.toString(),
      appKey: SK_API_KEY,
    } 
  })

  useEffect( () => {

    Geolocation.getCurrentPosition(
      position => {
        setClatitude(position.coords.latitude);
        setClongitude(position.coords.longitude);
        axios
        .all([firstAddress, secondCSData])
        .then(
          axios.spread((...response) => {
            const first = response[0].data;
            const second = response[1].data;
//            console.log("ADDRESS*************************")
//            console.log(JSON.stringify(first));
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

  /*     state = {
        zoom: 5,
        lat : 37.55555,
        lon : 126.11111,
        breweryList: null,
        addressData : null,
        isLoading : true,
        }; */
      
/*      componentDidMount() {
        Geolocation.getCurrentPosition(
          position => {
            this.setState(
              {
                lat : position.coords.latitude,
                lon : position.coords.longitude,
              }
            );
            Promise.all([
              fetch(`https://apis.openapi.sk.com/tmap/pois?version=1&count=10&searchKeyword=EV충전소&centerLon=${position.coords.longitude}&centerLat=${position.coords.latitude}&appKey=${SK_API_KEY}`),
              fetch(`https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&lat=${position.coords.latitude}&lon=${position.coords.longitude}&appKey=${SK_API_KEY}`)
             ])
            .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
            .then(([data1, data2]) => {this.setState({
              breweryList : data1.searchPoiInfo.pois.poi,
              addressData : data2,
              isLoading: false,
            });
          })
          },
          error => {
            console.log('error')
          }
        )
      } */

      return (
        <View style={styles.container}>
          {isLoading? <Text> Data is Loading </Text> :
          <>
            <TMapShow 
            style={ styles.wrapper }
            zoom = {10}
            clatitude = {clat}
            clongitude = {clon}
            markerdata = {csData}
          />
          <TouchableOpacity
            style={[styles.border]}
            onPress={this.increment}
          >
            <Text style={styles.button}>
              {address.addressInfo.fullAddress}
            </Text>
          </TouchableOpacity>
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


