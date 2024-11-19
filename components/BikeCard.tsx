import { View, Text, Image, Touchable, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { BikeCardType } from '..'
import { Link, router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { useAuth } from '@/context/AuthProvider'

const BikeCard = ({ bike, deleteBike }: { bike: BikeCardType, deleteBike: (id: number) => void }) => {
    const { isManager } = useAuth()
    console.log(bike.imageURL)
    const handleUpdate = (id: number) => {
        // @ts-ignore
        router.push("/editbike/" + id.toString())
    }
    return (
        <View className='p-4 my-2 bg-black-200 rounded-lg flex flex-col gap-2 text-2xl text-gray-300'>
            {bike.imageURL ? <Image
                className='rounded-xl object-cover mx-auto'
                source={{ uri: bike.imageURL }} alt='bike' width={250} height={200} /> : <Text className='text-white text-center py-4'>Image not available</Text>}
            <Text className=' text-white capitalize pl-4 text-2xl'>{bike.model}</Text>
            <Text className='pl-4 text-gray-300 text-xl'>{bike.color}</Text>
            <Text className='text-xl pl-4 text-white'>Available :
                <Text className={`pl-4 inline-block ${bike.isAvailable ? "text-secondary" : "text-[#ef4444]"}`}>
                    {bike.isAvailable ? " Available" : " Not Available"}
                </Text>
            </Text>
            <View className='flex flex-row gap-4 flex-wrap items-center justify-center' >

                <Link href={`/reservation/${bike.id}`} className='bg-yellow-500  rounded-lg p-4 '>
                    <View className="flex flex-row items-center justify-center gap-2 text-center ">
                        {/* <Text className="text-white text-xl font-semibold capitalize">Book Now</Text> */}
                        <AntDesign
                            name="arrowright"
                            size={20}
                            color="white"
                        />
                    </View>
                </Link>
                {
                    isManager && <TouchableOpacity className='bg-red-500  rounded-lg p-4 ' onPress={() => deleteBike(bike.id)}>
                        <AntDesign name='delete' size={20} color={"white"} />
                    </TouchableOpacity>
                }
                {
                    isManager && <TouchableOpacity className='bg-green-500  rounded-lg p-4 ' onPress={() => handleUpdate(bike.id)} >
                        <AntDesign name='edit' size={20} color={'white'} />
                    </TouchableOpacity>
                }

            </View>

        </View>
    )
}

export default BikeCard