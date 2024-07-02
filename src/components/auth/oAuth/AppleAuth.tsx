import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, View } from "react-native";
import { Link } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { Button } from "@/components/ui/Button";
import { Apple } from "@/assets/Icons/Apple";

WebBrowser.maybeCompleteAuthSession();

const AppleAuth = ({ children }: { children?: React.ReactNode }) => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_apple" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/dashboard", { scheme: "myapp" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <Button className="bg-[#eeebee] flex-1" onPress={onPress}>
      <Apple />
    </Button>
  );
};
export { AppleAuth };
