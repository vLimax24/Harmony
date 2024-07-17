import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import QRFooterButton from "./QRFooterButton";
import QRIndicator from "./QRIndicator";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n } from "@/lib/i18n";

export default function BarcodeScanner({ onCancel }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isLit, setLit] = useState(false);
  const { top, bottom } = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    await AsyncStorage.setItem("isNavbarOpen", "false");
    if (scanned) return;
    setScanned(true);
    console.log(`Scanned data: ${data}`);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onCancel());
  };

  const onFlashToggle = useCallback(() => {
    setLit((prev) => !prev);
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [600, 0], // Slide up from bottom
              }),
            },
          ],
        },
      ]}
    >
      <CameraView
        onBarcodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={isLit ? true : false}
      />
      <View style={[styles.header, { top: top + 40 }]}>
        <Hint>{i18n.t("Dashboard.groups.QRCodeHint")}</Hint>
      </View>
      <QRIndicator />
      <View style={[styles.footer, { bottom: bottom + 30 }]}>
        <QRFooterButton
          onPress={onFlashToggle}
          isActive={isLit}
          iconName="flashlight"
        />
        <QRFooterButton onPress={onCancel} iconName="close" iconSize={48} />
      </View>
      <StatusBar style="auto" />
    </Animated.View>
  );
}

function Hint({ children }) {
  return (
    <BlurView style={styles.hint} intensity={100} tint="dark">
      <Text style={styles.headerText}>{children}</Text>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    backgroundColor: "transparent",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "10%",
  },
});
