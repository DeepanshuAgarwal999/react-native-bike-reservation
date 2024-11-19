import { View, Text } from 'react-native'
import React from 'react'
import BikeForm from '@/components/form/BikeForm'
import { useLocalSearchParams } from 'expo-router'

const EditBike = () => {
    const { id } = useLocalSearchParams()
    return (
        <BikeForm mode='update' id={+id} />
    )
}

export default EditBike