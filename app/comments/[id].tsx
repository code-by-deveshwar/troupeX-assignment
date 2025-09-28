import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, FlatList, TextInput, Button, ActivityIndicator } from "react-native";
import { useComments, useAddComment } from "../../src/hooks/usePosts";

export default function CommentsScreen() {
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useComments(postId);
  const addCommentMutation = useAddComment(postId);
  const [newComment, setNewComment] = useState("");

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={data.comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 p-4">
            <Text className="font-bold">{item.author.name || "User"}</Text>
            <Text className="text-gray-600 text-sm">{item.author.headline}</Text>
            <Text className="mt-1">{item.text}</Text>
          </View>
        )}
      />

      {/* Input for new comment */}
      <View className="border-t border-gray-300 p-3 flex-row items-center">
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
        />
        <Button
          title="Send"
          onPress={() => addCommentMutation.mutate(newComment)}
          disabled={!newComment.trim() || addCommentMutation.isPending}
        />
      </View>
    </View>
  );
}
