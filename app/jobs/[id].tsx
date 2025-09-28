import { useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../src/components/layout/Screen";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { PressableScale } from "../../src/components/ui/PressableScale";
import { PrimaryButton } from "../../src/components/ui/PrimaryButton";
import { SectionHeading } from "../../src/components/ui/SectionHeading";
import { FadeIn } from "../../src/components/ui/FadeIn";
import { formatSalaryRange, relativeTime } from "../../src/lib/format";
import { useJob, useApplyJob } from "../../src/hooks/useJobs";

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: job, isLoading } = useJob(id);
  const applyMutation = useApplyJob();

  const salaryRange = useMemo(
    () =>
      formatSalaryRange(
        job?.payMin,
        job?.payMax,
        job?.salaryCurrency === "USD" ? "$" : "₹",
      ),
    [job?.payMax, job?.payMin, job?.salaryCurrency],
  );

  const postedAgo = useMemo(() => relativeTime(job?.createdAt), [job?.createdAt]);

  const tags = useMemo(
    () =>
      [job?.employmentType, job?.experienceLevel, job?.location]
        .filter(Boolean)
        .slice(0, 4) as string[],
    [job?.employmentType, job?.experienceLevel, job?.location],
  );

  const handleApply = () => {
    if (!job) return;
    applyMutation.mutate(job._id || job.id, {
      onError: (err: any) => {
        Alert.alert(
          "Application failed",
          err?.response?.data?.message || "You may have already applied.",
        );
      },
    });
  };

  if (isLoading) {
    return (
      <Screen className="items-center justify-center">
        <ActivityIndicator size="large" color="#3461ea" />
      </Screen>
    );
  }

  if (!job) {
    return (
      <Screen className="items-center justify-center">
        <Text className="text-base text-gray-600">Job not found</Text>
      </Screen>
    );
  }

  return (
    <Screen
      edges={["top", "left", "right", "bottom"]}
      padded={false}
      className="bg-surfaceMuted"
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn>
          {/* HEADER */}
          <LinearGradient
            colors={["#203c9d", "#5558ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-b-[32px] px-6 pb-16 pt-20"
          >
            <View className="gap-6 p-8">
              {/* Featured */}
              <View className="self-start rounded-full bg-white/15 px-3 py-1">
                <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  Featured opportunity
                </Text>
              </View>

              {/* Job Title + Company */}
              <View className="gap-2">
                <Text className="text-3xl font-bold text-white">{job.title}</Text>
                <Text className="text-lg font-medium text-white/90">
                  {job.company}
                </Text>
              </View>

              {/* Tags */}
              {tags.length ? (
                <View className="flex-row flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      tone="primary"
                      className="bg-white/20 border border-white/10 text-white"
                    >
                      {tag}
                    </Badge>
                  ))}
                </View>
              ) : null}

              {/* Salary + Posted */}
              <View className="flex-row flex-wrap items-center gap-6">
                {salaryRange ? (
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="cash-outline" size={18} color="#ffffff" />
                    <Text className="text-sm font-semibold text-white">
                      {salaryRange}
                    </Text>
                  </View>
                ) : null}
                {postedAgo ? (
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="time-outline" size={18} color="#ffffff" />
                    <Text className="text-sm text-white/80">
                      Posted {postedAgo}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Buttons */}
              <View className="gap-3">
                <PrimaryButton
                  label={
                    applyMutation.isSuccess
                      ? "Applied"
                      : applyMutation.isPending
                        ? "Applying..."
                        : "Apply now"
                  }
                  onPress={handleApply}
                  loading={applyMutation.isPending}
                  disabled={applyMutation.isPending || applyMutation.isSuccess}
                />
                <PressableScale
                  onPress={() => Alert.alert("Coming soon")}
                  disableHaptics
                >
                  <View className="flex-row items-center justify-center rounded-full border border-white/40 bg-white/10 px-4 py-3">
                    <Ionicons
                      name="bookmark-outline"
                      size={18}
                      color="#ffffff"
                    />
                    <Text className="ml-2 text-sm font-semibold text-white">
                      Save role
                    </Text>
                  </View>
                </PressableScale>
              </View>

              {/* Success banner */}
              {applyMutation.isSuccess ? (
                <View className="flex-row items-center gap-2 rounded-xl bg-white/15 px-4 py-3">
                  <Ionicons name="checkmark-circle" size={20} color="#4cc3ff" />
                  <Text className="text-sm font-semibold text-white">
                    Application submitted — we’ll keep you posted.
                  </Text>
                </View>
              ) : null}
            </View>
          </LinearGradient>
        </FadeIn>

        {/* BODY */}
        <View className="mt-4 gap-6 px-4">
          {/* About */}
          <Card className="p-6">
            <SectionHeading
              title="About the opportunity"
              subtitle="Understand what the team is hiring for."
            />
            <Text className="text-sm leading-6 text-gray-600 mt-2">
              {job.description || "The hiring team will share more details soon."}
            </Text>
          </Card>

          {/* Responsibilities */}
          {job.responsibilities?.length ? (
            <Card className="gap-4 p-6">
              <SectionHeading
                title="What you’ll do"
                subtitle="Key responsibilities to thrive in this role."
              />
              <View className="gap-3 mt-1">
                {job.responsibilities.map((item: string, index: number) => (
                  <View key={index} className="flex-row gap-3">
                    <View className="mt-2 h-2 w-2 rounded-full bg-primary-500" />
                    <Text className="flex-1 text-sm leading-6 text-gray-600">
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          ) : null}

          {/* Requirements */}
          {job.requirements?.length ? (
            <Card className="gap-4 p-6">
              <SectionHeading
                title="What you’ll bring"
                subtitle="Experience and skills that stand out."
              />
              <View className="gap-3 mt-1">
                {job.requirements.map((item: string, index: number) => (
                  <View key={index} className="flex-row gap-3">
                    <Ionicons
                      name="sparkles-outline"
                      size={16}
                      color="#5558ff"
                      className="mt-1"
                    />
                    <Text className="flex-1 text-sm leading-6 text-gray-600">
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          ) : null}

          {/* Hiring signals */}
          <Card className="gap-4 p-6">
            <SectionHeading
              title="Hiring signals"
              subtitle="Use these cues to tailor your outreach."
            />
            <View className="gap-4 mt-1">
              <View className="flex-row items-start gap-3">
                <Ionicons name="people-outline" size={18} color="#3461ea" />
                <Text className="flex-1 text-sm leading-6 text-gray-600">
                  LinkedIn alumni are working here — mention shared connections
                  in your note.
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color="#be4bff"
                />
                <Text className="flex-1 text-sm leading-6 text-gray-600">
                  Follow up within 3 days to stay on the recruiter’s radar.
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
