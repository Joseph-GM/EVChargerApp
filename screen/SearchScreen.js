import React, {useState} from 'react'
import { View, Text, Button } from 'react-native'



export default function SearchScreen({navigation}) {
    const [poiData, setPoiData] = useState({});

    return (
        <View>
            <Text>SearchScreen</Text>
            <Button 
                title="Go to result"
                onPress = {()=> navigation.navigate('SearchResult')}
            />
        </View>
    )
}
