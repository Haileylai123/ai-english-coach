import { Tabs } from 'expo-router';
import { Image, Text, View } from 'react-native';

const PINK = '#e8927f';
const MUTED = '#b8a89a';

const TABS = [
  { name: 'chat',  icon: require('../../assets/icons/nav-chat.png'),  label: 'Chat' },
  { name: 'learn', icon: require('../../assets/icons/fur-bookshelf-v2.png'), label: 'Learn' },
  { name: 'world', icon: require('../../assets/icons/nav-world.png'), label: 'World' },
  { name: 'stats', icon: require('../../assets/icons/nav-stats.png'), label: 'Stats' },
];

export default function TabLayout() {
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: PINK,
      tabBarInactiveTintColor: MUTED,
      tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#f0e0d0', height: 64, paddingTop: 6, paddingBottom: 10 },
      tabBarLabel: ({ focused }) => (
        <Text style={{ fontSize: 10, fontWeight: focused ? '700' : '500', color: focused ? PINK : MUTED, marginTop: 2 }}>
          {TABS.find(t => t.name === route.name)?.label || route.name}
        </Text>
      ),
      tabBarIcon: ({ focused }) => {
        const tab = TABS.find(t => t.name === route.name);
        return (
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: focused ? '#fbe4dc' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={tab?.icon} style={{ width: 28, height: 28, opacity: focused ? 1 : 0.5 }} resizeMode="contain" />
          </View>
        );
      },
    })}>
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="world" />
      <Tabs.Screen name="stats" />
    </Tabs>
  );
}
