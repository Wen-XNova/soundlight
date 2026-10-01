import React, { useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Canvas, Group, Path, Rect, Skia } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SharedValue, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { CANVAS_HEIGHT, styles } from './WaveformCanvas.styles';

interface WaveformCanvasProps {
    peaks: number[];
    durationMs: number;
    onSelectionChange?: (startMs: number, endMs: number) => void;
    playheadMs?: SharedValue<number>;
}

const HANDLE_HIT_SLOP = 40;
const MIN_SELECTION_PX = 10;

export function WaveformCanvas({ peaks, durationMs, onSelectionChange, playheadMs }: WaveformCanvasProps) {
    const { width: windowWidth } = useWindowDimensions();
    const [screenWidth, setScreenWidth] = useState(windowWidth);

    const startRatio = useSharedValue(0);
    const endRatio = useSharedValue(0.3);
    const activeHandle = useSharedValue<'left' | 'right' | 'none'>('none');

    const barWidth = screenWidth / (peaks.length || 1);

    const waveformPath = useMemo(() => {
        const path = Skia.Path.Make();
        peaks.forEach((amplitude, index) => {
            const x = index * barWidth;
            const barHeight = Math.max(4, amplitude * CANVAS_HEIGHT);
            const y = (CANVAS_HEIGHT - barHeight) / 2;
            path.addRect(Skia.XYWHRect(x, y, Math.max(1, barWidth - 1), barHeight));
        });
        return path;
    }, [peaks, barWidth]);

    const notifySelectionChange = (startPct: number, endPct: number) => {
        if (!onSelectionChange) return;
        onSelectionChange(Math.round(startPct * durationMs), Math.round(endPct * durationMs));
    };

    const panGesture = Gesture.Pan()
        .onBegin((event) => {
            'worklet';
            const touchX = event.x;
            const startPx = startRatio.value * screenWidth;
            const endPx = endRatio.value * screenWidth;

            const distToStart = Math.abs(touchX - startPx);
            const distToEnd = Math.abs(touchX - endPx);

            if (distToStart < HANDLE_HIT_SLOP && distToStart <= distToEnd) {
                activeHandle.value = 'left';
            } else if (distToEnd < HANDLE_HIT_SLOP) {
                activeHandle.value = 'right';
            } else {
                activeHandle.value = 'none';
            }
        })
        .onChange((event) => {
            'worklet';
            const ratioChange = event.changeX / screenWidth;
            const minRatioGap = MIN_SELECTION_PX / screenWidth;

            if (activeHandle.value === 'left') {
                startRatio.value = Math.max(0, Math.min(endRatio.value - minRatioGap, startRatio.value + ratioChange));
            } else if (activeHandle.value === 'right') {
                endRatio.value = Math.max(startRatio.value + minRatioGap, Math.min(1, endRatio.value + ratioChange));
            }
        })
        .onEnd(() => {
            'worklet';
            if (activeHandle.value !== 'none') {
                activeHandle.value = 'none';
                scheduleOnRN(notifySelectionChange, startRatio.value, endRatio.value);
            }
        });

    const selectionStartPx = useDerivedValue(() => startRatio.value * screenWidth);
    const selectionWidthPx = useDerivedValue(() => (endRatio.value - startRatio.value) * screenWidth);
    const selectionEndPx = useDerivedValue(() => endRatio.value * screenWidth);

    const handleStartPx = useDerivedValue(() => selectionStartPx.value - 2);
    const handleEndPx = useDerivedValue(() => selectionEndPx.value - 2);

    const playheadPx = useDerivedValue(() => {
        if (!playheadMs || durationMs === 0) return 0;
        return (playheadMs.value / durationMs) * screenWidth;
    });

    return (
        <View style={styles.container} onLayout={(e) => setScreenWidth(e.nativeEvent.layout.width)}>
            <GestureDetector gesture={panGesture}>
                <Canvas style={{ width: screenWidth, height: CANVAS_HEIGHT }}>
                    <Group>
                        <Path path={waveformPath} color="#C59B6A" />
                        <Rect x={selectionStartPx} y={0} width={selectionWidthPx} height={CANVAS_HEIGHT} color="rgba(224, 106, 85, 0.35)" />
                        <Rect x={handleStartPx} y={0} width={4} height={CANVAS_HEIGHT} color="#E06A55" />
                        <Rect x={handleEndPx} y={0} width={4} height={CANVAS_HEIGHT} color="#E06A55" />
                        {playheadMs && <Rect x={playheadPx} y={0} width={2} height={CANVAS_HEIGHT} color="#E09F3E" />}
                    </Group>
                </Canvas>
            </GestureDetector>
        </View>
    );
}