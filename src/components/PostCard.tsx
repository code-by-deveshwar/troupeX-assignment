import { useMemo } from "react";
import { Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useToggleLike } from "../hooks/usePosts";
import { relativeTime } from "../lib/format";
import { Card } from "./ui/Card";
import { Avatar } from "./ui/Avatar";
import { PressableScale } from "./ui/PressableScale";

const placeholderImage = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80";

export interface Post {
  id: string;
  text: string;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
  author: {
    id: string;
    name: string;
    headline: string;
    avatarURL: string;
  };
  createdAt?: string;
  audience?: string;
}

export default function PostCard({ post }: { post: Post }) {
  const likeMutation = useToggleLike();
  const router = useRouter();

  const postedAgo = useMemo(() => relativeTime(post.createdAt), [post.createdAt]);
  const audienceLabel = post.audience || "Connections";

  return (
    <Card className="mb-4 p-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row flex-1 gap-3">
          <Avatar
            uri={post.author.avatarURL}
            name={post.author.name || post.author.id}
            size={48}
          />
          <View className="flex-1">
            <Text className="text-base font-semibold text-ink">
              {post.author.name || post.author.id}
            </Text>
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              {post.author.headline || "Member"}
            </Text>
            <View className="mt-1 flex-row items-center gap-1">
              <Text className="text-xs text-gray-400">{audienceLabel}</Text>
              <View className="h-1 w-1 rounded-full bg-gray-300" />
              <Text className="text-xs text-gray-400">{postedAgo}</Text>
            </View>
          </View>
        </View>
        <PressableScale className="rounded-full" disableHaptics>
          <View className="rounded-full bg-slate-25 p-2">
            <Ionicons name="ellipsis-horizontal" size={18} color="#475467" />
          </View>
        </PressableScale>
      </View>

      <Text className="mt-4 text-[15px] leading-6 text-ink/90">
        {post.text}
      </Text>

      {post.imageUrl ? (
        <Image
          source={{ uri: post.imageUrl || placeholderImage }}
          className="mt-4 h-48 w-full rounded-3xl"
          resizeMode="cover"
        />
      ) : null}

      <View className="mt-5 flex-row items-center justify-between border-t border-slate-100 pt-4">
        <PressableScale
          onPress={() => likeMutation.mutate(post.id)}
          className="flex-1"
        >
          <View className="flex-row items-center justify-center gap-2 rounded-full px-3 py-2">
            <Ionicons name="heart-outline" size={20} color="#306eff" />
            <Text className="text-sm font-semibold text-primary-600">
              {(post.likeCount ?? 0).toLocaleString()} likes
            </Text>
          </View>
        </PressableScale>

        <View className="h-6 w-[1px] bg-slate-100" />

        <PressableScale
          onPress={() => router.push(`/comments/${post.id}`)}
          className="flex-1"
        >
          <View className="flex-row items-center justify-center gap-2 rounded-full px-3 py-2">
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color="#475467"
            />
            <Text className="text-sm font-medium text-gray-600">
              {(post.commentCount ?? 0).toLocaleString()} comments
            </Text>
          </View>
        </PressableScale>
      </View>
    </Card>
  );
}
