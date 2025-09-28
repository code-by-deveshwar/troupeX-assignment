import { useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import PostCard from "@/src/components/PostCard";
import { Screen } from "@/src/components/layout/Screen";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { usePosts } from "@/src/hooks/usePosts";
import { useAuthStore } from "@/src/store/authStore";

const quickFilters = ["Top", "Latest", "Jobs", "Events"] as const;

export default function FeedScreen() {
  const { logout, user } = useAuthStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isRefetching,
  } = usePosts();

  const posts = data?.pages.flatMap((page) => page.posts) || [];
  const greeting = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const showComingSoon = () => {
    Alert.alert("Coming soon", "Feed creation tools are on the way.");
  };

  return (
    <Screen className="pb-0">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#306eff" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 12, paddingHorizontal: 4 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#306eff"
            />
          }
          ListHeaderComponent={
            <View className="mb-6 gap-6 px-2">
              <View className="gap-2">
                <Text className="text-sm font-medium uppercase tracking-[0.22em] text-gray-400">
                  {greeting}
                </Text>
                <Text className="text-[28px] font-semibold text-ink">
                  {user?.name ? `${user.name.split(" ")[0]}, here’s your network pulse` : "Your network pulse"}
                </Text>
                <Text className="text-sm text-gray-500">
                  Catch up on conversations, opportunities, and talent moves curated for you.
                </Text>
              </View>

              <LinearGradient
                colors={["#5558ff", "#be4bff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-3xl"
              >
                <View className="gap-5 rounded-3xl p-5">
                  <View className="flex-row items-center gap-4">
                    <View className="flex-1 gap-1">
                      <Text className="text-base font-semibold text-white">
                        Share something insightful
                      </Text>
                      <Text className="text-sm text-white/80">
                        Start a discussion, celebrate a win, or amplify a role.
                      </Text>
                    </View>
                    <PressableScale onPress={showComingSoon} className="rounded-full">
                      <View className="rounded-full bg-white/20 p-3">
                        <Ionicons name="create-outline" size={22} color="#ffffff" />
                      </View>
                    </PressableScale>
                  </View>

                  <View className="flex-row flex-wrap gap-2">
                    {quickFilters.map((filter) => (
                      <View
                        key={filter}
                        className="rounded-full bg-white/15 px-4 py-2"
                      >
                        <Text className="text-sm font-medium text-white">{filter}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </LinearGradient>

              <SectionHeading
                title="Today’s highlights"
                subtitle="Stories from people and companies you follow."
                actionLabel="Manage feed"
                onActionPress={showComingSoon}
              />
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-6">
                <ActivityIndicator color="#306eff" />
              </View>
            ) : (
              <View className="py-12">
                <PressableScale onPress={logout} className="items-center">
                  <View className="flex-row items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-3">
                    <Ionicons name="log-out-outline" size={18} color="#475467" />
                    <Text className="text-xs font-semibold text-gray-500">
                      Log out of TroupeX
                    </Text>
                  </View>
                </PressableScale>
              </View>
            )
          }
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.6}
          ListEmptyComponent={
            <View className="items-center gap-4 py-12">
              <Ionicons name="sparkles-outline" size={32} color="#306eff" />
              <Text className="text-base font-semibold text-ink">
                Your feed is warming up
              </Text>
              <Text className="px-8 text-center text-sm text-gray-500">
                Follow more people and companies to keep your professional pulse fresh.
              </Text>
            </View>
          }
        />
      )}
    </Screen>
  );
}
