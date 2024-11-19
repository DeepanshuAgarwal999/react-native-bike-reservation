import { View, Text, Image, Alert } from 'react-native'
import React from 'react'
import { ReservationResponse } from '..'
import { formatReadableDate } from '@/lib/utils'
import { CustomButton } from './CustomButton'
import RatingComponent from './Rating'

const ReservationCard = ({ reservation, cancelBooking }: { reservation: ReservationResponse, cancelBooking: (id: number) => void }) => {

    const isBookingActive = new Date(reservation.endDate).getTime() > Date.now();
    return (
        <View className='bg-black-200 p-4 rounded-lg flex flex-col'>
            {reservation.bike.imageURL && <Image
                className='rounded-xl object-cover mx-auto'
                source={{ uri: reservation.bike.imageURL }} alt='bike' width={250} height={200} />}
            <View className='px-6 pt-4'>
                <Text className='text-white text-2xl text-center'>{reservation.bike.model}</Text>
                <Text className='text-white mt-4'>Start Date : {formatReadableDate(reservation.startDate)}</Text>
                <Text className='text-white'>End Date : {formatReadableDate(reservation.endDate)}</Text>
                <Text className='text-white'>Color : {reservation.bike.color}</Text>
                <Text className='text-white'>Rating : {reservation.rating}⭐</Text>
                <Text className='text-white'>status : {!reservation.disabled && isBookingActive ? "active" : "Inactive"}</Text>
                {
                    reservation.rating || reservation.disabled ? null : <RatingComponent reservationId={reservation.id} />
                }
                <Text className='text-white'>Reserved By : {reservation.user.name}</Text>
                {/* {reservation.} */}
            </View>
            {
                !reservation.disabled && <View className='flex flex-col gap-4 mt-6'>
                    {
                        isBookingActive && <CustomButton title='Cancel booking' handlePress={() => cancelBooking(reservation.id)} className='bg-red-500' />
                    }
                    <CustomButton title='Review' handlePress={() => { }} className='bg-black-100' />
                </View>
            }

        </View>
    )
}

export default ReservationCard