import Loader from "@/components/Loader";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


const AuthLayout = () => {

    // if (!loading && isLogged) return <Redirect href="/home" />;
    let loading = false;
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="sign-in"
                    options={{
                        headerShown: false,

                    }}
                />
                <Stack.Screen
                    name="sign-up"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>

            <Loader isLoading={loading} />
            <StatusBar backgroundColor="#161622" style="light" />
        </>
    );
};

export default AuthLayout;