import { View, Text, Alert, FlatList, Modal, StyleSheet, TouchableOpacity, Pressable, TextInput, Switch, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import BikeApi from '@/apis/bike.api';
import { BikeCardType } from '@/index';
import BikeCard from '@/components/BikeCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthProvider';
import { AntDesign } from '@expo/vector-icons';
import Pagination from '@/components/Pagination';
import { Link, router } from 'expo-router';
import dayjs from 'dayjs';
import { CustomButton } from '@/components/CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';

const Bikes = () => {
  const [bikes, setBikes] = useState<BikeCardType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { isManager, logout, user } = useAuth();
  const [page, setPage] = useState(1);
  const [paginationDetails, setPaginationDetails] = useState<{ page: number, total: number, pageCount: number } | null>(null)
  const [filters, setFilters] = useState({
    avgRating: '',
    color: '',
    isAvailable: true,
    location: '',
    model: '',
    startDate: null as Date | null,
    endDate: null as Date | null
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Fetch Bikes from API
  const buildQueryParams = (filters: any, page: number) => {
    const params: URLSearchParams = new URLSearchParams();

    if (filters.color) params.append('color', filters.color);
    if (filters.isAvailable) params.append('isAvailable', String(filters.isAvailable));
    if (filters.location) params.append('location', filters.location);
    if (filters.avgRating) params.append('avgRating', filters.avgRating);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.model) params.append('model', filters.model);
    params.append('page', String(page));

    return params.toString();
  };

  const url = `/bike?${buildQueryParams(filters, page)}`;
  const fetchBikes = async () => {
    const [error, data] = await BikeApi.getBikes(url);
    if (error) {
      Alert.alert('Error while fetching bikes', error.message);
    } else if (data) {
      setPaginationDetails({ page: data.page, total: data.total, pageCount: data.pageCount })
      setBikes(data.data);
    }
  };
  const handleDeleteBike = async (id: number) => {
    if (!isManager) {
      Alert.alert('Insufficient permissions', 'Only managers can delete bikes.');
      return;
    }
    const [error] = await BikeApi.deleteBike(id);
    if (error) {
      Alert.alert('Error', 'Unable to delete bike. Please try again.');
      console.log(error);
      return;
    }
    fetchBikes();
  };
  useEffect(() => {
    fetchBikes();
  }, [filters, page]);

  function handleLogout() {
    logout()
    router.push('/(auth)/sign-in')
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.headerText}>
          Select a bike for <Text style={styles.highlightText}>Reservation</Text>
        </Text>
        <View className='flex flex-row items-center justify-between mt-4'>
          <Pressable onPress={() => setModalVisible((prev) => !prev)}>
            <AntDesign name='filter' size={24} color={'white'} className='' />
          </Pressable>
          {
            isManager && <Link href={'/users'} className='text-white text-xl text-center '>View All Users</Link>
          }
          {user && <Pressable onPress={() => handleLogout()}>
            <AntDesign name='logout' size={24} color={"white"} />
          </Pressable>}
        </View>

        <FlatList
          data={bikes}
          keyExtractor={(item) => item.id.toString()} // Ensure id is converted to string
          renderItem={({ item }) => (
            <BikeCard bike={item} deleteBike={handleDeleteBike} />
          )}
          contentContainerStyle={
            bikes.length === 0
              ? styles.emptyListContainer
              : { paddingHorizontal: 16, paddingTop: 20 }
          }
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No bikes available</Text>
          }
        />
      </View>
      <Pagination count={paginationDetails?.pageCount || 1} page={page} onChange={(val: number) => setPage(val)} />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Bikes</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <AntDesign name="close" size={24} color={"white"} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            {/* Color Filter */}
            <Text style={styles.filterLabel}>Color</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Enter color"
              value={filters.color}
              onChangeText={(text) => setFilters((prev) => ({ ...prev, color: text.trim() }))}
            />

            {/* Location Filter */}
            <Text style={styles.filterLabel}>Location</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Enter location"
              value={filters.location}
              onChangeText={(text) => setFilters((prev) => ({ ...prev, location: text.trim() }))}
            />

            {/* Model Filter */}
            <Text style={styles.filterLabel}>Model</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Enter model"
              value={filters.model}
              onChangeText={(text) => setFilters((prev) => ({ ...prev, model: text.trim() }))}
            />

            {/* Availability Filter */}
            <View className='flex flex-row items-center gap-4'>
              <Text style={styles.filterLabel}>Available</Text>
              <Switch
                value={filters.isAvailable}
                thumbColor={"white"}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, isAvailable: value }))}
              />
            </View>

            {/* Date Filters */}
            <CustomButton
              title={filters.startDate ? dayjs(filters.startDate).format('YYYY-MM-DD') : 'Start Date'}
              handlePress={() => setShowStartPicker(true)}
              className='bg-yellow-500'
              icon={"calendar"}
            />
            {showStartPicker && (
              <DateTimePicker
                value={filters.startDate || new Date()}
                mode='date'
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(event, date) => {
                  setShowStartPicker(false);
                  if (date) setFilters((prev) => ({ ...prev, startDate: date }));
                }}
              />
            )}

            <CustomButton
              title={filters.endDate ? dayjs(filters.endDate).format('YYYY-MM-DD') : 'End Date'}
              handlePress={() => setShowEndPicker(true)}
              className='bg-yellow-500 mt-4'
              icon={"calendar"}
            />
            {showEndPicker && (
              <DateTimePicker
                value={filters.endDate || new Date()}
                mode='date'
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(event, date) => {
                  setShowEndPicker(false);
                  if (date) setFilters((prev) => ({ ...prev, endDate: date }));
                }}
              />
            )}

            {/* Apply Button */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                fetchBikes();
                setModalVisible(false);
              }}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='bg-emerald-500 items-center p-3 font-semibold  rounded-lg mt-4'
              onPress={() => {
                setFilters({
                  avgRating: '',
                  color: '',
                  isAvailable: false,
                  location: '',
                  model: '',
                  startDate: null,
                  endDate: null
                })
                // setModalVisible(false);
              }}
            >
              <Text className='text-white text-lg font-bold'>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a', // Adjust for primary background color
    flex: 1,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  highlightText: {
    color: '#fcca03', // Yellow highlight
    fontSize: 22,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '90%',
    // height: 400,
    backgroundColor: '#1E1E2D',
    alignSelf: 'center',
    borderRadius: 12,
    padding: 16,
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#fff"
  },
  filterContainer: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 16,
    marginVertical: 8,
    color: "#fff"
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  applyButton: {
    marginTop: 16,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default Bikes;
