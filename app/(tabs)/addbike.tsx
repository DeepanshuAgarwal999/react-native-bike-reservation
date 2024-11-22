import BikeForm from '@/components/form/BikeForm'
import { useAuth } from '@/context/AuthProvider'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, ActivityIndicator, View, StyleSheet } from 'react-native'

const AddBike = () => {
    const { user, isManager } = useAuth()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        if (user === null) {
            router.push('/(auth)/sign-in')
        } else if (!isManager) {
            Alert.alert("You don't have permission")
            router.push('/')
        }
        setLoading(false)
    }, [user, isManager])
    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }
    if (!isManager) {
        return null
    }

    return <BikeForm mode="create" />
}

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Optional: to make it clear where the loading is
    },
})

export default AddBike
