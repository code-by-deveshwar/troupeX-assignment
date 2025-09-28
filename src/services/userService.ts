import { api } from "../lib/api";

export const fetchMe = async () => {
  const { data } = await api.get("/api/users/me");
  return data;
};

export const updateMe = async (updates: {
  name?: string;
  headline?: string;
  location?: string;
  skills?: string[];
}) => {
  const { data } = await api.put("/api/users/me", updates);
  return data;
};
