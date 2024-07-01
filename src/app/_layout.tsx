import "../global.css";
import { Slot } from "expo-router";
import { ClerkProvider, useAuth, ClerkLoaded } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { StatusBar } from "expo-status-bar";
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import English from "../translations/en.json";
import German from "../translations/de.json";

const i18n = new I18n({
  en: English,
  de: German,
});

i18n.locale = getLocales()[0].languageCode;
// to translate use i18n.t("key")

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL);
export default function Layout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ClerkLoaded>
          <Slot />
        </ClerkLoaded>
      </ConvexProviderWithClerk>
      <StatusBar style="auto" />
    </ClerkProvider>
  );
}
