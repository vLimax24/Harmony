import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, Button, View } from "react-native";
import React from "react";
import { GoogleAuth } from "@/components/auth/oAuth/GoogleAuth";
import { AppleAuth } from "@/components/auth/oAuth/AppleAuth";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/dashboard");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View className="p-8">
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        className="mb-2"
      />
      <TextInput
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        className="mb-2"
      />
      <Button title="Sign In" onPress={onSignInPress} />
      <View>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text className="text-blue-500">Sign up</Text>
        </Link>
      </View>
      <View className="flex flex-row items-center my-4">
        <View className="flex-1 h-0.5 bg-black" />
        <Text className="mx-2">or</Text>
        <View className="flex-1 h-0.5 bg-black" />
      </View>
      <View className="flex flex-row gap-2">
        <GoogleAuth />
        <AppleAuth />
      </View>
    </View>
  );
}
