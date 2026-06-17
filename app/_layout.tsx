import { Stack } from 'expo-router';
import { StoreProvider, useStore } from '../services/store';
import { I18nProvider } from '../services/i18n';
import { useFonts } from '@expo-google-fonts/nunito';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { Text } from 'react-native';
import { useEffect } from 'react';
import * as backend from '../services/backend';

function BackendInit() {
  const { state, dispatch } = useStore();
  useEffect(() => {
    (async () => {
      try {
        const { user, loggedIn } = await backend.initAuth();
        if (loggedIn && user) {
          dispatch({ type: 'SET_ACCOUNT', payload: { loggedIn: true, user } });
          // Flush any queued sync items
          await backend.flushOfflineQueue();
        }
      } catch (e) {
        // Silent — app still works offline
      }
    })();
  }, []);
  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <StoreProvider>
      <I18nProvider>
        <BackendInit />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="auth" />
          <Stack.Screen name="call-analyzer" options={{ presentation: "modal" }} />
          <Stack.Screen name="cat-charity" options={{ presentation: "modal" }} />
          <Stack.Screen name="paywall" options={{ presentation: "modal" }} />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="srs" />
          <Stack.Screen name="skits" />
          <Stack.Screen name="ted" />
          <Stack.Screen name="history" />
          <Stack.Screen name="leaderboard" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="shop" />
          <Stack.Screen name="daily-challenge" />
        </Stack>
      </I18nProvider>
    </StoreProvider>
  );
}
