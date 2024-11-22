import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { router } from 'expo-router';

type User = {
    token: string | null;
    id: number;
    isManager: boolean;
};

type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logout: () => void;
    isAuthenticated: boolean;
    isManager: boolean;
};

interface UserJwtPayload extends JwtPayload {
    id: number;
    isManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const decodedToken: UserJwtPayload = jwtDecode(token);
                setUser({ token, id: decodedToken.id, isManager: decodedToken.isManager });
            }
            // else {
            //     router.push('/(auth)/sign-in')
            // }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout,
                isAuthenticated: !!user,
                isManager: !!user?.isManager,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
