import { Slot } from "expo-router";

import "../global.css";
import { AuthProvider } from "@/context/AuthProvider";

export default function AppLayout() {
    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    );
}
