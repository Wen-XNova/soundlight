import * as SQLite from 'expo-sqlite';
import { INIT_SCHEMA_SQL } from './schema';
import { ExcerptRepository } from './excerptRepository';

export const db = SQLite.openDatabaseSync('excerpt_vault.db');
export const excerptRepo = new ExcerptRepository(db);

export function initializeDatabase() {
    try {
        db.execSync(INIT_SCHEMA_SQL);
        console.log('Database architecture initialized successfully.');
    } catch (error) {
        console.error('Critical failure during database execution:', error);
        throw error;
    }
}