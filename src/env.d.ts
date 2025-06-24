interface ImportMetaEnv {
    // readonly DB_PASSWORD: string;
    readonly PUBLIC_CMS_PATH: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}