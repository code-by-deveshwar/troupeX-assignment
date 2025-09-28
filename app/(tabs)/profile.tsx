import { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, Alert, Image, TouchableOpacity } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../src/lib/api";
import * as ImagePicker from "expo-image-picker";

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
  });

  const [name, setName] = useState(user?.name || "");
  const [headline, setHeadline] = useState(user?.headline || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [location, setLocation] = useState(user?.location || "");
  const [avatarURL, setAvatarURL] = useState(user?.avatarURL || "");

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleSave = () => {
    const updates = {
      name,
      headline,
      location,
      avatarURL,
      skills: skills.split(",").map((s: string) => s.trim()).filter(Boolean),
    };

    updateMutation.mutate(updates, {
      onError: (err: any) => {
        Alert.alert("Error", err?.response?.data?.message || "Update failed");
      },
    });
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      // For now, just use local URI
      const uri = result.assets[0].uri;
      setAvatarURL(uri);

      // TODO: If backend supports file upload, you’d upload file → get URL → setAvatarURL(url)
    }
  };

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-xl font-bold mb-4">Profile</Text>

      {/* Avatar */}
      <TouchableOpacity onPress={pickAvatar} className="self-center mb-4">
        {avatarURL ? (
          <Image
            source={{ uri: avatarURL }}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-300 justify-center items-center">
            <Text className="text-gray-600">Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        className="border p-3 rounded mb-4"
      />

      <TextInput
        value={headline}
        onChangeText={setHeadline}
        placeholder="Headline"
        className="border p-3 rounded mb-4"
      />

      <TextInput
        value={skills}
        onChangeText={setSkills}
        placeholder="Skills (comma separated)"
        className="border p-3 rounded mb-4"
      />

      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
        className="border p-3 rounded mb-4"
      />

      <Button
        title={updateMutation.isPending ? "Saving..." : "Save"}
        onPress={handleSave}
      />
    </View>
  );
}
