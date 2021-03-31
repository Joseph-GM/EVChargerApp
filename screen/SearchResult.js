import React, {useState, useEffect} from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import {SK_API_KEY} from '../shared/Appkey';

export default function SearchResult({route, navigation}) {
    const poiId = route.params.poiNumber;
    const clocation = route.params.currentLoc;
    const [detailPoi, setDetailPoi] = useState({});
//    const SK_API_KEY = 'SK_API_KEY';
    const URL = 'https://apis.openapi.sk.com/tmap/pois/';
    const [getDetail, setGetDetail] = useState(true);
    
    useEffect( () => {
        axios.get(URL+poiId.toString(), {
            params: {
              version: 1,
              appKey: SK_API_KEY,
            } 
          })
          .then(response => {
              setDetailPoi(response.data);
              setGetDetail(false);
            })
          .catch(error => {console.log('error')})
    },[]);
    
    return (
        <View style={styles.main}>
            {getDetail?<Text>Data is Loading</Text> : 
            <>
                <View style={styles.header}>
                    {console.log("*******Search Result********")}
                    {console.log(clocation)}
                    <Text style={styles.headerText}>{detailPoi.poiDetailInfo.name}</Text>
                </View>
                <View style={styles.detailInfo}>
                    <Text>address:{detailPoi.poiDetailInfo.address}</Text>
                    <Text>homepage:{detailPoi.poiDetailInfo.homepageURL}</Text>
                    <Text>routeInfo:{detailPoi.poiDetailInfo.routeInfo}</Text>
                    <Text>additionalInfo:{detailPoi.poiDetailInfo.additionalInfo}</Text>
                    <Text>description:{detailPoi.poiDetailInfo.desc}</Text>
                </View>
                <Button 
                    title = "Create Route"
                    onPress = { () => navigation.navigate('SearchRoute', {cPosition: clocation, dLatitude: detailPoi.poiDetailInfo.frontLat, dLongitude: detailPoi.poiDetailInfo.frontLon})}
                />
            </>}          
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    header: {
        flex: 1,
        backgroundColor: 'yellow'
    },
    detailInfo: {
        flex: 9,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});