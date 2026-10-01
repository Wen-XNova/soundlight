import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3A2723', 
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#5C3E35',
    },
    searchInput: {
        backgroundColor: '#4E372E',
        color: '#FCE3D6',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#6E4A3F',
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    resultCard: {
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
    resultCardInfo: {
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
    },
    deleteButtonText: {
        color: '#F7B2A3',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    trackTitle: {
        color: '#FCE3D6',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 12,
    },
    timestamp: {
        color: '#E06A55', 
        fontSize: 12,
        fontWeight: '700',
    },
    noteText: {
        color: '#DDA185',
        fontSize: 14,
        lineHeight: 20,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        color: '#FCE3D6',
        fontSize: 16,
        fontWeight: '600',
    },
    emptySubtext: {
        color: '#CBB2A3',
        fontSize: 14,
    },
});