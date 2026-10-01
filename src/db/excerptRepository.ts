import * as Crypto from 'expo-crypto';
import { SQLiteDatabase } from 'expo-sqlite';
import { Excerpt } from '../types/db';
import { QUERY_EXCERPTS_BY_TRACK } from './queries';

export class ExcerptRepository {
    private db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    async createExcerpt(params: { trackId: string; startTimeMs: number; endTimeMs: number; note: string }): Promise<void> {
        if (!Number.isFinite(params.startTimeMs) || !Number.isFinite(params.endTimeMs)) {
            throw new Error(`createExcerpt received invalid times: startTimeMs=${params.startTimeMs}, endTimeMs=${params.endTimeMs}`);
        }
        const id = Crypto.randomUUID();
        const createdAt = Date.now();

        await this.db.runAsync(
            'INSERT INTO excerpts (id, track_id, start_time_ms, end_time_ms, note, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [id, params.trackId, params.startTimeMs, params.endTimeMs, params.note, createdAt]
        );
    }

    async deleteExcerpt(id: string): Promise<void> {
        await this.db.runAsync('DELETE FROM excerpts WHERE id = ?', [id]);
    }

    async getExcerptsByTrackId(trackId: string): Promise<Excerpt[]> {
        const rows = await this.db.getAllAsync<any>(QUERY_EXCERPTS_BY_TRACK, [trackId]);

        return rows.map((row) => ({
            id: row.id,
            trackId: row.track_id,
            startTimeMs: row.start_time_ms,
            endTimeMs: row.end_time_ms,
            note: row.note,
            createdAt: row.created_at,
            tags: JSON.parse(row.tags || '[]')
        }));
    }
}