import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Controller } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { getIconComponent, iconNames } from "@/lib/getIconComponent";
import { i18n } from "@/lib/i18n";

export const TaskForm = ({
  control,
  handleSubmit,
  errors,
  data,
  renderItem,
}) => (
  <>
    <Text style={styles.label}>
      {i18n.t("Dashboard.groups.createGroup.labelName")}
    </Text>
    <Controller
      control={control}
      name="taskName"
      rules={{
        required: i18n.t("Dashboard.groups.createGroup.errors.taskRequired"),
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          placeholder={i18n.t("Dashboard.groups.createGroup.taskPlaceholder")}
          placeholderTextColor="#9E9E9E"
          cursorColor={"#E9E8E8"}
          style={styles.input}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
        />
      )}
    />
    {errors.taskName && (
      <Text style={styles.errorText}>{errors.taskName.message}</Text>
    )}

    <Text style={styles.label}>
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
          message: i18n.t("Dashboard.groups.createGroup.errors.frequencyMin"),
        },
        max: {
          value: 10,
          message: i18n.t("Dashboard.groups.createGroup.errors.frequencyMax"),
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          placeholder="1"
          placeholderTextColor="#9E9E9E"
          cursorColor={"#E9E8E8"}
          keyboardType="numeric"
          style={styles.input}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
        />
      )}
    />
    {errors.frequency && (
      <Text style={styles.errorText}>{errors.frequency.message}</Text>
    )}

    <Text style={styles.label}>
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

    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
      <LinearGradient
        colors={["#4CC3A4", "#8CDF9B"]}
        style={styles.gradientBorder}
        start={[0, 1]}
        end={[1, 0]}
      />
      <Text style={styles.submitButtonText}>
        {i18n.t("Dashboard.groups.createGroup.saveTaskButton")}
      </Text>
    </TouchableOpacity>
  </>
);

const styles = StyleSheet.create({
  label: {
    color: "#E9E8E8",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    color: "#E9E8E8",
    marginBottom: 8,
  },
  errorText: {
    color: "#FF6D6D",
    marginBottom: 8,
  },
  grid: {
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#1D1F24",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#E9E8E8",
    fontWeight: "bold",
  },
  gradientBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    zIndex: -1,
  },
});
