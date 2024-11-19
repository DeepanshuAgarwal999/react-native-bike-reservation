import { View, Text, Alert, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import UserApi from '@/apis/user.api'
import { User } from '..'
import UserCard from '@/components/UserCard'
import { SafeAreaView } from 'react-native-safe-area-context'

const users = () => {
    const [users, setUsers] = useState<User[]>([])
    const fetchUsers = async () => {
        const [error, data] = await UserApi.getAllUsers();
        if (error) {
            Alert.alert("Unable to fetch users")
            return
        }
        setUsers(data)
    }
    useEffect(() => {
        fetchUsers()
    }, [])
    const updateUser = async (id: number, details: { isManager: boolean, name: string }) => {
        const [error, data] = await UserApi.updateUser(id, details)
        if (error) {
            Alert.alert("Unable to update users" + error)
            return
        }
        Alert.alert("USer updated successfully")
        fetchUsers()
    }
    const deleteUser = async (id: number) => {
        const [error, data] = await UserApi.deleteUser(id)
        if (error) {
            Alert.alert("Unable to delete users" + error)
            return
        }
        fetchUsers()
        Alert.alert("user deleted successfully")
    }
    return (
        <SafeAreaView className='bg-primary h-full'>
            <View className='p-4'>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <UserCard
                            user={item}
                            deleteUser={deleteUser}
                            updateUser={updateUser}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <Text className="text-center text-lg mt-4">No users found.</Text>
                    )}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                    contentContainerStyle={{ padding: 16 }}
                />
            </View>
        </SafeAreaView>
    )
}

export default users