import React, {useState} from 'react';
import { 
    View, 
    Text, 
    Button, 
    TextInput, 
    FlatList,
    TouchableOpacity,
    StyleSheet, } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {SK_API_KEY} from '../shared/Appkey';

//const SK_API_KEY = 'SK_API_KEY';


export default function SearchScreen({navigation}) {
    const [text, setText] = useState('');
    const [poiResults, setPoiResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cPosition, setCPosition] = useState([37.512992, 126.7063177])

    const fetchPoi = (text) => {
        Geolocation.getCurrentPosition(
            position => {
                const templat = position.coords.latitude;
                const templon = position.coords.longitude;
                loadingPoi(templat, templon, text);
                setCPosition([templat, templon])
            },
            error => {
                console.log("error in getting curretn Position")
            }
        )
    }

    const loadingPoi = async(clat, clon, text) => {
        try{
            return axios.get('https://apis.openapi.sk.com/tmap/pois', {
                params: {
                    version: 1,
                    count: 20,
                    searchKeyword: text,
                    centerLat: clat.toString(),
                    centerLon: clon.toString(),
                    appKey: SK_API_KEY
                }
            })
            .then(res => setPoiResults(res.data.searchPoiInfo.pois.poi))
            .then(setIsLoading(false))
        } catch(error) {
            console.log("Error in getting POI results")
        }
    }



    return (
        <View>
            <TextInput
                style={{borderWidth: 1, padding: 10, fontSize: 20}}
                placeholder="Input POI Name.."
                onChangeText={setText}
            />
            <Button 
                title="Submit"
                onPress={() => fetchPoi(text)}
            />
            <View>
                {
                    isLoading?<Text>Input POI Name</Text>:
                    <FlatList 
                        ItemSeparatorComponent = {() => <View style={styles.separator}/>}
                        data = {poiResults}
                        keyExtractor={(item, index)=> index.toString()}
                        renderItem = {({item}) => (
                            <TouchableOpacity
                                onPress={()=> navigation.navigate('SearchResult', {poiNumber:item.id, currentLoc: cPosition})}
                            >
                                <Text>{item.name}</Text>
                                <Text>{item.newAddressList.newAddress[0].fullAddressRoad}</Text>
                                <Text>{item.middleBizName} {item.lowerBizName}</Text>
                            </TouchableOpacity>
                        )}
                    /> 
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: '#CED0CE'
    }
})
