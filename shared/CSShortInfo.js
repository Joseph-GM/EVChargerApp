import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function CSShortInfo({csName, csAddr, totalCsNumber, availNumber}) {
    return (
        <View>
            <Text style={styles.buttonText}>{csName}</Text>
            <Text style={styles.buttonText}>{csAddr}</Text>
            <Text style={styles.buttonText}>총 충전기 개수 : {totalCsNumber}</Text>
            <Text style={styles.buttonText}>충전가능 개수 : {availNumber}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 15,
        color: "black"
    }
});