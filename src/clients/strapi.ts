import { strapi } from '@strapi/client';

const CMS_PATH = import.meta.env.PUBLIC_CMS_PATH;
const CMS_API_KEY = import.meta.env.CMS_API_KEY;

export const strapiClient = strapi({
    baseURL: `${CMS_PATH}/api`,
    auth: CMS_API_KEY
});
