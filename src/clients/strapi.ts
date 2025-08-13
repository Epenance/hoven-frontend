import { strapi } from '@strapi/client';

const CMS_PATH = import.meta.env.PUBLIC_CMS_PATH;
const CMS_API_KEY = import.meta.env.CMS_API_KEY;

export const strapiClient = strapi({
    baseURL: `${CMS_PATH}/api`,
    auth: CMS_API_KEY
});

export interface RegisterData {
    firstname: string;
    surname: string;
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
                firstname: userData.firstname,
                surname: userData.surname,
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
