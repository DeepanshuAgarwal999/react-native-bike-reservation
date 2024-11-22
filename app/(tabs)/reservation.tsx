import { View, Text, Alert, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import BikeApi from '@/apis/bike.api'
import ReservationApi from '@/apis/reservation.api'
import { useAuth } from '@/context/AuthProvider'
import { ReservationResponse } from '@/index'
import ReservationCard from '@/components/ReservationCard'
import { CustomButton } from '@/components/CustomButton'

const Reservation = () => {
  const { user, isManager } = useAuth()
  const [reservations, setReservations] = useState<ReservationResponse[] | null>([])
  const [showAll, setShowAll] = useState<boolean>(false)
  const fetchReservations = async () => {
    if (!user || !user.id) {
      return
    }
    if (!showAll) {
      const [error, data] = await ReservationApi.getReservationsById(user?.id)
      setReservations(data)
      return
    }
    else if (showAll && !isManager) {
      Alert.alert("Don't have access")
      return
    }
    const [error, data] = await ReservationApi.getAllReservations()
    if (error) {
      Alert.alert("Unable to get reservations")
      return
    }
    setReservations(data)
  }

  useEffect(() => {
    if (!user) {
      router.push('/(auth)/sign-in')
    }
    fetchReservations()
  }, [showAll])

  const cancelBooking = async (id: number) => {
    const [error, data] = await ReservationApi.cancelReservation(id)
    if (error) {
      // @ts-ignore
      Alert.alert("unable to cancel reservation " + error.response?.data.message)
      return
    }
    Alert.alert("Reservation cancelled successfully")
    fetchReservations()
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      {isManager && <CustomButton title={showAll ? "view less" : 'View all'} handlePress={() => {
        setShowAll(!showAll)
        // fetchReservations()
      }} />}

      <Link href={'/sign-in'}>
        sign in</Link>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ReservationCard fetchReservations={fetchReservations} reservation={item} cancelBooking={cancelBooking} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, gap: 16 }}
        ListEmptyComponent={<Text className="text-center text-white">No reservation done yet!</Text>}
      />
    </SafeAreaView>

  )
}

export default Reservation