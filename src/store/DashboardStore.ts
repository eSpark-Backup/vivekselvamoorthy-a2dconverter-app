import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DeviceData} from '../types/ble';
import {Device} from 'react-native-ble-plx';

interface DashboardStoreTypes {
  deviceData: DeviceData | null;
  bleDevice: Device | null;
  isConnected: boolean;
  isPaused: boolean;
  isDeviceDisconnected: boolean;
  setDeviceData: (deviceData: DeviceData) => void;
  setBleDevice: (device: Device | null) => void;
  setIsConnected: (status: boolean) => void;
  setIsPaused: (status: boolean) => void;
  setIsDeviceDisconnected: (status: boolean) => void;
}

export const useDashboardStore = create<DashboardStoreTypes>()(
  persist(
    (set, get) => ({
      deviceData: null,
      bleDevice: null,
      isConnected: false,
      isPaused: false,
      isDeviceDisconnected: false,
      setDeviceData: (data: DeviceData) => set(() => ({deviceData: data})),
      setBleDevice: (device: Device | null) => set(() => ({bleDevice: device})),
      setIsConnected: (status: boolean) => set(() => ({isConnected: status})),
      setIsPaused: (status: boolean) => set(() => ({isPaused: status})),
      setIsDeviceDisconnected: (status: boolean) =>
        set(() => ({isDeviceDisconnected: status})),
    }),
    {
      name: 'project-storage',
      storage: {
        getItem: async name => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async name => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);
