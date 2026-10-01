import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(20, 10, 8, 0.85)',
        justifyContent: 'center',
        padding: 24
    },
    content: {
        backgroundColor: '#4E372E',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#6E4A3F'
    },
    title: {
        color: '#FCE3D6',
        fontSize: 20,
        fontWeight: 'bold'
    },
    subtitle: {
        color: '#F7B2A3',
        fontSize: 14,
        marginTop: 4,
        marginBottom: 16
    },
    input: {
        backgroundColor: '#3A2723',
        color: '#FCE3D6',
        borderRadius: 8,
        padding: 16,
        height: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#6E4A3F',
        marginBottom: 20
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelButton: {
        backgroundColor: '#681A0B',
        borderWidth: 1,
        borderColor: '#8B2613'
    },
    saveButton: {
        backgroundColor: '#E06A55',
        elevation: 2
    },
    buttonText: {
        color: '#FCE3D6',
        fontWeight: '700',
        letterSpacing: 0.5
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
        marginBottom: 8
    },
    timeField: {
        flex: 1
    },
    timeLabel: {
        color: '#E06A55',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 0.5
    },
    timeInput: {
        backgroundColor: '#3A2723',
        color: '#FCE3D6',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#6E4A3F'
    },
    timeSeparator: {
        color: '#F7B2A3',
        fontSize: 16,
        fontWeight: 'bold',
        paddingBottom: 12
    },
    errorText: {
        color: '#F7B2A3',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 12
    }
});