import {
  View,
  Text,
  ActivityIndicator,
  Button,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useJob, useApplyJob } from "../../src/hooks/useJobs";

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: job, isLoading } = useJob(id);
  const applyMutation = useApplyJob();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!job) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Job not found</Text>
      </View>
    );
  }

  const handleApply = () => {
    applyMutation.mutate(job._id || job.id, {
      onError: (err: any) => {
        Alert.alert(
          "Application Failed",
          err?.response?.data?.message || "You may have already applied."
        );
      },
    });
  };

  return (
    <ScrollView className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-2">{job.title}</Text>
      <Text className="text-gray-700 mb-1">{job.company}</Text>
      <Text className="text-gray-500 mb-1">{job.location}</Text>
      <Text className="mb-3">
        ₹{job.payMin} - ₹{job.payMax}
      </Text>
      <Text className="text-gray-600 mb-5">{job.description}</Text>

      <Button
        title={
          applyMutation.isPending
            ? "Applying..."
            : applyMutation.isSuccess
            ? "Applied ✅"
            : "Apply"
        }
        onPress={handleApply}
        disabled={applyMutation.isSuccess || applyMutation.isPending} // ✅ prevent double apply
      />
    </ScrollView>
  );
}
