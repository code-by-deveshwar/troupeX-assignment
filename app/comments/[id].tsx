import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useComments, useAddComment } from "../../src/hooks/usePosts";
import { Screen } from "../../src/components/layout/Screen";
import { Card } from "../../src/components/ui/Card";
import { Avatar } from "../../src/components/ui/Avatar";
import { FadeIn } from "../../src/components/ui/FadeIn";
import { PressableScale } from "../../src/components/ui/PressableScale";
import { Badge } from "../../src/components/ui/Badge";
import { relativeTime } from "../../src/lib/format";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CommentsScreen() {
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, refetch } = useComments(postId);
  const addCommentMutation = useAddComment(postId);
  const [newComment, setNewComment] = useState("");
  const { top } = useSafeAreaInsets();

  const comments = data?.comments ?? [];

  const handleSubmit = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;

    addCommentMutation.mutate(trimmed, {
      onSuccess: () => {
        setNewComment("");
        refetch();
      },
      onError: (error: any) => {
        Alert.alert(
          "Couldn't add comment",
          error?.response?.data?.message || "Please try again shortly."
        );
      },
    });
  };

  if (isLoading) {
    return (
      <Screen className="items-center justify-center bg-surfaceMuted">
        <ActivityIndicator size="large" color="#3461ea" />
      </Screen>
    );
  }

  return (
    <Screen padded={false} className="bg-surfaceMuted">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.select({ ios: top + 12, android: 0 }) ?? 0}
      >
        {/* HEADER */}
        <LinearGradient
          colors={["#203c9d", "#5558ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-b-[28px] px-6 pb-12 pt-8"
        >
          <FadeIn>
            <View className="gap-4 p-4">
              <View className="self-start rounded-full bg-white/20 px-3 py-1">
                <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                  Discussion
                </Text>
              </View>
              <Text className="text-3xl font-semibold text-white">
                Post conversation
              </Text>
              <Text className="text-sm text-white/80">
                Add your perspective and keep the conversation respectful and constructive.
              </Text>

              <View className="flex-row items-center gap-3 rounded-3xl border border-white/20 bg-white/10 px-5 py-4">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={22}
                  color="#ffffff"
                />
                <Text className="text-sm font-semibold text-white">
                  {comments.length} comment{comments.length === 1 ? "" : "s"}
                </Text>
              </View>
            </View>
          </FadeIn>
        </LinearGradient>

        {/* COMMENTS LIST */}
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingTop: 20,
            paddingHorizontal: 16,
            paddingBottom: 100, // leaves space above input
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card className="gap-4 p-5">
              <View className="flex-row gap-3">
                <Avatar
                  uri={item.author.avatarURL}
                  name={item.author.name}
                  size={44}
                />
                <View className="flex-1 gap-1">
                  <Text className="text-base font-semibold text-ink">
                    {item.author.name || "Member"}
                  </Text>
                  <Text className="text-xs text-gray-500" numberOfLines={1}>
                    {item.author.headline || "Shared a comment"}
                  </Text>
                  <Badge tone="muted" className="self-start">
                    {relativeTime(item.createdAt)}
                  </Badge>
                </View>
              </View>
              <Text className="text-sm leading-6 text-gray-600">{item.text}</Text>
            </Card>
          )}
          ItemSeparatorComponent={() => <View className="h-4" />}
          ListEmptyComponent={
            <Card className="mt-4 items-center gap-4 p-6">
              <Ionicons name="sparkles-outline" size={26} color="#5558ff" />
              <Text className="text-base font-semibold text-ink">
                Be the first to comment
              </Text>
              <Text className="text-center text-sm text-gray-500">
                Start the discussion with your thoughts or feedback for the author.
              </Text>
            </Card>
          }
        />

        {/* INPUT BAR */}
        <View
          className="bg-surfaceMuted px-4 pt-3"
        >
          <Card className="flex-row items-center gap-3 p-3">
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor="#9AA4B2"
              multiline
              className="flex-1 text-sm text-ink max-h-20"
            />
            <PressableScale
              onPress={handleSubmit}
              disabled={!newComment.trim() || addCommentMutation.isPending}
              className="p-2"
            >
              {addCommentMutation.isPending ? (
                <ActivityIndicator size="small" color="#5558ff" />
              ) : (
                <Ionicons name="send" size={22} color="#5558ff" />
              )}
            </PressableScale>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
