import { Redirect } from 'expo-router';
import { useStore } from '../services/store';

export default function Index() {
  const { state } = useStore();
  if (!state.hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(tabs)/chat" />;
}
