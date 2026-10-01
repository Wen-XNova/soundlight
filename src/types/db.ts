export interface AudioTrack {
    id: string;
    title: string;
    fileUri: string;
    durationMs: number;
    waveformCachePath?: string;
    createdAt: number;
}

export interface Tag {
    id: string;
    name: string;
    colorHex: string;
}

export interface Excerpt {
    id: string;
    trackId: string;
    startTimeMs: number;
    endTimeMs: number;
    note: string;
    createdAt: number;
    tags?: Tag[];
}