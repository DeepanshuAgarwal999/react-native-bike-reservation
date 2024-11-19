import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { User } from '..';
import { AntDesign } from '@expo/vector-icons';

const UserCard = ({
    updateUser,
    deleteUser,
    user,
}: {
    user: User;
    deleteUser: (id: number) => void;
    updateUser: (id: number, details: { isManager: boolean; name: string }) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(user.name);
    const [editedIsManager, setEditedIsManager] = useState(user.isManager);

    const handleUpdate = () => {
        updateUser(user.id, { name: editedName, isManager: editedIsManager });
        setIsEditing(false);
    };

    return (
        <View className="rounded-lg p-4 bg-black-200">
            {isEditing ? (
                <>
                    <TextInput
                        className="text-white text-lg border-b border-gray-400"
                        value={editedName}
                        onChangeText={setEditedName}
                        placeholder="Name"
                    />
                    <Pressable
                        className="mt-2"
                        onPress={() => setEditedIsManager(!editedIsManager)}
                    >
                        <Text className="text-white text-lg">
                            {editedIsManager ? 'Manager' : 'Not a Manager'}
                        </Text>
                    </Pressable>
                    <View className="flex-row mt-4">
                        <Pressable className="mr-4" onPress={handleUpdate}>
                            <AntDesign name="checkcircle" size={24} color="green" />
                        </Pressable>
                        <Pressable onPress={() => setIsEditing(false)}>
                            <AntDesign name="closecircle" size={24} color="red" />
                        </Pressable>
                    </View>
                </>
            ) : (
                <>
                    <Text className="text-white text-lg">{user.name}</Text>
                    <Text className="text-white text-lg">
                        {user.isManager ? 'Manager' : 'Not a Manager'}
                    </Text>
                    <Text className="text-white text-lg">{user.email}</Text>
                    <View className="flex-row mt-4">
                        <Pressable className="mr-4" onPress={() => deleteUser(user.id)}>
                            <AntDesign name="deleteuser" size={24} color="red" />
                        </Pressable>
                        <Pressable onPress={() => setIsEditing(true)}>
                            <AntDesign name="edit" size={24} color="blue" />
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    );
};

export default UserCard;
