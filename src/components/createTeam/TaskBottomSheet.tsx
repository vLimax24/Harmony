import React, { useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  FlatList,
} from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useForm, Controller } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { Trash2, Pencil, Plus } from "lucide-react-native";
import { i18n } from "@/lib/i18n";
import {
  WashingMachine,
  Dog,
  Cat,
  Utensils,
  Beef,
  Wrench,
  Hammer,
  Drill,
  Paintbrush,
  CookingPot,
  Stamp,
  Bone,
} from "lucide-react-native";

const getIconComponent = (iconName, size) => {
  const iconProps = { size, color: "#E9E8E8" };
  switch (iconName) {
    case "WashingMachine":
      return <WashingMachine {...iconProps} />;
    case "Dog":
      return <Dog {...iconProps} />;
    case "Cat":
      return <Cat {...iconProps} />;
    case "Utensils":
      return <Utensils {...iconProps} />;
    case "Beef":
      return <Beef {...iconProps} />;
    case "Wrench":
      return <Wrench {...iconProps} />;
    case "Hammer":
      return <Hammer {...iconProps} />;
    case "Drill":
      return <Drill {...iconProps} />;
    case "Paintbrush":
      return <Paintbrush {...iconProps} />;
    case "CookingPot":
      return <CookingPot {...iconProps} />;
    case "Stamp":
      return <Stamp {...iconProps} />;
    case "Bone":
      return <Bone {...iconProps} />;
    default:
      return null;
  }
};

export const TaskBottomSheet = ({
  setSelectedDay,
  control,
  handleSubmit,
  errors,
  setValue,
  getValues,
  handleSaveTask,
  data,
  bottomSheetRef,
}) => {
  const snapPoints = ["65%"];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setValue("icon", item.name)}
      style={[
        styles.iconContainer,
        item.name === getValues("icon") && styles.selectedIconContainer,
      ]}
    >
      {item.name === getValues("icon") && (
        <LinearGradient
          colors={["#4CC3A4", "#8CDF9B"]}
          style={styles.gradientBorder}
          start={[0, 1]}
          end={[1, 0]}
        />
      )}
      {item.icon(40)}
    </TouchableOpacity>
  );

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onClose={() => {
          setSelectedDay(null);
        }}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#1D1F24" }}
        handleIndicatorStyle={{ backgroundColor: "#E9E8E8" }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            enableTouchThrough={false}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            style={[
              { backgroundColor: "rgba(0, 0, 0, 1)" },
              StyleSheet.absoluteFillObject,
            ]}
          />
        )}
      >
        <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
          <Text
            style={{
              color: "#E9E8E8",
              fontWeight: "bold",
              fontSize: 15,
              marginBottom: 8,
            }}
          >
            {i18n.t("Dashboard.groups.createGroup.labelName")}
          </Text>
          <Controller
            control={control}
            name="taskName"
            rules={{
              required: i18n.t(
                "Dashboard.groups.createGroup.errors.taskRequired"
              ),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={i18n.t(
                  "Dashboard.groups.createGroup.taskPlaceholder"
                )}
                placeholderTextColor="#9E9E9E"
                cursorColor={"#E9E8E8"}
                className="bg-background"
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  color: "#E9E8E8",
                  marginBottom: 8,
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.taskName && (
            <Text style={styles.errorText}>{errors.taskName.message}</Text>
          )}

          <Text
            style={{
              color: "#E9E8E8",
              fontWeight: "bold",
              fontSize: 15,
              marginBottom: 6,
            }}
          >
            {i18n.t("Dashboard.groups.createGroup.labelFrequency")}
          </Text>
          <Controller
            control={control}
            name="frequency"
            rules={{
              required: i18n.t(
                "Dashboard.groups.createGroup.errors.frequencyRequired"
              ),
              pattern: {
                value: /^[1-9]|10$/,
                message: i18n.t(
                  "Dashboard.groups.createGroup.errors.frequencyPattern"
                ),
              },
              min: {
                value: 1,
                message: i18n.t(
                  "Dashboard.groups.createGroup.errors.frequencyMin"
                ),
              },
              max: {
                value: 10,
                message: i18n.t(
                  "Dashboard.groups.createGroup.errors.frequencyMax"
                ),
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="1"
                placeholderTextColor="#9E9E9E"
                cursorColor={"#E9E8E8"}
                keyboardType="numeric"
                className="bg-background"
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  color: "#E9E8E8",
                  marginBottom: 6,
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.frequency && (
            <Text style={styles.errorText}>{errors.frequency.message}</Text>
          )}

          <Text
            style={{
              color: "#E9E8E8",
              fontWeight: "bold",
              fontSize: 15,
              marginBottom: 6,
            }}
          >
            {i18n.t("Dashboard.groups.createGroup.labelIcon")}
          </Text>
          <Controller
            control={control}
            name="icon"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                numColumns={3}
                columnWrapperStyle={styles.grid}
                scrollEnabled={false}
              />
            )}
          />
          {errors.icon && (
            <Text style={styles.errorText}>
              {i18n.t("Dashboard.groups.createGroup.errorIcon")}
            </Text>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: "#1D1F24",
              paddingHorizontal: 16,
              paddingVertical: 20,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 16,
            }}
            onPress={handleSubmit(handleSaveTask)}
          >
            <LinearGradient
              colors={["#4CC3A4", "#8CDF9B"]}
              style={styles.gradientBorder}
              start={[0, 1]}
              end={[1, 0]}
            />
            <Text style={{ color: "#E9E8E8", fontWeight: "bold" }}>
              {i18n.t("Dashboard.groups.createGroup.saveTaskButton")}
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 0,
    pointerEvents: "auto",
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#131417",
    margin: 4,
    padding: 0,
    aspectRatio: 1,
    borderRadius: 12,
  },
  selectedIconContainer: {
    borderColor: "transparent",
  },
  gradientBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    zIndex: -1,
  },
  grid: {
    justifyContent: "space-between",
  },
  errorText: {
    color: "#FF6D6D",
    marginBottom: 8,
  },
});
