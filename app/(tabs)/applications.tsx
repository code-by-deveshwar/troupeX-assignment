import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { useMyApplications } from "../../src/hooks/useJobs";
import { useRouter } from "expo-router";

export default function ApplicationsScreen() {
    const { data, isLoading, refetch, isFetching } = useMyApplications();
    const router = useRouter();

    const applications = data?.applications || [];

    return (
        <View className="flex-1 bg-white">
            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                </View>
            ) : applications.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg text-gray-600">No applications yet</Text>
                </View>
            ) : (
                <FlatList
                    data={applications}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => router.push(`/jobs/${item.job.id}`)}
                            className="border-b border-gray-200 p-4"
                        >
                            <Text className="font-bold text-lg">{item.job.title}</Text>
                            <Text className="text-gray-600">{item.job.company}</Text>
                            <Text className="text-gray-500">{item.job.location}</Text>
                            <Text className="text-gray-400 text-sm mt-1">
                                Applied on {new Date(item.createdAt).toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

            )}
        </View>
    );
}
