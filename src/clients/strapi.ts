import { strapi } from '@strapi/client';

export const strapiClient = strapi({ baseURL: 'http://localhost:1337/api', auth: '245f43574f6360e1c6ab91dd4bdadd4af72bd677bc7e0285758e26acee8c6e2fbb9848134a3542d24271a9b8b8187e777c33c5b4bdcd268be6d3aea4933d7ad3c82816064a1f8ad07f2e68ae06c148b66965faf545c8b78cfd427fb72c8d130cb37220fc51a0a39747f19b41848b3ed0d517e5ece8c043577e064281f00b5229' });