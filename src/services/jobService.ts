import { api } from "../lib/api";

// List jobs with cursor-based pagination
export const fetchJobs = async ({ pageParam }: { pageParam?: string }) => {
  const { data } = await api.get(
    `/api/jobs?limit=10${pageParam ? `&cursor=${pageParam}` : ""}`
  );
  return data;
};

// Get a single job
export const fetchJobById = async (id: string) => {
  const { data } = await api.get(`/api/jobs/${id}`);
  return data;
};

// Apply to a job
export const applyJobApi = async (id: string) => {
  const { data } = await api.post(`/api/jobs/${id}/apply`);
  return data;
};

// Fetch my applications
export const fetchMyApplications = async () => {
  const { data } = await api.get(`/api/applications/me`);
  return data;
};
