import { useState } from "react";
import { Link, router } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import FormField from "@/components/FormField";
import { CustomButton } from "@/components/CustomButton";
import UserApi from "@/apis/user.api";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {

    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const submit = async () => {
        if (form.username === "" || form.email === "" || form.password === "") {
            Alert.alert("Error", "Please fill in all fields");
        }

        setSubmitting(true);
        try {
            const result = await UserApi.register({ email: form.email, name: form.username, password: form.password })
            if (!result) {
                Alert.alert("Account already exist or invalid <credentials></credentials>");
                return
            }
            router.replace("/sign-in");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className=" bg-primary h-full">
            <ScrollView>
                <View
                    className="w-full flex justify-center h-full px-4 my-6"
                    style={{
                        minHeight: Dimensions.get("window").height - 100,
                    }}
                >
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        className="w-[215px] h-[100px] mx-auto"
                    />

                    <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
                        Sign Up to The bike revival
                    </Text>

                    <FormField
                        placeholder="username"
                        title="Username"
                        value={form.username}
                        handleChangeText={(e) => setForm({ ...form, username: e })}
                        otherStyles="mt-10"
                    />

                    <FormField
                        title="Email"
                        placeholder="email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                        placeholder="password"
                    />

                    <CustomButton
                        title="Sign Up"
                        handlePress={submit}
                        className="mt-7 bg-yellow-500"
                        isLoading={isSubmitting}
                    />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 ">
                            Have an account already?
                        </Text>
                        <Link
                            href="/sign-in"
                            className="text-lg  text-secondary"
                        >
                            Login
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;