import { Tabs } from 'expo-router';
import { Image, Text, View, StyleSheet } from 'react-native';

const PINK = '#e8927f';
const INK = '#3d3028';
const MUTED = '#b8a89a';

const ICON_SRC: Record<string, any> = {
  chat: require('../../assets/icons/nav-chat.png'),
  world: require('../../assets/icons/nav-world.png'),
  learn: require('../../assets/icons/stat-medal.png'),
  vocab: require('../../assets/icons/stat-vocabulary.png'),
  games: require('../../assets/icons/nav-games.png'),
  stats: require('../../assets/icons/nav-stats.png'),
};

const LABELS: Record<string, string> = {
  chat: 'Chat',
  world: 'World',
  learn: 'Learn',
  vocab: 'Vocab',
  games: 'Games',
  stats: 'Stats',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: PINK,
        tabBarInactiveTintColor: MUTED,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f0e0d0',
          height: 70,
          paddingTop: 8,
          paddingBottom: 14,
        },
        tabBarLabel: ({ focused }) => (
          <Text style={{
            fontSize: 10,
            fontWeight: focused ? '700' : '500',
            color: focused ? PINK : MUTED,
            marginTop: 4,
          }}>
            {LABELS[route.name] || route.name}
          </Text>
        ),
        tabBarIcon: ({ focused }) => {
          const isGames = route.name === 'games';
          const box = isGames ? 56 : 48;
          const img = isGames ? 46 : 38;
          return (
          <View style={{
            width: box, height: box, borderRadius: 14,
            backgroundColor: focused ? '#fbe4dc' : 'transparent',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Image
              source={ICON_SRC[route.name]}
              style={{
                width: img, height: img,
                opacity: focused ? 1 : 0.55,
              }}
              resizeMode="contain"
            />
          </View>
          );
        },
      })}>
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="world" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="vocab" />
      <Tabs.Screen name="games" />
      <Tabs.Screen name="stats" />
    </Tabs>
  );
}
