import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function RouteSummary({totalDistanceKm, totalTime, fare}) {
    return (
        <View>
            <Text style={styles.buttonText}>
                총거리 : {totalDistanceKm} km
            </Text>
                <Text style={styles.buttonText}>
                총시간 : {totalTime} 분
                </Text>
                <Text style={styles.buttonText}>
                요금 : {fare} 원
                </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 15,
        color: "black"
    }
});