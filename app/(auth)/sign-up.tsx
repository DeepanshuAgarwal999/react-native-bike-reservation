import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { CustomButton } from "@/components/CustomButton";
import Loader from "@/components/Loader";
import { images } from "@/constants";
import UserApi from "@/apis/user.api";
import FormField from "@/components/FormField";
import { useAuth } from "@/context/AuthProvider";

const schema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").nonempty("Username is required"),
    email: z.string().email("Please enter a valid email").nonempty("Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters").nonempty("Password is required"),
});

const SignUp = () => {
    const { setUser } = useAuth();
    const [isSubmitting, setSubmitting] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const submit = async (data: { username: string; email: string; password: string }) => {
        setSubmitting(true);
        try {
            const response = await UserApi.register({
                name: data.username,
                email: data.email,
                password: data.password,
            });
            if (response) {
                Alert.alert("Success", "Account created successfully");
                router.replace("/sign-in");
            } else {
                Alert.alert("Error", "Unable to create an account. Please try again.");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    if (isSubmitting) {
        return <Loader isLoading={isSubmitting} />;
    }

    return (
        <SafeAreaView className="bg-black h-full">
            <ScrollView>
                <View className="w-full flex justify-center h-full px-4 my-6" style={{ minHeight: Dimensions.get("window").height - 100 }}>
                    <Image source={images.logo} resizeMode="contain" className="w-[215px] h-[100px] mx-auto" />
                    <Text className="text-2xl font-semibold text-white mt-10">Sign Up for The Bike Revival</Text>

                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, value } }) => (
                            <FormField
                                control={control}
                                name="username"
                                title="Username"
                                value={value}
                                handleChangeText={onChange}
                                placeholder="Username"
                                errorMessage={errors.username?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <FormField
                                control={control}
                                name="email"
                                title="Email"
                                value={value}
                                handleChangeText={onChange}
                                placeholder="Email"
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <FormField
                                control={control}
                                name="password"
                                title="Password"
                                value={value}
                                handleChangeText={onChange}
                                placeholder="Password"
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <CustomButton
                        title="Sign Up"
                        handlePress={handleSubmit(submit)}
                        className="mt-7 bg-yellow-500"
                        isLoading={isSubmitting}
                    />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">Already have an account?</Text>
                        <Link href="/sign-in" className="text-lg font-psemibold text-secondary">
                            Login
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;
