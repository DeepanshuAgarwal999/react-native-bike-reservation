import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";  // Import Zod for schema validation
import { CustomButton } from "@/components/CustomButton";
import { JwtPayload, jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/Loader";
import { images } from "@/constants";
import UserApi from "@/apis/user.api";
import { useAuth } from "@/context/AuthProvider";
import FormField from "@/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    email: z.string().email("Please enter a valid email").nonempty("Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters").nonempty("Password is required")
});

interface UserJwtPayload extends JwtPayload {
    id: number;
    isManager: boolean;
}

const SignIn = () => {
    const { setUser } = useAuth();
    const [isSubmitting, setSubmitting] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const submit = async (data: { email: string; password: string }) => {
        setSubmitting(true);
        try {
            const [error, response] = await UserApi.logIn({ email: data.email, password: data.password });
            if (response) {
                const decodedToken: UserJwtPayload = jwtDecode(response.data);
                setUser({ token: response.data, id: decodedToken.id, isManager: decodedToken.isManager });
                await AsyncStorage.setItem('token', response.data);
                Alert.alert("Success", "User signed in successfully");
                router.replace("/");
            } else {
                Alert.alert("Unable to login", error?.message);
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || error);
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
                    <Text className="text-2xl font-semibold text-white mt-10">Log in to The Bike Revival</Text>

                    {/* Email field */}
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

                    {/* Password field */}
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

                    {/* Submit Button */}
                    <CustomButton
                        title="Sign In"
                        handlePress={handleSubmit(submit)}
                        className="mt-7 bg-yellow-500"
                        isLoading={isSubmitting}
                    />

                    {/* Sign Up link */}
                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">Don't have an account?</Text>
                        <Link href="/sign-up" className="text-lg font-psemibold text-secondary">
                            Signup
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
