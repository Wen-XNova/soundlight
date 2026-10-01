import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { File } from 'expo-file-system';
import { useSharedValue } from 'react-native-reanimated';
import { excerptRepo } from '../../db/client';
import { getAudioTrackById } from '../../db/repository';
import { SaveExcerptModal } from '../../components/SaveExcerptModal';
import { WaveformCanvas } from '../../components/waveform/WaveformCanvas';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { styles } from '../../screens/track-detail.styles';
import { AudioTrack, Excerpt } from '../../types/db';
import { formatDuration } from '../../utils/formatters';

export default function TrackScreen() {
    const playheadMs = useSharedValue(0);
    const { id, seekTo } = useLocalSearchParams<{ id: string; seekTo?: string }>();

    const [track, setTrack] = useState<AudioTrack | null>(null);
    const [peaks, setPeaks] = useState<number[]>([]);
    const [excerpts, setExcerpts] = useState<Excerpt[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selection, setSelection] = useState({ startMs: 0, endMs: 5000 });

    const { isPlaying, playRange, pause, seekTo: seekToMs } = useAudioPlayer(track?.fileUri || '', playheadMs);

    useEffect(() => {
        if (!id) return;
        let isMounted = true;

        async function loadTrackData() {
            try {
                const fetchedTrack = await getAudioTrackById(id);
                if (!fetchedTrack || !isMounted) return;

                setTrack(fetchedTrack);
                setSelection({ startMs: 0, endMs: Math.min(5000, fetchedTrack.durationMs) });

                if (fetchedTrack.waveformCachePath) {
                    const cacheFile = new File(fetchedTrack.waveformCachePath);
                    if (cacheFile.exists) {
                        const parsedPeaks = JSON.parse(await cacheFile.text());
                        if (isMounted && Array.isArray(parsedPeaks)) {
                            setPeaks(parsedPeaks);
                        }
                    }
                }

                const fetchedExcerpts = await excerptRepo.getExcerptsByTrackId(id);
                if (isMounted) {
                    setExcerpts(fetchedExcerpts || []);
                }
            } catch (error) {
                console.error('Failed to load track data:', error);
            }
        }

        loadTrackData();
        return () => {
            isMounted = false;
        };
    }, [id]);

    useEffect(() => {
        if (seekTo && track) {
            const targetMs = Number(seekTo);
            seekToMs(targetMs);
            setSelection({
                startMs: targetMs,
                endMs: Math.min(targetMs + 10000, track.durationMs),
            });
        }
    }, [seekTo, track, seekToMs]);

    const confirmDeleteExcerpt = (item: Excerpt) => {
        Alert.alert('Delete excerpt?', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await excerptRepo.deleteExcerpt(item.id);
                    setExcerpts((prev) => prev.filter((e) => e.id !== item.id));
                },
            },
        ]);
    };

    const handleSaveExcerpt = async (note: string, startMs: number, endMs: number) => {
        if (!track) return;
        const newExcerpt: Excerpt = {
            id: `excerpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            trackId: track.id,
            startTimeMs: startMs,
            endTimeMs: endMs,
            note,
            createdAt: Date.now(),
        };
        try {
            await excerptRepo.createExcerpt(newExcerpt);
            setExcerpts((prev) => [newExcerpt, ...prev]);
        } catch (error) {
            console.error('Failed to persist excerpt:', error);
        } finally {
            setModalVisible(false);
        }
    };

    if (!track) {
        return <View style={styles.container} />;
    }

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom', 'top']}>
            <Stack.Screen options={{ title: track.title }} />

            <WaveformCanvas
                peaks={peaks.length > 0 ? peaks : Array(100).fill(0.1)}
                durationMs={track.durationMs}
                onSelectionChange={(startMs, endMs) => {
                    setSelection({ startMs, endMs });
                    if (isPlaying) playRange(startMs, endMs);
                }}
                playheadMs={playheadMs}
            />

            <View style={styles.transportContainer}>
                <Text style={styles.selectionRangeText}>
                    {formatDuration(selection.startMs)} - {formatDuration(selection.endMs)}
                </Text>

                <View style={styles.buttonRow}>
                    <Pressable style={styles.playButton} onPress={() => playRange(selection.startMs, selection.endMs)}>
                        <Text style={styles.playButtonText}>PLAY</Text>
                    </Pressable>
                    <Pressable style={styles.pauseButton} onPress={pause}>
                        <Text style={styles.pauseButtonText}>PAUSE</Text>
                    </Pressable>
                </View>

                <Pressable style={styles.saveButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.saveButtonText}>SAVE EXCERPT</Text>
                </Pressable>
            </View>

            <FlatList
                data={excerpts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <View style={styles.excerptItem}>
                        <Pressable
                            style={styles.excerptItemInfo}
                            onPress={() => playRange(item.startTimeMs, item.endTimeMs)}
                        >
                            <Text style={styles.excerptTimeText}>
                                {formatDuration(item.startTimeMs)} - {formatDuration(item.endTimeMs)}
                            </Text>
                            <Text style={styles.excerptNoteText}>{item.note || 'No note added'}</Text>
                        </Pressable>
                        <Pressable style={styles.deleteButton} onPress={() => confirmDeleteExcerpt(item)}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </Pressable>
                    </View>
                )}
            />

            <SaveExcerptModal
                visible={isModalVisible}
                startMs={selection.startMs}
                endMs={selection.endMs}
                maxMs={track.durationMs}
                onSave={handleSaveExcerpt}
                onCancel={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
}