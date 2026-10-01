import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';
import { getAudioTracks } from '../../db/repository';
import { deleteTrack, importAudioFile } from '../../services/audioImport';
import { styles } from '../../screens/vault.styles';
import { AudioTrack } from '../../types/db';
import { formatDuration } from '../../utils/formatters';

export default function VaultScreen() {
    const [tracks, setTracks] = useState<AudioTrack[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const router = useRouter();

    const loadTracks = () => {
        try {
            const data = getAudioTracks();
            setTracks(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadTracks();
    }, []);

    const handleImport = async () => {
        if (isImporting) return;
        setIsImporting(true);
        try {
            const newTrack = await importAudioFile();
            if (newTrack) {
                loadTracks();
                router.push(`/track/${newTrack.id}` as Href);
            }
        } catch (err) {
            console.error('Import failed:', err);
            Alert.alert('Import Failed', 'Unable to import the selected audio file.');
        } finally {
            setIsImporting(false);
        }
    };

    const confirmDeleteTrack = (track: AudioTrack) => {
        Alert.alert(
            'Delete track?',
            `This permanently deletes "${track.title}" and all its saved excerpts.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteTrack(track);
                        loadTracks();
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: AudioTrack }) => (
        <View style={styles.trackCard}>
            <Pressable style={styles.trackCardInfo} onPress={() => router.push(`/track/${item.id}` as Href)}>
                <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.metadata}>Duration: {formatDuration(item.durationMs)}</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={() => confirmDeleteTrack(item)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.importContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.importButton,
                        isImporting && styles.importButtonDisabled,
                        pressed && !isImporting && styles.importButtonPressed,
                    ]}
                    onPress={handleImport}
                    disabled={isImporting}
                >
                    <Text style={styles.importButtonText}>
                        {isImporting ? 'Importing Audio...' : 'Import Audio File'}
                    </Text>
                </Pressable>
            </View>

            <FlatList
                data={tracks}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Vault is empty.</Text>
                        <Text style={styles.emptySubtext}>Import an audio file to begin.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}