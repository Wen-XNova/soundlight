import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3A2723', 
        paddingVertical: 20
    },
    transportContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        gap: 12,
        alignItems: 'center'
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12
    },
    playButton: {
        flex: 1,
        backgroundColor: '#E06A55', 
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 4
    },
    playButtonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }]
    },
    playButtonText: {
        color: '#FCE3D6', 
        fontWeight: '700',
        letterSpacing: 1.2
    },
    pauseButton: {
        flex: 1,
        backgroundColor: '#E09F3E', 
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 4
    },
    pauseButtonText: {
        color: '#2B1B17', 
        fontWeight: '700',
        letterSpacing: 1.2
    },
    saveButton: {
        backgroundColor: '#4E372E', 
        borderColor: '#6E4A3F',
        borderWidth: 1,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center'
    },
    saveButtonText: {
        color: '#FCE3D6',
        fontWeight: '600'
    },
    listContainer: {
        paddingHorizontal: 24,
        paddingTop: 12
    },
    excerptItem: {
        backgroundColor: '#4E372E',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#6E4A3F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    excerptItemInfo: {
        flex: 1,
        marginRight: 12
    },
    deleteButton: {
        backgroundColor: '#681A0B',
        borderColor: '#8B2613',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteButtonText: {
        color: '#F7B2A3',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5
    },
    excerptTimeText: {
        color: '#E06A55', 
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4
    },
    excerptNoteText: {
        color: '#FCE3D6',
        fontSize: 14
    },
    selectionRangeText: {
        color: '#FCE3D6',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.5
    },
});