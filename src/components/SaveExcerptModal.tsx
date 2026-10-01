import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { formatDuration, parseDuration } from '../utils/formatters';
import { styles } from './SaveExcerptModal.styles';

interface SaveExcerptModalProps {
    visible: boolean;
    startMs: number;
    endMs: number;
    maxMs: number;
    onSave: (note: string, startMs: number, endMs: number) => void;
    onCancel: () => void;
}

export function SaveExcerptModal({ visible, startMs, endMs, maxMs, onSave, onCancel }: SaveExcerptModalProps) {
    const [note, setNote] = useState('');
    const [startText, setStartText] = useState(formatDuration(startMs));
    const [endText, setEndText] = useState(formatDuration(endMs));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!visible) {
            setStartText(formatDuration(startMs));
            setEndText(formatDuration(endMs));
        }
    }, [startMs, endMs, visible]);

    const handleSave = () => {
        const parsedStart = parseDuration(startText);
        const parsedEnd = parseDuration(endText);

        if (parsedStart === null || parsedEnd === null) {
            setError('Enter times as M:SS or H:MM:SS.');
            return;
        }
        if (parsedStart < 0 || parsedEnd > maxMs) {
            setError(`Times must be between 0:00 and ${formatDuration(maxMs)}.`);
            return;
        }
        if (parsedEnd <= parsedStart) {
            setError('End time must be after start time.');
            return;
        }

        setError(null);
        onSave(note, parsedStart, parsedEnd);
        setNote('');
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.title}>Save Excerpt</Text>

                    <View style={styles.timeRow}>
                        <View style={styles.timeField}>
                            <Text style={styles.timeLabel}>Start</Text>
                            <TextInput style={styles.timeInput} value={startText} onChangeText={setStartText} placeholder="0:00" placeholderTextColor="#64748B" />
                        </View>
                        <Text style={styles.timeSeparator}>-</Text>
                        <View style={styles.timeField}>
                            <Text style={styles.timeLabel}>End</Text>
                            <TextInput style={styles.timeInput} value={endText} onChangeText={setEndText} placeholder="0:00" placeholderTextColor="#64748B" />
                        </View>
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <TextInput style={styles.input} placeholder="Add a note or quote..." placeholderTextColor="#64748B" multiline value={note} onChangeText={setNote} />

                    <View style={styles.buttonRow}>
                        <Pressable style={[styles.button, styles.cancelButton]} onPress={() => { setError(null); setNote(''); onCancel(); }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave}>
                            <Text style={styles.buttonText}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}