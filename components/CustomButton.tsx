import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity, View, Text } from "react-native";

export const CustomButton = ({
    title,
    handlePress,
    isLoading,
    className,
    ...props
}: { title: string, handlePress: () => void, className?: string, isLoading?: boolean }
) => {
    return (
        <TouchableOpacity
            className={
                className
            }
            style={{ padding: 12, alignItems: "center", borderRadius: 10 }}
            disabled={isLoading}
            onPress={handlePress}
            activeOpacity={0.7}
            {...props}
        >
            <View className="flex flex-row items-center justify-center gap-4 text-center ">
                <Text className="text-white text-xl font-semibold capitalize"> {title}</Text>
                {/* <AntDesign
                    name="arrowright"
                    size={20}
                    color="white"
                    style={{ transform: [{ translateX: isLoading ? 0 : 2 }] }}
                /> */}
            </View>
        </TouchableOpacity>
    );
}
