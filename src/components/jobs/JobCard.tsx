import { memo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../ui/Card";
import { PressableScale } from "../ui/PressableScale";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { formatSalaryRange, relativeTime } from "../../lib/format";

type Job = {
  id: string;
  title: string;
  company: string;
  location?: string;
  payMin?: number;
  payMax?: number;
  salaryCurrency?: string;
  employmentType?: string;
  experienceLevel?: string;
  createdAt?: string;
  logoURL?: string;
};

type JobCardProps = {
  job: Job;
  onPress?: () => void;
  onBookmark?: () => void;
  showBookmark?: boolean;
};

export const JobCard = memo(function JobCard({
  job,
  onPress,
  onBookmark,
  showBookmark = true,
}: JobCardProps) {
  const salaryRange = formatSalaryRange(
    job.payMin,
    job.payMax,
    job.salaryCurrency === "USD" ? "$" : "₹",
  );

  return (
    <PressableScale onPress={onPress} className="mb-5">
      <Card className="gap-5 p-5 rounded-2xl shadow-sm border border-slate-100">
        {/* Header */}
        <View className="flex-row items-start justify-between">
          <View className="flex-row flex-1 gap-3">
            <Avatar name={job.company} uri={job.logoURL} size={48} />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-ink">{job.title}</Text>
              <Text className="text-sm text-gray-600">{job.company}</Text>

              <View className="flex-row items-center gap-2 mt-1">
                {job.location ? (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="location-outline" size={14} color="#64748b" />
                    <Text className="text-xs text-gray-500">{job.location}</Text>
                  </View>
                ) : null}
                {job.createdAt ? (
                  <View className="flex-row items-center gap-1">
                    <View className="h-1 w-1 rounded-full bg-gray-300" />
                    <Text className="text-xs text-gray-400">
                      {relativeTime(job.createdAt)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          {showBookmark ? (
            <PressableScale onPress={onBookmark}>
              <View className="rounded-full bg-slate-50 p-2 border border-slate-200">
                <Ionicons name="bookmark-outline" size={18} color="#475467" />
              </View>
            </PressableScale>
          ) : null}
        </View>

        {/* Tags */}
        <View className="flex-row flex-wrap gap-2">
          {job.employmentType ? (
            <Badge tone="primary">{job.employmentType}</Badge>
          ) : null}
          {job.experienceLevel ? (
            <Badge tone="muted">{job.experienceLevel}</Badge>
          ) : null}
          {salaryRange ? (
            <Badge tone="success">{salaryRange}</Badge>
          ) : null}
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-between border-t border-slate-100 pt-4">
          <View className="flex-1 pr-3">
            <Text className="text-sm font-medium text-ink">Meet the team</Text>
            <Text className="text-xs text-gray-500 mt-0.5">
              Stand out by sharing why you are a great fit.
            </Text>
          </View>
          <PressableScale onPress={onPress}>
            <View className="flex-row items-center gap-2 rounded-full bg-primary-50 px-4 py-2 border border-primary-100">
              <Text className="text-sm font-semibold text-primary-600">
                View details
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#2563eb" />
            </View>
          </PressableScale>
        </View>
      </Card>
    </PressableScale>
  );
});
