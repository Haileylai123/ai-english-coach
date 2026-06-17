import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text style={styles.getStartedText}>
          Open up the code for this screen: {path}
        </Text>
        <Text style={styles.getStartedText}>
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: { alignItems: 'center', marginHorizontal: 50 },
  getStartedText: { fontSize: 17, lineHeight: 24, textAlign: 'center' },
});
