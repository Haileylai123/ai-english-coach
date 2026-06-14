import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e8845c',
        tabBarInactiveTintColor: '#b8a89a',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#f0e0d0' },
      }}>
      <Tabs.Screen name="chat" options={{
        title: '💬 對話',
        tabBarIcon: () => <Text style={{ fontSize: 20 }}>💬</Text>,
      }} />
      <Tabs.Screen name="world" options={{
        title: '🌍 世界',
        tabBarIcon: () => <Text style={{ fontSize: 20 }}>🌍</Text>,
      }} />
      <Tabs.Screen name="games" options={{
        title: '🎮 遊戲',
        tabBarIcon: () => <Text style={{ fontSize: 20 }}>🎮</Text>,
      }} />
      <Tabs.Screen name="stats" options={{
        title: '📊 數據',
        tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text>,
      }} />
      <Tabs.Screen name="shop" options={{
        title: '🛍️ 商店',
        tabBarIcon: () => <Text style={{ fontSize: 20 }}>🛍️</Text>,
      }} />
    </Tabs>
  );
}
