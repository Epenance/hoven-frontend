import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { isUserLoggedIn, getCurrentUser, logoutUser } from '../clients/strapi';

export interface User {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
    getAuthToken: () => string | null;
    refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
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

    const value: AuthContextType = {
        isLoggedIn,
        user,
        isLoading,
        login,
        logout,
        getAuthToken,
        refreshAuth: checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
