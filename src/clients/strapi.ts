import { strapi } from '@strapi/client';

const CMS_PATH = import.meta.env.PUBLIC_CMS_PATH;
const CMS_API_KEY = import.meta.env.CMS_API_KEY;

export const strapiClient = strapi({
    baseURL: `${CMS_PATH}/api`,
    auth: CMS_API_KEY
});

export interface RegisterData {

    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export const registerUser = async (userData: RegisterData) => {
    try {
        const response = await fetch(`${CMS_PATH}/api/custom-auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.email,
                email: userData.email,
                password: userData.password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error?.message || 'Der opstod en fejl ved oprettelse af brugeren'
            };
        }

        return { success: true, data };
    } catch (error: any) {
        return {
            success: false,
            error: 'Der opstod en fejl ved oprettelse af brugeren'
        };
    }
};

export const loginUser = async (loginData: LoginData) => {
    try {
        const response = await fetch(`${CMS_PATH}/api/auth/local`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier: loginData.email,
                password: loginData.password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error?.message || 'Forkert email eller adgangskode'
            };
        }

        // Store JWT token for authenticated requests
        if (data.jwt) {
            localStorage.setItem('volunteer_jwt', data.jwt);
            localStorage.setItem('volunteer_user', JSON.stringify(data.user));
        }

        return { success: true, data };
    } catch (error: any) {
        return {
            success: false,
            error: 'Der opstod en fejl ved login'
        };
    }
};

export const logoutUser = () => {
    localStorage.removeItem('volunteer_jwt');
    localStorage.removeItem('volunteer_user');
};

export const isUserLoggedIn = (): boolean => {
    return !!localStorage.getItem('volunteer_jwt');
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('volunteer_user');
    return userStr ? JSON.parse(userStr) : null;
};
