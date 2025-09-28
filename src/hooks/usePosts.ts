import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPosts,
  toggleLikeApi,
  createPostApi,
  fetchCommentsApi,
  addCommentApi,
} from "../services/postService";

// --- Posts ---
export const usePosts = () =>
  useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleLikeApi,
    onSuccess: ({ postId, likeCount }) => {
      queryClient.setQueryData<any>(["posts"], (oldData: { pages: any[]; }) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((p: any) =>
              p.id === postId ? { ...p, likeCount } : p
            ),
          })),
        };
      });
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ text, imageUrl }: { text: string; imageUrl?: string | null }) =>
      createPostApi(text, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// --- Comments ---
export const useComments = (postId: string) =>
  useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentsApi(postId),
  });

export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => addCommentApi(postId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // update commentCount
    },
  });
};
