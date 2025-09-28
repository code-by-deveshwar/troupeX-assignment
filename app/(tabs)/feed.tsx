import PostCard from "@/src/components/PostCard";
import { usePosts } from "@/src/hooks/usePosts";
import { useAuthStore } from "@/src/store/authStore";
import { View, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Text } from "react-native";

export default function FeedScreen() {
  const { logout } = useAuthStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading } = usePosts();

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <View className="flex-1 bg-white">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
          renderItem={({ item }) => <PostCard post={item} />}
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

      <TouchableOpacity
        onPress={logout}
        className="absolute bottom-10 right-5 bg-black px-4 py-2 rounded-xl"
      >
        <Text className="text-white">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
