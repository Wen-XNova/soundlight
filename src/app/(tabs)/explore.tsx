import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import { excerptRepo } from '../../db/client';
import { getAllExcerpts, searchExcerpts, SearchResult } from '../../db/repository';
import { styles } from '../../screens/explore.styles';
import { formatDuration } from '../../utils/formatters';

export default function ExploreScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const loadResults = useCallback(async () => {
        setIsSearching(true);
        try {
            const data = !searchQuery.trim()
                ? await getAllExcerpts()
                : await searchExcerpts(searchQuery);
            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const timer = setTimeout(loadResults, 300);
        return () => clearTimeout(timer);
    }, [loadResults]);

    useFocusEffect(
        useCallback(() => {
            loadResults();
        }, [loadResults])
    );

    const confirmDeleteExcerpt = (item: SearchResult) => {
        Alert.alert('Delete excerpt?', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await excerptRepo.deleteExcerpt(item.id);
                    setResults((prev) => prev.filter((r) => r.id !== item.id));
                },
            },
        ]);
    };

    const renderItem = ({ item }: { item: SearchResult }) => (
        <View style={styles.resultCard}>
            <Pressable
                style={styles.resultCardInfo}
                onPress={() => router.push(`/track/${item.trackId}?seekTo=${item.startTimeMs}` as Href)}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.trackTitle} numberOfLines={1}>
                        {item.trackTitle}
                    </Text>
                    <Text style={styles.timestamp}>
                        {formatDuration(item.startTimeMs)} - {formatDuration(item.endTimeMs)}
                    </Text>
                </View>
                <Text style={styles.noteText} numberOfLines={3}>
                    {item.note}
                </Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={() => confirmDeleteExcerpt(item)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search notes and excerpts..."
                    placeholderTextColor="#64748B"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                />
            </View>

            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        {searchQuery.length > 0 && !isSearching ? (
                            <Text style={styles.emptyText}>No matches found for {searchQuery}</Text>
                        ) : (
                            <Text style={styles.emptySubtext}>Type to search across your entire vault.</Text>
                        )}
                    </View>
                }
            />
        </SafeAreaView>
    );
}