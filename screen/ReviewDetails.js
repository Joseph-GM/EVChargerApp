import React from 'react'
import { View, Text, StyleSheet, ImageBackgroundComponent } from 'react-native'

export default function ReviewDetails({route}) {
    const poiId = route.params
    return (
        <View style={styles.main}>
            < View style={styles.header}>
                <Text style={styles.headerText}>EV CS Name {poiId}</Text>
            </View>
            <View style={styles.csInfo}>
                <Text>운영회사: </Text>
                <Text>운영시간: </Text>
            </View>
            <View style={styles.seperator}>
                <Text>충전기정보</Text>
            </View>
            <View style={styles.detail}>
                <Text>충전기 타입:</Text>
                <Text>충전기 상태:</Text>
            </View>
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
    seperator: {
        flex: 1,
        backgroundColor :'yellow',
    },
    detail: {
        flex: 5,
        backgroundColor: 'gray',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    });
