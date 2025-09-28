import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../src/lib/api";
import { Screen } from "../../src/components/layout/Screen";
import { Card } from "../../src/components/ui/Card";
import { Avatar } from "../../src/components/ui/Avatar";
import { PressableScale } from "../../src/components/ui/PressableScale";
import { PrimaryButton } from "../../src/components/ui/PrimaryButton";
import { SectionHeading } from "../../src/components/ui/SectionHeading";
import { Badge } from "../../src/components/ui/Badge";
import { ProgressBar } from "../../src/components/ui/ProgressBar";
import { FadeIn } from "../../src/components/ui/FadeIn";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get("/api/users/me");
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { data } = await api.put("/api/users/me", updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      Alert.alert("Update failed", error?.response?.data?.message || "Please try again.");
    },
  });

  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [avatarURL, setAvatarURL] = useState<string | undefined>(undefined);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setHeadline(user.headline || "");
    setSkills(user.skills?.join(", ") || "");
    setLocation(user.location || "");
    setAvatarURL(user.avatarURL || "");
  }, [user]);

  const skillTokens = useMemo(
    () =>
      skills
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean),
    [skills],
  );

  const completeness = useMemo(() => {
    const fields = [name, headline, location, skillTokens.length ? "skills" : ""];
    const filled = fields.filter((field) => field && field.length > 0).length;
    return filled / fields.length;
  }, [name, headline, location, skillTokens.length]);

  const handleSave = () => {
    const updates = {
      name: name.trim(),
      headline: headline.trim(),
      location: location.trim(),
      avatarURL,
      skills: skillTokens,
    };

    updateMutation.mutate(updates);
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarURL(uri);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    setter: (text: string) => void,
    placeholder: string,
    fieldKey: string,
    options?: { multiline?: boolean },
  ) => {
    const isFocused = focusedField === fieldKey;
    return (
      <View>
        <Text className="text-sm font-semibold text-gray-600">{label}</Text>
        <View
          className={`mt-2 rounded-2xl border px-4 py-3 ${
            isFocused ? "border-primary-400 bg-primary-50/40" : "border-slate-100 bg-white"
          }`}
        >
          <TextInput
            value={value}
            onChangeText={setter}
            placeholder={placeholder}
            onFocus={() => setFocusedField(fieldKey)}
            onBlur={() => setFocusedField(null)}
            multiline={options?.multiline}
            className="text-base text-ink"
          />
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <Screen className="items-center justify-center">
        <ActivityIndicator size="large" color="#306eff" />
      </Screen>
    );
  }

  return (
    <Screen edges={["top", "bottom", "left", "right"]} className="pb-0">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 160, paddingTop: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-6 px-2">
            <Card className="overflow-hidden p-0">
              <LinearGradient
                colors={["#203c9d", "#be4bff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-6 pt-6 pb-10"
              >
                <View className="flex-row items-start gap-4 p-10">
                  <PressableScale onPress={pickAvatar} className="rounded-full">
                    <Avatar
                      uri={avatarURL}
                      name={user?.name}
                      size={72}
                      className="border-4 border-white/30"
                    />
                  </PressableScale>
                  <View className="flex-1 gap-2">
                    <Text className="text-lg font-semibold text-white">
                      {name || user?.name || "Your name"}
                    </Text>
                    <Text className="text-sm text-white/80" numberOfLines={2}>
                      {headline || "Tell people what you do best"}
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {location ? (
                        <Badge tone="default" className="bg-white/10 border-white/30">
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="location-outline" size={12} color="#ffffff" />
                            <Text className="text-[10px] font-semibold uppercase text-white">
                              {location}
                            </Text>
                          </View>
                        </Badge>
                      ) : null}
                      <Badge tone="primary" className="bg-white/15 border-white/20">
                        <Text className="text-[10px] font-semibold uppercase text-white">
                          {`${Math.round(completeness * 100)}% complete`}
                        </Text>
                      </Badge>
                    </View>
                  </View>
                </View>
              </LinearGradient>

              <View className="gap-4 px-6 py-5">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-gray-600">
                    Profile completeness
                  </Text>
                  <Text className="text-sm font-semibold text-primary-600">
                    {Math.round(completeness * 100)}%
                  </Text>
                </View>
                <ProgressBar value={completeness} />
                <Text className="text-xs text-gray-500">
                  Add a standout headline, highlight your skills, and keep your location up to date to surface in more searches.
                </Text>
              </View>
            </Card>

            <FadeIn duration={400}>
              <Card className="gap-6 p-6">
                <SectionHeading
                  title="About"
                  subtitle="Craft a headline that reflects your current focus."
                />
                {renderInput("Name", name, setName, "How should we address you?", "name")}
                {renderInput(
                  "Headline",
                  headline,
                  setHeadline,
                  "Ex: Product Builder | AI enthusiast",
                  "headline",
                )}
                {renderInput(
                  "Location",
                  location,
                  setLocation,
                  "Where are you based?",
                  "location",
                )}
              </Card>
            </FadeIn>

            <FadeIn delay={120} duration={400}>
              <Card className="gap-5 p-6">
                <SectionHeading
                  title="Skills & interests"
                  subtitle="Share areas where you thrive to unlock better matches."
                  actionLabel="Add skill"
                  onActionPress={() => setSkills((prev) => (prev ? `${prev}, ` : prev))}
                />

                {renderInput(
                  "Skills",
                  skills,
                  setSkills,
                  "Strategy, SQL, stakeholder management",
                  "skills",
                  { multiline: true },
                )}

                {skillTokens.length ? (
                  <View className="flex-row flex-wrap gap-2">
                    {skillTokens.map((skill) => (
                      <Badge key={skill} tone="muted">
                        {skill}
                      </Badge>
                    ))}
                  </View>
                ) : (
                  <Text className="text-xs text-gray-500">
                    Separate skills with commas to create quick, scannable badges.
                  </Text>
                )}
              </Card>
            </FadeIn>

            <Card className="gap-4 p-6">
              <SectionHeading
                title="Share availability"
                subtitle="Signal to recruiters if you’re open to conversations."
              />

              <PressableScale className="rounded-3xl">
                <View className="flex-row items-center gap-3 rounded-3xl border border-primary-100 bg-primary-50 px-4 py-3">
                  <Ionicons name="radio-button-on" size={18} color="#306eff" />
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-primary-700">
                      Open to opportunities
                    </Text>
                    <Text className="text-xs text-primary-600">
                      Showcase this to recruiters to appear in more searches.
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#306eff" />
                </View>
              </PressableScale>
            </Card>

            <PrimaryButton
              label={updateMutation.isPending ? "Saving changes" : "Save profile"}
              onPress={handleSave}
              loading={updateMutation.isPending}
            />

            {updateMutation.isSuccess ? (
              <FadeIn delay={80} offset={12}>
                <View className="items-center rounded-2xl border border-success/20 bg-success/10 px-4 py-3">
                  <Text className="text-sm font-semibold text-success">
                    Profile updated successfully
                  </Text>
                </View>
              </FadeIn>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
