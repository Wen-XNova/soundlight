export const INIT_SCHEMA_SQL = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS audio_tracks (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    file_uri TEXT NOT NULL,
    duration_ms INTEGER NOT NULL,
    waveform_cache_path TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS excerpts (
    id TEXT PRIMARY KEY NOT NULL,
    track_id TEXT NOT NULL,
    start_time_ms INTEGER NOT NULL,
    end_time_ms INTEGER NOT NULL,
    note TEXT DEFAULT '',
    created_at INTEGER NOT NULL,
    FOREIGN KEY (track_id) REFERENCES audio_tracks(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT UNIQUE NOT NULL,
    color_hex TEXT NOT NULL DEFAULT '#3B82F6'
  );

  CREATE TABLE IF NOT EXISTS excerpt_tags (
    excerpt_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (excerpt_id, tag_id),
    FOREIGN KEY (excerpt_id) REFERENCES excerpts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_excerpts_track_id ON excerpts(track_id);
  CREATE INDEX IF NOT EXISTS idx_excerpts_range ON excerpts(track_id, start_time_ms, end_time_ms);

  CREATE VIRTUAL TABLE IF NOT EXISTS excerpts_fts USING fts5(
    excerpt_id UNINDEXED,
    note,
    content='excerpts',
    content_rowid='rowid'
  );

  -- FTS Sync Triggers
  CREATE TRIGGER IF NOT EXISTS excerpts_ai AFTER INSERT ON excerpts BEGIN
    INSERT INTO excerpts_fts(rowid, note) VALUES (new.rowid, new.note);
  END;

  CREATE TRIGGER IF NOT EXISTS excerpts_ad AFTER DELETE ON excerpts BEGIN
    INSERT INTO excerpts_fts(excerpts_fts, rowid, note) VALUES('delete', old.rowid, old.note);
  END;

  CREATE TRIGGER IF NOT EXISTS excerpts_au AFTER UPDATE ON excerpts BEGIN
    INSERT INTO excerpts_fts(excerpts_fts, rowid, note) VALUES('delete', old.rowid, old.note);
    INSERT INTO excerpts_fts(rowid, note) VALUES (new.rowid, new.note);
  END;
`;