import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initializeDatabase } from '../db/client';

export default function RootLayout() {
    const [isDbReady, setIsDbReady] = useState(false);

    useEffect(() => {
        try {
            initializeDatabase();
            setIsDbReady(true);
        } catch (e) {
            console.error('DB init failed:', e);
        }
    }, []);

    if (!isDbReady) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="track/[id]" options={{ title: 'Track' }} />
            </Stack>
        </GestureHandlerRootView>
    );
}