import { StyleSheet, Dimensions } from 'react-native';

export const CANVAS_HEIGHT = 120;
export const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        height: CANVAS_HEIGHT,
        backgroundColor: '#251714', 
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 4,
        borderColor: '#6E4A3F', 
        marginHorizontal: 16,
        overflow: 'hidden',
    },
});