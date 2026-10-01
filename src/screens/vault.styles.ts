import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3A2723', 
    },
    importContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 24,
    },
    importButton: {
        backgroundColor: '#E06A55',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    importButtonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    importButtonDisabled: {
        backgroundColor: '#2B1C18',
        borderColor: '#483229',
        borderWidth: 1,
    },
    importButtonText: {
        color: '#FCE3D6',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
        flexGrow: 1,
    },
    trackCard: {
        backgroundColor: '#4E372E', 
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#6E4A3F',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    trackCardInfo: {
        flex: 1,
        marginRight: 12,
    },
    deleteButton: {
        backgroundColor: '#681A0B',
        borderColor: '#8B2613',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    deleteButtonText: {
        color: '#F7B2A3',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    title: {
        color: '#FCE3D6', 
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    metadata: {
        color: '#DDA185', 
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: '#FCE3D6',
        fontSize: 18,
        fontWeight: '600',
    },
    emptySubtext: {
        color: '#CBB2A3',
        fontSize: 14,
        marginTop: 8,
    },
});