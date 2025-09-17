import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Device {
  id: string;
  name: string;
  data: {
    VOLT_SIG: number;
    SWITCH: number;
    TACH: number;
    TILT_TRM: number;
    OIL_PRES: number;
    COOLANT: number;
    WARNING: number;
    FUEL_1: number;
    FUEL_2: number;
    STARTER: number;
  };
  timestamp: string;
}

interface DashboardStoreTypes {
  deviceData: Device | null;
  setDeviceData: (deviceData: any) => void;
}

export const useDashboardStore = create<DashboardStoreTypes>()(
  persist(
    (set, get) => ({
      deviceData: null,
      setDeviceData: (data: Device) => set(() => ({deviceData: data})),
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
