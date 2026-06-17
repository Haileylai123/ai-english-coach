import * as WebBrowser from 'expo-web-browser';
import { Platform, TouchableOpacity, Text } from 'react-native';

export function ExternalLink({ href, children }: { href: string; children?: React.ReactNode }) {
  return (
    <TouchableOpacity
      onPress={() => {
        WebBrowser.openBrowserAsync(href);
      }}
    >
      {children}
    </TouchableOpacity>
  );
}
