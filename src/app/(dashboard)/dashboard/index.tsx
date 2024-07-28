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
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { useTeams } from "@/hooks/useTeams";

const CreateOrJoinTeam = ({ width }) => (
  <View style={{ width, justifyContent: "center", alignItems: "center" }}>
    <Text className="text-textWhite font-bold text-xl mb-20">
      Have no teams yet or want to expand?
    </Text>
    <TouchableOpacity
      className="bg-backgroundShade rounded-full mt-4 p-4"
      onPress={() => {
        router.push("/dashboard/groups/create");
      }}
    >
      <Plus color={"#E9E8E8"} size={24} />
    </TouchableOpacity>
    <Text className="font-bold text-textWhite mt-2">Create Team</Text>
  </View>
);

const TeamItem = ({ item, width }) => (
  <View style={{ width, justifyContent: "center", alignItems: "center" }}>
    <SlideItem team={item} />
  </View>
);

const renderItem = ({ item, width }) => {
  if (item._id === "create-or-join") {
    return <CreateOrJoinTeam width={width} />;
  }
  return <TeamItem item={item} width={width} />;
};

export default function Page() {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { width } = Dimensions.get("screen");
  const teams = useTeams();

  useEffect(() => {
    if (teams.length > 0) {
      setLoading(false);
      scrollX.setValue(selectedTeamIndex * width);
    }
  }, [teams, width, selectedTeamIndex]);

  const data = [
    ...teams,
    { _id: "create-or-join", name: "Join or Create a Team" },
  ];

  const { scrollX, flatListRef, onScrollEnd } = useHorizontalScroll(
    data,
    selectedTeamIndex,
    setSelectedTeamIndex
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setSelectedTeamIndex(index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

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
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
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
