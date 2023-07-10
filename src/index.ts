import { config } from 'dotenv';
import ExtendedClient from './class/ExtendedClient';

config();

export const client = new ExtendedClient();

client.start();

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);