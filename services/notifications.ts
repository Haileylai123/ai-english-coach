// services/notifications.ts — Local notification scheduling
// Uses expo-notifications. Falls back to no-op if not installed.

import { Platform } from 'react-native';

let Notifications: any = null;
try {
  // Dynamic require so the app doesn't crash if package not installed
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Notifications = require('expo-notifications');
} catch {
  Notifications = null;
}

let scheduled = false;

export async function initNotifications(): Promise<boolean> {
  if (!Notifications) {
    console.warn('[notifications] expo-notifications not installed — using stub');
    return false;
  }
  try {
    // Configure handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('[notifications] permission not granted');
      return false;
    }

    // Configure channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance?.HIGH ?? 4,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B6B',
      });
    }
    return true;
  } catch (e) {
    console.warn('[notifications] init failed', e);
    return false;
  }
}

export async function scheduleStreakReminder(hour: number = 20, minute: number = 0) {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    // Daily trigger at hour:minute
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 今日學咗未？',
        body: '保持 streak 唔好斷！5 分鐘就可以。',
        data: { type: 'streak' },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
    scheduled = true;
  } catch (e) {
    console.warn('[notifications] scheduleStreakReminder failed', e);
  }
}

export async function scheduleReviewReminder(dueCount: number) {
  if (!Notifications || dueCount <= 0) return;
  try {
    // In 1 hour
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 有生字要複習',
        body: `${dueCount} 個生字到期啦！`,
        data: { type: 'review' },
      },
      trigger: {
        seconds: 60 * 60, // 1 hour
      },
    });
  } catch (e) {
    console.warn('[notifications] scheduleReviewReminder failed', e);
  }
}

export async function sendMotivational(message: string) {
  if (!Notifications) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ English Coach',
        body: message,
      },
      trigger: {
        seconds: 5,
      },
    });
  } catch (e) {
    console.warn('[notifications] sendMotivational failed', e);
  }
}

export async function cancelAll() {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}

export function isAvailable() {
  return Notifications !== null;
}
