import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Pagination } from "@/components/Home/Pagination";
import SlideItem from "@/components/Home/SlideItem";
import { Plus } from "lucide-react-native";
import { router } from "expo-router";
import LoadingAnimation from "@/components/loading/LoadingAnimation";
import { useTeams } from "@/hooks/useTeams";
import { useExponentialSmoothing } from "@/hooks/useExponentialSmoothing";
import { i18n } from "@/lib/i18n";
import { Doc } from "convex/_generated/dataModel";

const CreateOrJoinTeam = ({ width }) => (
  <View style={{ width, justifyContent: "center", alignItems: "center" }}>
    <Text className="text-textWhite font-bold text-xl mb-20 text-center px-4">
      {i18n.t("Dashboard.home.createOrJoinTeam.title")}
    </Text>
    <TouchableOpacity
      className="bg-backgroundShade rounded-full mt-4 p-4"
      onPress={() => {
        router.push("/dashboard/groups/create");
      }}
    >
      <Plus color={"#E9E8E8"} size={24} />
    </TouchableOpacity>
    <Text className="font-bold text-textWhite mt-2">
      {i18n.t("Dashboard.home.createOrJoinTeam.createTeam")}
    </Text>
  </View>
);

const TeamItem = ({ item, width }) => (
  <View style={{ width, justifyContent: "center", alignItems: "center" }}>
    <SlideItem team={item} />
  </View>
);

const renderItem = ({ item, width }: { item: any; width: number }) => {
  if (item._id === "create-or-join") {
    return <CreateOrJoinTeam width={width} />;
  }
  return <TeamItem item={item} width={width} key={item._id} />;
};

export default function Page() {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { width } = Dimensions.get("screen");
  const teams = useTeams();

  const data = [
    ...teams,
    { _id: "create-or-join", name: "Join or Create a Team" },
  ];

  const { animatedValue: scrollX, smoothScroll } = useExponentialSmoothing(
    0,
    0.1
  );

  const flatListRef = useRef(null);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onScrollEnd = () => {
    // Optional: Handle any actions when scroll ends
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setSelectedTeamIndex(index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  useEffect(() => {
    if (teams.length >= 0) {
      setLoading(false);
      smoothScroll(selectedTeamIndex * width);
    }
  }, [teams, width, selectedTeamIndex, smoothScroll]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item }) => renderItem({ item, width })}
        keyExtractor={(item) => item._id}
        horizontal
        onScroll={onScroll}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToAlignment="center"
        onMomentumScrollEnd={onScrollEnd}
        decelerationRate={0.96}
      />
      <Pagination data={data} scrollX={scrollX} index={selectedTeamIndex} />
    </GestureHandlerRootView>
  );
}
