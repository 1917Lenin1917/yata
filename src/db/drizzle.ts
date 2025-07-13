/* tslint:disable */
import {drizzle, LibSQLDatabase} from 'drizzle-orm/libsql';
import * as schema from './schema';
import { config } from 'dotenv';

config({ path: '.env' });

// @ts-ignore
export const db: LibSQLDatabase<typeof schema> = drizzle({
    connection: { url: process.env.DB_FILE_NAME! },
    schema
});
