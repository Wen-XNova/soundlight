import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { extractAudioPeaks } from './audioExtractor';
import { insertAudioTrack, deleteAudioTrack } from '../db/repository';
import { AudioTrack } from '../types/db';

export async function importAudioFile(): Promise<AudioTrack | null> {
    const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets[0]) {
        return null;
    }

    const asset = result.assets[0];

    const trackId = `track_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fileExtension = asset.name.split('.').pop() || 'mp3';

    const permanentFile = new File(Paths.document, `${trackId}.${fileExtension}`);
    const tempFile = new File(asset.uri);

    copyFileInChunks(tempFile, permanentFile);

    const copiedFile = new File(permanentFile.uri);
    if (!copiedFile.exists || copiedFile.size === 0 || (asset.size != null && copiedFile.size !== asset.size)) {
        if (copiedFile.exists) copiedFile.delete();
        throw new Error(
            `Import failed: copied file size (${copiedFile.exists ? copiedFile.size : 0}) did not match source (${asset.size ?? 'unknown'}).`
        );
    }

    try {
        tempFile.delete();
    } catch {
    }

    const { peaks, durationMs } = await extractAudioPeaks(permanentFile.uri, 100);

const waveformFile = new File(Paths.document, `${trackId}_peaks.json`);
waveformFile.write(JSON.stringify(peaks));

const newTrack: AudioTrack = {
    id: trackId,
    title: asset.name.replace(/\.[^/.]+$/, ''),
    fileUri: permanentFile.uri,
    durationMs,
    waveformCachePath: waveformFile.uri,
    createdAt: Date.now(),
};

insertAudioTrack(newTrack);
return newTrack;
}

function copyFileInChunks(source: File, destination: File, chunkSize = 16 * 1024 * 1024): void {
    const readHandle = source.open();
    if (destination.exists) destination.delete();
    destination.create();
    const writeHandle = destination.open();

    try {
        while (readHandle.offset !== null && readHandle.size !== null && readHandle.offset < readHandle.size) {
            const remaining = readHandle.size - readHandle.offset;
            const chunk = readHandle.readBytes(Math.min(chunkSize, remaining));
            writeHandle.writeBytes(chunk);
        }
    } finally {
        readHandle.close();
        writeHandle.close();
    }
}

export function deleteTrack(track: AudioTrack): void {
    try {
        new File(track.fileUri).delete();
    } catch (error) {
        console.warn('Could not delete audio file:', error);
    }
    if (track.waveformCachePath) {
        try {
            new File(track.waveformCachePath).delete();
        } catch (error) {
            console.warn('Could not delete waveform cache:', error);
        }
    }
    deleteAudioTrack(track.id);
}