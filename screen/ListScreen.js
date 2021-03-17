import React from 'react'
import { Text, View, FlatList, TouchableOpacity, StyleSheet, } from 'react-native'

export default function ListScreen({route, navigation}) {
    const mapList = route.params
    return (
        <View>
            <FlatList
                ItemSeparatorComponent= {() => <View style={styles.separator } />} 
                data = {mapList}
                renderItem = {({item}) => (
                    <TouchableOpacity onPress={()=> navigation.navigate('Details', item.id)}>
                            <Text style={styles.nameStyle}>{item.name} </Text>
                            <Text style={styles.itemStyle}>{item.newAddressList.newAddress[0].fullAddressRoad}</Text>
                            <Text style={styles.itemStyle}>Latitude:{item.noorLat} Longitude:{item.noorLon}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );  

}
const styles = StyleSheet.create({
    nameStyle : {
      padding : 10,
      fontSize : 15,
      fontWeight: 'bold'
  },
  itemStyle : {
      padding : 5,
      fontSize : 13,
  },
  separator: {
      height:1,
      backgroundColor: '#CED0CE',
  }
    });    
