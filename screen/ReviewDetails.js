import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'

export default function ReviewDetails({route}) {
    const poiId = route.params
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
                < View style={styles.header}>
                    <Text style={styles.headerText}> {detailPoi.poiDetailInfo.name}}</Text>
                </View>
                <View style={styles.csInfo}>
                    <Text>충전기갯수: {detailPoi.poiDetailInfo.totalCnt} </Text>
                    <Text>운영회사: {detailPoi.poiDetailInfo.mngName} </Text>
                    <Text>운영시간: {detailPoi.poiDetailInfo.useTime}</Text>
                    <Text>정보업데이트시간: {detailPoi.poiDetailInfo.updateDt}</Text>
                </View>
                <View style={styles.midTitles}>
                    <Text>충전기정보</Text>
                </View>
                <View style={styles.detail}>
                    {console.log(detailPoi.poiDetailInfo.evChargers)}
                    <FlatList
                        ItemSeparatorComponent= {() => <View style={styles.separator } />} 
                        data = {detailPoi.poiDetailInfo.evChargers}
                        renderItem = {({item}) => (
                            <View>
                                <Text>충전기 타입:{item.type}</Text>
                                <Text>충전기 상태: {item.status}</Text>
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
