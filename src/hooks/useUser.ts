import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMe, updateMe } from "../services/userService";

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
