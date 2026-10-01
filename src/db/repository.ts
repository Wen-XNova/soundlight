import { db } from './client';
import { AudioTrack } from '../types/db';
import { Excerpt } from '../types/db';

export interface SearchResult extends Excerpt {
    trackTitle: string;
}

export const getAllExcerpts = async (): Promise<SearchResult[]> => {
    const query = `
        SELECT 
            e.id, e.track_id AS trackId, e.start_time_ms AS startTimeMs, 
            e.end_time_ms AS endTimeMs, e.note, e.created_at AS createdAt, 
            t.title AS trackTitle
        FROM excerpts e
        JOIN audio_tracks t ON e.track_id = t.id
        ORDER BY e.created_at DESC
        LIMIT 100;
    `;
    const results = await db.getAllAsync<SearchResult>(query);
    return results || [];
};

export const searchExcerpts = async (searchTerm: string): Promise<SearchResult[]> => {
    const sanitized = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    if (!sanitized) return [];

    const query = `
        SELECT 
            e.id, 
            e.track_id AS trackId, 
            e.start_time_ms AS startTimeMs, 
            e.end_time_ms AS endTimeMs, 
            e.note, 
            e.created_at AS createdAt, 
            t.title AS trackTitle
        FROM excerpts e
        JOIN audio_tracks t ON e.track_id = t.id
        JOIN excerpts_fts fts ON fts.rowid = e.rowid
        WHERE excerpts_fts MATCH ?
        ORDER BY rank
        LIMIT 50;
    `;

    const matchString = `${sanitized}*`;
    const results = await db.getAllAsync<SearchResult>(query, [matchString]);
    return results || [];
};

export function getAudioTracks(): AudioTrack[] {
    return db.getAllSync<AudioTrack>(
        `SELECT id, title, file_uri AS fileUri, duration_ms AS durationMs,
                waveform_cache_path AS waveformCachePath, created_at AS createdAt
         FROM audio_tracks ORDER BY created_at DESC`
    );
}

export function insertAudioTrack(track: AudioTrack): void {
    db.runSync(
        `INSERT INTO audio_tracks (id, title, file_uri, duration_ms, waveform_cache_path, created_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
        [
            track.id,
            track.title,
            track.fileUri,
            track.durationMs,
            track.waveformCachePath ?? null,
            track.createdAt,
        ]
    );
}
export function deleteAudioTrack(id: string): void {
    db.runSync('DELETE FROM audio_tracks WHERE id = ?', [id]);
}
export function getAudioTrackById(id: string): AudioTrack | null {
    return db.getFirstSync<AudioTrack>(
        `SELECT id, title, file_uri AS fileUri, duration_ms AS durationMs,
                waveform_cache_path AS waveformCachePath, created_at AS createdAt
         FROM audio_tracks WHERE id = ?`,
        [id]
    );
}