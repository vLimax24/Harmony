import * as Notifications from "expo-notifications";

export async function schedulePushNotification(title, body, data, seconds) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: data,
    },
    trigger: { seconds: seconds },
  });
}
