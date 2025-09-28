import { api } from "../lib/api";

// --- POSTS ---
export const fetchPosts = async ({ pageParam }: { pageParam?: string }) => {
  const { data } = await api.get(`/api/posts?limit=10${pageParam ? `&cursor=${pageParam}` : ""}`);
  return data;
};

export const createPostApi = async (text: string, imageUrl?: string | null) => {
  const { data } = await api.post("/api/posts", { text, imageUrl });
  return data;
};

export const toggleLikeApi = async (postId: string) => {
  const { data } = await api.post(`/api/posts/${postId}/like`);
  return { postId, ...data };
};

// --- COMMENTS ---
export const fetchCommentsApi = async (postId: string) => {
  const { data } = await api.get(`/api/posts/${postId}/comments`);
  return data;
};

export const addCommentApi = async (postId: string, text: string) => {
  const { data } = await api.post(`/api/posts/${postId}/comments`, { text });
  return data;
};
