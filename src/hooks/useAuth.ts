import { useState, useEffect } from 'react';
import { isUserLoggedIn, getCurrentUser, logoutUser } from '../clients/strapi';

export interface User {
    id: number;
    username: string;
    email: string;
    firstname?: string;
    surname?: string;
    confirmed: boolean;
    blocked: boolean;
}

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkAuthStatus = () => {
        try {
            const loggedIn = isUserLoggedIn();
            setIsLoggedIn(loggedIn);

            if (loggedIn) {
                const currentUser = getCurrentUser();
                setUser(currentUser);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsLoggedIn(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = (userData: User, token: string) => {
        localStorage.setItem('volunteer_jwt', token);
        localStorage.setItem('volunteer_user', JSON.stringify(userData));
        setIsLoggedIn(true);
        setUser(userData);
        setIsLoading(false);
    };

    const logout = () => {
        logoutUser();
        setIsLoggedIn(false);
        setUser(null);
    };

    const getAuthToken = (): string | null => {
        return localStorage.getItem('volunteer_jwt');
    };

    return {
        isLoggedIn,
        user,
        isLoading,
        login,
        logout,
        getAuthToken,
        refreshAuth: checkAuthStatus
    };
};
