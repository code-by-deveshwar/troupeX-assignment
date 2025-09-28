import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Screen } from "../../src/components/layout/Screen";
import { SectionHeading } from "../../src/components/ui/SectionHeading";
import { ApplicationCard } from "../../src/components/applications/ApplicationCard";
import { useMyApplications } from "../../src/hooks/useJobs";

export default function ApplicationsScreen() {
  const { data, isLoading, refetch, isFetching } = useMyApplications();
  const router = useRouter();

  const applications = data?.applications || [];

  return (
    <Screen className="pb-0">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#306eff" />
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 12, paddingHorizontal: 4 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ApplicationCard
              application={item}
              onPress={() => router.push(`/jobs/${item.job.id}`)}
            />
          )}
          ListHeaderComponent={
            <View className="mb-6 gap-6 px-2">
              <View className="gap-2">
                <Text className="text-[28px] font-semibold text-ink">Your application hub</Text>
                <Text className="text-sm text-gray-500">
                  Track progress, nurture conversations, and keep momentum with hiring teams.
                </Text>
              </View>

              <LinearGradient
                colors={["#5558ff", "#be4bff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-3xl"
              >
                <View className="flex-row items-center gap-4 rounded-3xl p-5">
                  <View className="rounded-3xl bg-white/20 p-3">
                    <Ionicons name="trending-up" size={26} color="#ffffff" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-white">
                      {applications.length > 0
                        ? `You have ${applications.length} active application${
                            applications.length > 1 ? "s" : ""
                          }`
                        : "No active applications yet"}
                    </Text>
                    <Text className="text-xs text-white/80">
                      We’ll surface nudges when it’s time to follow up or share an update.
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              <SectionHeading
                title="Recent updates"
                subtitle="Stay in sync with the roles you care about."
              />
            </View>
          }
          ListEmptyComponent={
            <View className="items-center gap-4 py-16">
              <Ionicons name="mail-open-outline" size={32} color="#306eff" />
              <Text className="text-base font-semibold text-ink">No applications yet</Text>
              <Text className="px-10 text-center text-sm text-gray-500">
                Apply to roles you love and they’ll show up here for easy tracking.
              </Text>
            </View>
          }
        />
      )}
    </Screen>
  );
}
