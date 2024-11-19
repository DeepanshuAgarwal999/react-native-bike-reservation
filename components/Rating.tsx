import { View, Text, Alert } from 'react-native'
import React from 'react'
import { Rating, AirbnbRating } from 'react-native-ratings';
import ReservationApi from '@/apis/reservation.api';
import { router } from 'expo-router';

const RatingComponent = ({ reservationId }: { reservationId: number }) => {
    const handleRating = async (rating: number) => {
        const [error, data] = await ReservationApi.rateReservation({ reservationId, rating })
        if (error) {
            Alert.alert("unable to give rating" + error)
            return
        }
        Alert.alert("Thanks for the rating")
        router.navigate('/')
    }
    return (
        <View>
            <AirbnbRating showRating count={5} onFinishRating={(rating) => handleRating(rating)} />
        </View>
    )
}

export default RatingComponent