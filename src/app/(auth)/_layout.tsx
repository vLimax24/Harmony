import { Redirect, Slot } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/dashboard/groups/create"} />;
  }

  return <Slot />;
}
