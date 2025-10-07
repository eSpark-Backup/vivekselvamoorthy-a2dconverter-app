import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';

import BlurBackground from '../BlurBackground/BlurBackground';
import {BLEDevice} from '../../types/ble';
import {useBLE} from '../../hooks/useBLE';
import {requestBLEPermissions} from '../../utils/blePermission';
import {Device} from 'react-native-ble-plx';
import {isLocationEnabled} from 'react-native-android-location-enabler';

const {width, height} = Dimensions.get('screen');

export default function ConnectionModal({
  isVisible,
  onConnect,
  onClose,
}: {
  isVisible: boolean;
  onConnect?: () => void;
  onClose: () => void;
}) {
  const inputRef: any = useRef(null);

  const {
    isScanning,
    connectedDevice,
    scannedDevices,
    startScan,
    connectToDevice,
    disconnect,
    isBluetoothEnabled,
    isConnected,
  } = useBLE();

  const onFocusHandler = () => {
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 20);
  };

  useEffect(() => {
    onFocusHandler();
  }, []);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const granted = await requestBLEPermissions();
    if (!granted) {
      Alert.alert(
        'Permissions Required',
        'Bluetooth permissions are required to proceed.',
      );
    }
  };

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     () => true,
  //   );
  //   return () => backHandler.remove();
  // }, []);

  const startScanning = async (): Promise<void> => {
    try {
      checkPermissions();

      const isEnabled = await isBluetoothEnabled();
      const checkLocEnabled: boolean = await isLocationEnabled();
      if (!checkLocEnabled) {
        Alert.alert(
          'Location Required',
          'Please turn on Location Services to proceed.',
        );
        return;
      }
      if (!isEnabled) {
        Alert.alert(
          'Bluetooth Required',
          'Please enable device bluetooth to proceed.',
        );
        return;
      }
      await startScan();
      // setTimeout(async () => {
      //   const allDevices = await getDiscoveredDevices();
      //   await stopScan();
      //   // setCurrentScreen('deviceList');
      //   console.log('Cache devices:', allDevices.length);
      // }, 10000);
    } catch (error) {
      Alert.alert(
        'Scan Error',
        error instanceof Error ? error.message : 'Failed to start scanning',
      );
    }
  };

  const selectDevice = (device: any): void => {
    console.log('Selected device:', device);
    connectToDevice(device);
    onClose();
  };

  return (
    <View
      style={{
        width: width,
        height: height,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        display: isVisible ? 'flex' : 'none',
        zIndex: 100,
      }}>
      <BlurBackground show={true} />
      <View
        style={{
          width: '80%',
          height: '80%',
          backgroundColor: 'white',
          borderRadius: 10,
        }}>
        <TouchableOpacity
          style={{
            margin: 10,
            paddingVertical: 10,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#202020',
          }}
          disabled={isScanning}
          onPress={startScanning}>
          <Text
            style={{
              fontWeight: '500',
              fontSize: 30,
              color: 'white',
            }}>
            {isScanning ? 'Scanning Devices...' : 'Scan Devices'}
          </Text>
          {isScanning ? <ActivityIndicator size={'large'} /> : null}
        </TouchableOpacity>

        <FlatList
          data={scannedDevices}
          keyExtractor={(item, index) => (item.id ? item.id : index.toString())}
          renderItem={({item, index}: {item: Device; index: number}) => (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
              }}
              onPress={() => selectDevice(item)}>
              <Text style={{color: 'black'}}>
                {item.name || `Device ${item.id}`}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
