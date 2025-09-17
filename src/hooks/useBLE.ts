import {useState, useEffect, useRef} from 'react';
import {BleManager, Device, State} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
import {Platform, PermissionsAndroid} from 'react-native';
import {log} from 'console';
import {useDashboardStore} from '../store/DashboardStore';

interface BleDeviceData {
  id: string;
  name: string;
  timestamp: string;
  data?: {[key: number]: number};
}

interface ConnectedBleDevice {
  id: string;
  name: string;
}

const UART_SERVICE_UUID = '00FF';
const TX_CHARACTERISTIC_UUID = 'FF01';

export const useBLE = () => {
  const bleManager = useRef(new BleManager()).current;
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<Device[]>([]);
  // const [deviceData, setDeviceData] = useState<BleDeviceData | null>(null);
  const [deviceDisconnected, setDeviceDisconnected] = useState(false);
  const [selectedDevice, setSelectedDevice] =
    useState<ConnectedBleDevice | null>(null);

  const {deviceData, setDeviceData} = useDashboardStore();
  const reconnectingRef = useRef(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  };

  //scans for available devices
  const startScan = async () => {
    await requestPermissions();
    setIsScanning(true);
    setScannedDevices([]); // Clear previous scan results
    console.log('Scanning...');

    const foundDevices = new Map(); // Track unique devices

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        setIsScanning(false);
        return;
      }
      console.log('UART device:', device);

      // Ensure the device has a name and advertises the UART service
      if (true) {
        if (device) {
          console.log('UART device:', device.name, device.id);
          foundDevices.set(device.id, device);
          console.log('Found UART device:', Array.from(foundDevices.values()));
          setScannedDevices(Array.from(foundDevices.values())); // Convert Map to array
        }
      }
    });

    setTimeout(() => {
      stopScan();
    }, 7000); // Stop scanning after 7s
  };

  const stopScan = () => {
    bleManager.stopDeviceScan();
    setIsScanning(false);
  };
  //tries to connect to a BLE
  const connectToDevice = async (device: Device) => {
    try {
      const connected = await device.connect();
      const mtu = await device.requestMTU(512);
      console.log('MTU set to:', mtu);
      const discovered =
        await connected.discoverAllServicesAndCharacteristics();

      setConnectedDevice(discovered);
      setIsConnected(true);
      console.log('Connected to:', device.name);
      const updatedDeviceData: ConnectedBleDevice = {
        id: device.id,
        name: device.name ?? '',
      };
      setSelectedDevice(updatedDeviceData);
      enableNotifications(discovered);
      bleManager.onDeviceDisconnected(
        device.id,
        async (error, disconnectedDevice) => {
          if (error) {
            console.error('Disconnection error:', error);
            return;
          }

          console.log('Device disconnected:', disconnectedDevice);

          setIsConnected(false);
          setConnectedDevice(null);

          // Attempt to reconnect
          // await reconnect();
          setDeviceDisconnected(true);
        },
      );
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnected(false);
    }
  };

  //enables receiving updates from the BLE through notification method
  const enableNotifications = async (device: Device) => {
    try {
      const characteristic = await device.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        TX_CHARACTERISTIC_UUID,
        (error, char) => {
          if (error) {
            console.error('Notification error:', error.reason);
            return;
          }

          if (char?.value) {
            try {
              // console.log('Received data:', char);
              const buffer = Buffer.from(char.value, 'base64');

              // Convert buffer to array of numbers
              const dataArray = Array.from(buffer);
              // console.log('Data from:', dataArray);

              // console.log('bytesToString(bytes)', bytesToString(bytes));

              // Convert to numeric object format like {0: 123, 1: 34, ...}
              const numericData = Object.fromEntries(
                dataArray.map((value, index) => [index, value]),
              );

              // Convert to string (if values are ASCII codes)
              const decodedString = dataArray
                .map(byte => String.fromCharCode(byte))
                .join('');

              // console.log('Numeric data:', numericData);
              // console.log('Decoded string:', JSON.parse(decodedString));

              setTimeout(() => {
                setDeviceData({
                  id: device.id,
                  name: device.name ?? '',
                  data: JSON.parse(decodedString),
                  timestamp: new Date().toISOString(),
                });
              }, 1000);
            } catch (parseError) {
              console.error('Error parsing notification data:', parseError);
            }
          }
        },
      );
      console.log('Notifications enabled on TX Characteristic');
    } catch (error) {
      console.error('Failed to enable notifications:', error);
    }
  };

  // might be needed
  const disconnect = async () => {
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      setConnectedDevice(null);
      setIsConnected(false);
      console.log('Disconnected from device');
    }
  };

  //tells whether the stored device is connected or not
  const connectionStatus = async () => {
    const status = bleManager.isDeviceConnected(selectedDevice?.id!);
    if ((await status) === true) {
      return true;
    } else {
      return false;
    }
  };

  //updated connection Status after 2s (tested and verified on status screen)
  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await connectionStatus();
      setIsConnected(status);
      if (status === false && deviceDisconnected) {
        await reconnect();
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [deviceDisconnected]);

  //Reconnection logic upon pressing Bluetooth Status Button on settings screen(tested and verified)
  const reconnect = async () => {
    if (reconnectingRef.current) return; // prevent multiple attempts
    reconnectingRef.current = true;
    try {
      let device: Device | null = null;

      if (selectedDevice) {
        console.log(
          'Reconnecting to previously selected device:',
          selectedDevice.name,
        );
        device = await bleManager.connectToDevice(selectedDevice.id);
      } else {
        console.warn('No device available for reconnection.');
        return;
      }

      if (!device) {
        console.error('Failed to reconnect: No valid device instance.');
        return;
      }

      const mtu = await device.requestMTU(64);
      const discovered = await device.discoverAllServicesAndCharacteristics();
      setConnectedDevice(discovered);
      setIsConnected(true);
      setDeviceDisconnected(false);

      console.log('Reconnection successful!');

      await enableNotifications(discovered);

      return true;
    } catch (error) {
      console.error('Reconnection failed:', error);
      setIsConnected(false);
    } finally {
      reconnectingRef.current = false;
    }
  };

  const isBluetoothEnabled = async () => {
    const state = await bleManager.state();
    return state === State.PoweredOn;
  };

  return {
    startScan,
    isScanning,
    scannedDevices,
    connectToDevice,
    connectedDevice,
    disconnect,
    connectionStatus,
    reconnect,
    isConnected,
    isBluetoothEnabled,
  };
};
