import "../global.css";
import { Slot } from "expo-router";
import { ClerkProvider, useAuth, ClerkLoaded } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import English from "../translations/en.json";
import German from "../translations/de.json";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const i18n = new I18n({
  en: English,
  de: German,
});

i18n.locale = getLocales()[0].languageCode;
// to translate use i18n.t("key")

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL);

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function Layout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ClerkLoaded>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Slot />
          </GestureHandlerRootView>
        </ClerkLoaded>
      </ConvexProviderWithClerk>
      <StatusBar style="auto" />
    </ClerkProvider>
  );
}
