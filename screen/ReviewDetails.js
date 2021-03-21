import { types } from '@babel/core';
import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, FlatList, Button } from 'react-native'

function typeSelector(typeNumber) {
    const type = typeNumber
    switch (type) {
        case "01":
            return "DC차데모";
        case "02":
            return "승용차 AC완속";
        case "03":
            return "DC차데모+AC3상";
        case "04":
            return "DC콤보";
        case "05":
            return "DC차데모+DC콤보";
        case "06":
            return "DC차데모+AC3상+DC콤보";
        case "07":
            return "AC급속3상";
        default:
            return "알수 없음"
      }
}

function statusSelector(statusNumber) {
    const status = statusNumber
    switch (status) {
        case "0":
            return "알수없음";
        case "1":
            return "통신이상";
        case "2":
            return "충전대기";
        case "3":
            return "충전중";
        case "4":
            return "운영중지";
        case "5":
            return "점검중";
        case "6":
            return "예약중";
        default:
            return "알수 없음"
      }
}


export default function ReviewDetails({route, navigation}) {
    const poiId = route.params.poiNumber
    const cLocation = route.params.currentLoc
    const [detailPoi, setDetailPoi] = useState({});
    const SK_API_KEY = 'SK_API_KEY'
    const URL = 'https://apis.openapi.sk.com/tmap/pois/'
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
            {getDetail? <Text>Data is Loading</Text> :
            <>
                {console.log(detailPoi.poiDetailInfo.name)}
                {console.log(cLocation)}
                {console.log(poiId)}
                < View style={styles.header}>
                    <Text style={styles.headerText}> {detailPoi.poiDetailInfo.name}}</Text>
                </View>
                <View style={styles.csInfo}>
                    <Text>충전기갯수: {detailPoi.poiDetailInfo.totalCnt} </Text>
                    <Text>운영회사: {detailPoi.poiDetailInfo.mngName} </Text>
                    <Text>운영시간: {detailPoi.poiDetailInfo.useTime}</Text>
                    <Text>정보업데이트시간: {detailPoi.poiDetailInfo.updateDt}</Text>
                </View>
                <View>
                    <Button 
                        title = "Create Route"
                        onPress = {
                            () => navigation.navigate('Route',{cPosition: cLocation, dLatitude: detailPoi.poiDetailInfo.frontLat, dLongitude: detailPoi.poiDetailInfo.frontLon})
                        }
                    />
                </View>
                <View>
                    <Text style={styles.midTitles}>충전기정보</Text>
                </View>
                <View style={styles.detail}>
                    {console.log(detailPoi.poiDetailInfo.evChargers)}
                    <FlatList
                        ItemSeparatorComponent= {() => <View style={styles.separator } />} 
                        data = {detailPoi.poiDetailInfo.evChargers}
                        keyExtractor={(item) => String(item.cid)}
                        renderItem = {({item}) => (
                            <View>
                                <Text>충전기 타입:{typeSelector(item.type)}</Text>
                                <Text>충전기 상태: {statusSelector(item.status)}</Text>
                            </View>
                        )}
                    />
                </View>
            </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    header: {
        flex: 1,
        backgroundColor: 'yellow',
    },
    csInfo: {
        flex:5,
        backgroundColor: 'white',
    },
    midTitles: {
        flex: 1,
        backgroundColor :'yellow',
        fontSize: 15,
        fontWeight: 'bold',
    },
    detail: {
        flex: 5,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        height:1,
        backgroundColor: '#CED0CE',
    }

    });
