import React, { useState } from 'react';
import { View, Text, Platform, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { CustomButton } from '@/components/CustomButton';
import { images } from '@/constants';
import ReservationApi from '@/apis/reservation.api';
import { router, useLocalSearchParams } from 'expo-router';

const ReservationById = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const { id } = useLocalSearchParams()

  const handleReserve = async () => {
    if (dayjs(endDate).isBefore(startDate)) {
      Alert.alert('Invalid date range. End date must be after start date.');
      return;
    }
    console.log(`Reserved from ${dayjs(startDate).format('YYYY-MM-DD')} to ${dayjs(endDate).format('YYYY-MM-DD')}`);
    const [error, data] = await ReservationApi.createReservation({ endDate: endDate, startDate: startDate, bikeId: +id })
    if (error) {
      Alert.alert("unable to reserve, " + error.message)
      return
    }
    Alert.alert("Booked successfully")
    router.push('/reservation')
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="py-10 px-8">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[215px] h-[100px] mx-auto"
          />
          <Text className="text-3xl font-semibold text-center text-yellow-500 mt-6">Reserve Your Bike</Text>
          <View className="space-y-10 mt-20">
            {/* Start Date Picker */}
            <View >
              <Text className="text-white mb-6">Start Date:</Text>

              <CustomButton title={dayjs(startDate).format('YYYY-MM-DD')} handlePress={() => setShowStartPicker(true)} className='bg-emerald-500' />
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(event, date) => {
                    setShowStartPicker(false);
                    if (date) setStartDate(date);
                  }}
                />
              )}
            </View>

            {/* End Date Picker */}
            <View className='mt-6'>
              <Text className="text-white mb-6">End Date:</Text>

              <CustomButton title={dayjs(endDate).format('YYYY-MM-DD')} handlePress={() => setShowEndPicker(true)} className='bg-emerald-500' />
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(event, date) => {
                    setShowEndPicker(false);
                    if (date) setEndDate(date);
                  }}
                />
              )}
            </View>

            <CustomButton title="Reserve" handlePress={handleReserve} className='mt-10 bg-yellow-400' />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReservationById;
