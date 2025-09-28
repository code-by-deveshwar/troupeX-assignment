import { memo, useMemo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { PressableScale } from "../ui/PressableScale";
import { Avatar } from "../ui/Avatar";
import { relativeTime } from "../../lib/format";

type Application = {
  id: string;
  status?: string;
  createdAt?: string;
  job: {
    id: string;
    title: string;
    company: string;
    location?: string;
    logoURL?: string;
  };
};

type ApplicationCardProps = {
  application: Application;
  onPress?: () => void;
};

const statusToneMap: Record<string, "primary" | "success" | "warning" | "muted"> = {
  interviewing: "primary",
  offered: "success",
  rejected: "warning",
};

export const ApplicationCard = memo(function ApplicationCard({
  application,
  onPress,
}: ApplicationCardProps) {
  const { job } = application;

  const status = application.status?.toLowerCase() ?? "submitted";
  const badgeTone = statusToneMap[status] || "muted";
  const capitalizedStatus = status
    .split(" ")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");

  const appliedCopy = useMemo(() => {
    if (!application.createdAt) return "";
    return `Applied ${relativeTime(application.createdAt)}`;
  }, [application.createdAt]);

  return (
    <PressableScale onPress={onPress} className="mb-3">
      <Card className="gap-4 p-5">
        <View className="flex-row items-start gap-3">
          <Avatar name={job.company} uri={job.logoURL} size={44} />
          <View className="flex-1 gap-1">
            <Text className="text-base font-semibold text-ink">{job.title}</Text>
            <Text className="text-sm text-gray-500">{job.company}</Text>
            {job.location ? (
              <Text className="text-xs text-gray-400">{job.location}</Text>
            ) : null}
          </View>
          <Badge tone={badgeTone}>{capitalizedStatus}</Badge>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="time-outline" size={16} color="#475467" />
            <Text className="text-xs text-gray-500">
              {appliedCopy || "We received your application"}
            </Text>
          </View>

          <PressableScale onPress={onPress} className="rounded-full">
            <View className="flex-row items-center gap-1 rounded-full border border-slate-100 bg-slate-25 px-3 py-1.5">
              <Text className="text-xs font-semibold text-gray-600">View role</Text>
              <Ionicons name="arrow-forward" size={14} color="#475467" />
            </View>
          </PressableScale>
        </View>
      </Card>
    </PressableScale>
  );
});
