import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#D4AF37', tabBarInactiveTintColor: '#9E7E3B', tabBarStyle: { backgroundColor: '#423117' } }}>
            <Tabs.Screen name="index" options={{ title: 'Vault' }} />
            <Tabs.Screen name="explore" options={{ title: 'Excerpts' }} />
        </Tabs>
    );
}