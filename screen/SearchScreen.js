import React, {useState} from 'react'
import { View, Text, Button, TextInput } from 'react-native'



export default function SearchScreen({navigation}) {
    const [text, setText] = useState('');

    const _onChange = event => setText(event.nativeEvent.text);
    
    return (
        <View>
            <Text>SearchScreen</Text>
            <TextInput
                style={{borderWidth: 1, padding: 10, fontSize: 20}}
                placeholder="Input POI Name.."
                onchage={_onChange}
            />
            <Button 
                title="Submit"
                onPress={() => console.log(text)}
            />
            <Button 
                title="Go to result"
                onPress = {()=> navigation.navigate('SearchResult')}
            />
        </View>
    )
}
