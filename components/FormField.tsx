import { View, Text, TextInput } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

interface FormFieldProps {
    control: any; 
    name: string;
    placeholder: string;
    errorMessage?: string;
    [key: string]: any;
}

const FormField: React.FC<FormFieldProps> = ({
    control,
    name,
    placeholder,
    errorMessage,
    ...props
}) => {
    return (
        <View className="space-y-2">
            <Text className="text-base text-gray-100 font-pmedium mt-5">{placeholder}</Text>

            <View className="w-full h-16 mt-7 bg-black-100 rounded-xl border-2 border-white focus:border-secondary flex flex-row items-center">
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            className="flex-1 text-white text-base"
                            value={value}
                            placeholder={placeholder}
                            placeholderTextColor="#7B7B8B"
                            onChangeText={onChange}
                            style={{ padding: 10, flexGrow: 1 }}
                            {...props}
                        />
                    )}
                />
            </View>

            {/* Display error message if any */}
            {errorMessage && (
                <Text className="text-red-500 text-sm mt-1">{errorMessage}</Text>
            )}
        </View>
    );
};

export default FormField;
