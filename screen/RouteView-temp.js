import React, {useState, useEffect} from 'react'
import { View, Text,StyleSheet,} from 'react-native'
import MapView from './MapView'
import axios from 'axios';
import {SK_API_KEY} from '../shared/Appkey';

export default function RouteView({route, navigation}) {
    const currentPosition = route.params.cPosition
    const destination = [route.params.dLatitude, route.params.dLongitude]
    const URL = 'https://apis.openapi.sk.com/tmap/pois/'

    const [csData, setCSData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {
        const fetchData = async () => {
            const response = await axios.get(URL, {
                params: {
                    version: 1,
                    count: 5,
                    searchKeyword: "EV충전소",
                    centerLat: destination[0].toString(),
                    centerLon: destination[1].toString(),
                    appKey: SK_API_KEY,
                } 
              });
              setCSData(response.data.searchPoiInfo.pois.poi);
              setIsLoading(false);
        };
        fetchData();

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
                />
                </View>
                <View>
                    <Text>Route Created!</Text>
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
})
