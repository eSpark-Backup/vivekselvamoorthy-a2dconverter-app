export interface BLEDevice {
  id: string;
  name?: string;
  rssi?: number;
  advertising?: {
    localName?: string;
    manufacturerData?: any;
    serviceUUIDs?: string[];
  };
}

export interface BLEService {
  uuid: string;
  characteristics: BLECharacteristic[];
}

export interface BLECharacteristic {
  uuid: string;
  properties: string[];
}

export interface BLEDeviceInfo {
  id: string;
  name?: string;
  services: BLEService[];
}

export interface DeviceData {
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

export interface ConnectedDevice {
  device_id: string;
  timestamp: string;
  data?: any;
}
