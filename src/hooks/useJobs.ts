import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchJobs,
  fetchJobById,
  applyJobApi,
  fetchMyApplications,
} from "../services/jobService";

// List jobs
export const useJobs = () =>
  useInfiniteQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });

// Single job
export const useJob = (id: string) =>
  useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id),
    enabled: !!id,
  });

// Apply job
export const useApplyJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => applyJobApi(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

// My applications
export const useMyApplications = () =>
  useQuery({
    queryKey: ["applications"],
    queryFn: fetchMyApplications,
  });
