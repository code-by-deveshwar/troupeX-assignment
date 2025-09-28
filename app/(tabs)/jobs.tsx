import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useJobs } from "../../src/hooks/useJobs";
import { useRouter } from "expo-router";

export default function JobsScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useJobs();
  const router = useRouter();

  const jobs = data?.pages.flatMap((page) => page.jobs) || [];

  return (
    <View className="flex-1 bg-white">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item, index) => `${item._id || item.id}-${index}`}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/jobs/${item._id || item.id}`)}
              className="border-b border-gray-200 p-4"
            >
              <Text className="font-bold text-lg">{item.title}</Text>
              <Text className="text-gray-600">{item.company}</Text>
              <Text className="text-gray-500">{item.location}</Text>
              <Text className="text-gray-700">
                ₹{item.payMin} - ₹{item.payMax}
              </Text>
            </TouchableOpacity>
          )}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
