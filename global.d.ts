// This file is used for .env typings.
declare namespace NodeJS {
    export interface ProcessEnv {
        DATABASE_URL: string;
        CLIENT_TOKEN: string;
        CLIENT_ID: string;
        OWNER_ID: string;
    }
}