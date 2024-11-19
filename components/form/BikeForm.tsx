import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import { useAuth } from '@/context/AuthProvider';
import { router } from 'expo-router';
import BikeApi from '@/apis/bike.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormField from '@/components/FormField';
import { CustomButton } from '@/components/CustomButton';
import Checkbox from 'expo-checkbox'

const bikeSchema = z.object({
    model: z.string().min(1, 'Model is required'),
    color: z.string().min(1, 'Color is required'),
    location: z.string().min(1, 'Location is required'),
    isAvailable: z.boolean().default(false),
    imageURL: z.string().optional(),
});


const BikeForm = ({ mode, id }: { mode: "update" | "create", id?: number }) => {
    const [isAvailable, setIsAvailable] = useState(false);
    const { isManager } = useAuth();

    if (!isManager) {
        Alert.alert("You don't have access");
        router.replace('/');
        return null;
    }

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(bikeSchema),

    });

    const handleCheckboxChange = () => {
        setIsAvailable((prev) => !prev);
        setValue('isAvailable', !isAvailable);
    };

    useEffect(() => {
        if (mode === "update" && id) {
            const fetchBikeDetails = async () => {
                const [error, data] = await BikeApi.getBikeById(id);
                console.log(data)
                if (error) {
                    Alert.alert('Error fetching bike details: ' + error);
                    return;
                }
                setValue('model', data.model);
                setValue('color', data.color);
                setValue('location', data.location);
                setValue('isAvailable', data.isAvailable);
                setValue('imageURL', data.imageURL);
                setIsAvailable(data.isAvailable);
            };

            fetchBikeDetails();
        }
    }, [mode, id]);

    const onSubmit = async (data: any) => {
        console.log("first")
        if (mode === "create") {
            const [error, response] = await BikeApi.createBike(data);
            if (error) {
                Alert.alert('Error creating bike' + error);
                return;
            }
            console.log(response)
        }
        else {
            if (!id) {
                Alert.alert("Invalid id")
                return
            }
            const [error, response] = await BikeApi.updateBike(id, data);
            if (error) {
                Alert.alert('Error updating bike' + error);
                return;
            }
        }
        Alert.alert(`Bike ${mode}d successfully`);
        router.push('/')
    };
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <Image source={images.logo} resizeMode="contain" className="w-[215px] h-[100px] mx-auto" />
                <Text className="text-center text-white text-3xl font-semibold mt-10">{mode} Bike</Text>

                <View className="px-6 py-4 flex flex-col gap-6">
                    <FormField
                        name="model"
                        placeholder="Enter bike model"
                        control={control}
                        errorMessage={errors.model?.message}
                    />
                    <FormField
                        name="color"
                        placeholder="Enter bike color"
                        control={control}
                        errorMessage={errors.color?.message}
                    />
                    <FormField
                        name="location"
                        placeholder="Enter bike location"
                        control={control}
                        errorMessage={errors.location?.message}
                    />
                    <View className="flex-row items-center gap-2">
                        <Text className="text-white">Available</Text>
                        <Checkbox value={isAvailable} onValueChange={handleCheckboxChange} color={'yellow'} />
                    </View>


                    <FormField
                        name="imageURL"
                        placeholder="Enter image URL"
                        control={control}
                        errorMessage={errors.imageURL?.message}
                    />

                    <CustomButton title={mode + " bike"} handlePress={handleSubmit(onSubmit)} className="bg-yellow-500" />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default BikeForm