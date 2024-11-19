import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const Pagination = ({ count, page, onChange }: { count: number, page: number, onChange: (val: number) => void }) => {
    const handlePrevious = () => {
        if (page > 1) onChange(page - 1);
    };

    const handleNext = () => {
        if (page < count) onChange(page + 1);
    };

    return (
        <View style={styles.container} className='bg-primary'>
            <TouchableOpacity
                onPress={handlePrevious}
                disabled={page === 1}
                style={[styles.button, page === 1 && styles.disabledButton]}
            >
                <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageInfo} className='text-white'>
                {page} / {count}
            </Text>

            <TouchableOpacity
                onPress={handleNext}
                disabled={page === count}
                style={[styles.button, page === count && styles.disabledButton]}
            >
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    button: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    disabledButton: {
        backgroundColor: '#d3d3d3',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pageInfo: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default Pagination;
