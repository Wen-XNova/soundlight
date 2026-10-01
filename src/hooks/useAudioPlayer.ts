import { useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer as useNativeAudioPlayer } from 'expo-audio';
import { SharedValue } from 'react-native-reanimated';

export function useAudioPlayer(fileUri: string, playheadMs?: SharedValue<number>) {
    const player = useNativeAudioPlayer(fileUri);
    const rangeEndMs = useRef<number | null>(null);

    useEffect(() => {
        if (!playheadMs || !player.playing) return;

        const interval = setInterval(() => {
            const currentMs = player.currentTime * 1000;
            playheadMs.value = currentMs;

            if (rangeEndMs.current !== null && currentMs >= rangeEndMs.current) {
                player.pause();
                rangeEndMs.current = null;
            }
        }, 30);

        return () => clearInterval(interval);
    }, [player.playing, playheadMs]);

    const playRange = useCallback((startMs: number, endMs: number) => {
        rangeEndMs.current = endMs;
        player.pause();
        player.seekTo(startMs / 1000);
        player.play();
        if (playheadMs) playheadMs.value = startMs; // snap immediately, don't wait for the poll
    }, [player, playheadMs]);


    const seekTo = useCallback((positionMs: number) => {
        player.seekTo(positionMs / 1000);
        if (playheadMs) {
            playheadMs.value = positionMs;
        }
    }, [player, playheadMs]);

    const pause = useCallback(() => {
        player.pause();
    }, [player]);


    return { isPlaying: player.playing, playRange, pause, seekTo };
}