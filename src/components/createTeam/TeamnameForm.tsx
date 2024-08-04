import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { i18n } from "@/lib/i18n";
import { Text, TextInput, View } from "react-native";

export const TeamnameForm = ({
  teamName,
  setTeamName,
  sheetOpen,
  setTeamNameSubmitError,
  onValidationChange,
  isSubmitted,
}: {
  teamName: string;
  setTeamName: Dispatch<SetStateAction<string>>;
  sheetOpen: boolean;
  setTeamNameSubmitError: Dispatch<SetStateAction<boolean>>;
  onValidationChange: (isValid: boolean) => void;
  isSubmitted: boolean;
}) => {
  const [teamNameError, setTeamNameError] = useState("");

  const validateTeamName = (name: string) => {
    let isValid = true;
    setTeamNameError("");

    if (!name) {
      setTeamNameError(i18n.t("Dashboard.groups.createGroup.errors.teamName"));
      setTeamNameSubmitError(true);
      isValid = false;
    } else if (name.length < 3) {
      setTeamNameError(
        i18n.t("Dashboard.groups.createGroup.errors.teamMinLength")
      );
      setTeamNameSubmitError(true);
      isValid = false;
    } else if (name.length > 20) {
      setTeamNameError(
        i18n.t("Dashboard.groups.createGroup.errors.teamMaxLength")
      );
      setTeamNameSubmitError(true);
      isValid = false;
    } else {
      setTeamNameSubmitError(false);
    }

    onValidationChange(isValid);
    return isValid;
  };

  useEffect(() => {
    if (isSubmitted) {
      validateTeamName(teamName);
    }
  }, [teamName, isSubmitted]);

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: "#E9E8E8", fontWeight: "bold", fontSize: 15 }}>
        {i18n.t("Dashboard.groups.createGroup.labelName")}
      </Text>
      <TextInput
        cursorColor={"#E9E8E8"}
        placeholderTextColor={"#E9E8E8"}
        placeholder={i18n.t("Dashboard.groups.createGroup.placeholderName")}
        style={{
          backgroundColor: "#1D1F24",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 12,
          color: "#E9E8E8",
        }}
        editable={!sheetOpen}
        onChangeText={(teamName) => {
          setTeamName(teamName);
          if (isSubmitted) {
            validateTeamName(teamName);
          }
        }}
        value={teamName}
      />
      {teamNameError ? (
        <Text className="text-[#FF6D6D] mb-2">{teamNameError}</Text>
      ) : null}
    </View>
  );
};
