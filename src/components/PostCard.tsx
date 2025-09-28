import { View, Text, Image, TouchableOpacity } from "react-native";
import { useToggleLike } from "../hooks/usePosts";
import { useRouter } from "expo-router";

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
}

export default function PostCard({ post }: { post: Post }) {
  const likeMutation = useToggleLike();
  const router = useRouter();

  return (
    <View className="border-b border-gray-200 p-4">
      <View className="flex-row items-center mb-2">
        <Image
          source={{ uri: post.author.avatarURL || "https://placekitten.com/100/100" }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View>
          <Text className="font-bold">{post.author.name || post.author.id}</Text>
          <Text className="text-gray-500 text-sm">{post.author.headline}</Text>
        </View>
      </View>

      <Text className="mb-2">{post.text}</Text>

      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          className="w-full h-48 rounded-xl mb-2"
          resizeMode="cover"
        />
      )}

      <View className="flex-row space-x-6 mt-2 items-center">
        <TouchableOpacity
          onPress={() => likeMutation.mutate(post.id)}
          className="px-2 py-1 bg-gray-100 rounded"
        >
          <Text>👍 {post.likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/comments/${post.id}`)}
          className="px-2 py-1 bg-gray-100 rounded"
        >
          <Text>💬 {post.commentCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
