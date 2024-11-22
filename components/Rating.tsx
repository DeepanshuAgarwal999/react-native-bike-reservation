import { View, Alert } from 'react-native';
import React from 'react';
import { AirbnbRating } from 'react-native-ratings';
import ReservationApi from '@/apis/reservation.api';
import { router } from 'expo-router';

const RatingComponent = ({ reservationId, fetchReservations }: { reservationId: number, fetchReservations: () => void }) => {
    const handleRating = async (rating: number) => {
        // Show confirmation dialog
        Alert.alert(
            "Confirm Rating",
            `Are you sure you want to submit a rating of ${rating}?`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Rating cancelled"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        const [error, data] = await ReservationApi.rateReservation({ reservationId, rating });
                        if (error) {
                            Alert.alert("Unable to give rating", error);
                            return;
                        }
                        fetchReservations()
                        Alert.alert("Thanks for the rating");
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <View>
            <AirbnbRating
                showRating
                count={5}
                onFinishRating={(rating) => handleRating(rating)}
            />
        </View>
    );
};

export default RatingComponent;
