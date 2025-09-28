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
import { useRouter } from "expo-router";
import { Screen } from "../../src/components/layout/Screen";
import { PressableScale } from "../../src/components/ui/PressableScale";
import { SectionHeading } from "../../src/components/ui/SectionHeading";
import { JobCard } from "../../src/components/jobs/JobCard";
import { useJobs } from "../../src/hooks/useJobs";

const jobFilters = ["Recommended", "Remote", "Leadership", "Early talent"] as const;

export default function JobsScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isRefetching,
  } = useJobs();
  const router = useRouter();

  const jobs = data?.pages.flatMap((page) => page.jobs) || [];

  const comingSoon = () =>
    Alert.alert("Smart filters", "Personalized job filters are coming soon.");

  return (
    <Screen className="pb-0">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#306eff" />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item, index) => `${item._id || item.id || index}`}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => router.push(`/jobs/${item._id || item.id}`)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 12, paddingHorizontal: 4 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="mb-6 gap-6 px-2">
              <View className="gap-2">
                <Text className="text-[28px] font-semibold text-ink">
                  Make your next career move
                </Text>
                <Text className="text-sm text-gray-500">
                  Explore roles tailored to your skills, interests, and network signals.
                </Text>
              </View>

              <LinearGradient
                colors={["#5558ff", "#4cc3ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-3xl"
              >
                <View className="gap-5 rounded-3xl p-5">
                  <View className="flex-row items-center gap-3">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-white">
                        Stay ahead of opportunities
                      </Text>
                      <Text className="text-sm text-white/80">
                        Let recruiters know you’re open to new conversations.
                      </Text>
                    </View>
                    <PressableScale onPress={comingSoon} className="rounded-full">
                      <View className="rounded-full bg-white/20 p-3">
                        <Ionicons name="filter-outline" size={22} color="#ffffff" />
                      </View>
                    </PressableScale>
                  </View>

                  <View className="flex-row flex-wrap gap-2">
                    {jobFilters.map((filter) => (
                      <PressableScale key={filter} onPress={comingSoon} className="rounded-full">
                        <View className="rounded-full bg-white/15 px-4 py-2">
                          <Text className="text-sm font-medium text-white">{filter}</Text>
                        </View>
                      </PressableScale>
                    ))}
                  </View>
                </View>
              </LinearGradient>

              <SectionHeading
                title="Open roles for you"
                subtitle="Based on your profile, location, and saved searches."
                actionLabel="Edit preferences"
                onActionPress={comingSoon}
              />
            </View>
          }
          ListEmptyComponent={
            <View className="items-center gap-4 py-12">
              <Ionicons name="briefcase-outline" size={32} color="#306eff" />
              <Text className="text-base font-semibold text-ink">
                No matching roles yet
              </Text>
              <Text className="px-10 text-center text-sm text-gray-500">
                Keep your profile updated to unlock curated job recommendations.
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-6">
                <ActivityIndicator color="#306eff" />
              </View>
            ) : null
          }
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.6}
        />
      )}
    </Screen>
  );
}
