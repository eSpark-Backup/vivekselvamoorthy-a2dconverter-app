import React, {useState} from 'react';
import {useCallback, useEffect, useRef} from 'react';
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Rive, {Alignment, type RiveRef} from 'rive-react-native';
import Slider from 'rn-range-slider';
import {GradientBorderView} from '@good-react-native/gradient-border';

import BackImage from '../../../src/assets/background.png';
import {Radar, Thumb} from '../../../src/assets';
import {GapView, MyInput} from '../../../src/components';
import {isTablet} from '../../utils/helperfunctions';
import ConnectionModal from '../../components/ConnectionModal';
import {useBLE} from '../../hooks/useBLE';
import {useDashboardStore} from '../../store/DashboardStore';

const resourceName = 'wheel_dash';

const {width, height} = Dimensions.get('window');

const Dashboard: React.FC = () => {
  const riveRef = useRef<RiveRef>(null);
  const {deviceData, setDeviceData} = useDashboardStore();

  const [show, setShow] = useState(true);

  const [hours, setHours] = useState('0');
  const [alternator, setAlternator] = useState('0');
  const [trim, setTrim] = useState('0');
  const [engEco, setEngEco] = useState('0');
  const [depth, setDepth] = useState('0');

  const {TACH, FUEL_1, COOLANT, OIL_PRES, TILT_TRM, VOLT_SIG} =
    deviceData?.data ?? {};
  console.log('deviceData', deviceData);

  const {isConnected, disconnect, pauseReconnection, isDeviceDisconnected} =
    useBLE();

  console.log('isConnected Dash', isConnected);

  const getGaugeValues = useCallback(() => {
    const rpm = TACH ?? 0;
    const cool = COOLANT ?? 0;
    const fuel = FUEL_1 ?? 0;
    const oil = OIL_PRES ?? 0;

    if (riveRef.current) {
      riveRef.current.setTextRunValue('RpmVal', rpm.toFixed(1));
      riveRef.current.setTextRunValue('CoolVal', cool.toFixed(0));
      riveRef.current.setTextRunValue('FuelVal', fuel.toFixed(0));
      riveRef.current.setTextRunValue('OilVal', oil.toFixed(0));

      riveRef.current.setInputState(
        'State Machine 1',
        'ERPMs',
        Number(8 / (1000 / rpm)),
      );
      riveRef.current.setInputState(
        'State Machine 1',
        'CReads',
        Number(cool / 5),
      );
      riveRef.current.setInputState(
        'State Machine 1',
        'FReads',
        Number(fuel / 2),
      );
      riveRef.current.setInputState(
        'State Machine 1',
        'OReads',
        Number(oil / 2),
      );
    }
  }, [TACH, COOLANT, FUEL_1, OIL_PRES]); // depend on the actual values!

  useEffect(() => {
    if (riveRef.current) {
      riveRef.current.setInputState(
        'State Machine 1',
        'ShowTab',
        isTablet() ? true : false,
      );
    }
    // update gauges whenever deviceData changes
    getGaugeValues();
    // update gauges whenever deviceData changes
    getGaugeValues();
  }, [getGaugeValues, deviceData]);

  useEffect(() => {
    if (isDeviceDisconnected) {
      Alert.alert(
        'Device Disconnected',
        'Connection lost. Please reconnect to the device.',
      );
      setShow(true);
    }
  }, [isDeviceDisconnected]);

  const handleValueChange = useCallback(
    (low: number, high: number, byUser: boolean) => {
      console.log('low', low);
      console.log('high', high);
    },
    [],
  );

  return (
    <ImageBackground
      source={BackImage}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}>
      <KeyboardAvoidingView
        behavior={'padding'} // or 'position'
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // adjust if header present
      >
        <ConnectionModal
          isVisible={show && !isConnected}
          onClose={() => setShow(false)}
        />
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
          <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.contentContainer}>
              <Rive
                ref={riveRef}
                resourceName={resourceName}
                stateMachineName="State Machine 1"
                autoplay={true}
                alignment={Alignment.TopCenter}
                style={styles.riveAnimation}
              />
              <TouchableOpacity
                style={styles.radarPosition}
                onPress={async () => {
                  console.log('Pressed');

                  // if (riveRef.current) {
                  //   const view = await riveRef.current.getBooleanState(
                  //     'ShowTab',
                  //   );
                  //   riveRef.current.setInputState(
                  //     'State Machine 1',
                  //     'ShowTab',
                  //     !view,
                  //   );
                  // }
                  // await disconnect();
                  // pauseReconnection();
                  // setShow(true);
                }}>
                <Radar />
              </TouchableOpacity>

              <View style={styles.rightInputsContainer}>
                <MyInput
                  label="HOURS"
                  placeholder="hours"
                  value={hours}
                  onChangeText={setHours}
                />
                <GapView />
                <MyInput
                  label="ALTERNATOR"
                  placeholder="V"
                  value={alternator}
                  onChangeText={setAlternator}
                />
                <GapView />
                <MyInput
                  label="TRIM"
                  placeholder="%"
                  value={TILT_TRM?.toString() ?? trim}
                  onChangeText={setTrim}
                />
                <GapView />
                <MyInput
                  label="ENG ECONOMY TOT"
                  placeholder="nm/Ltr"
                  value={engEco}
                  onChangeText={setEngEco}
                />
                <GapView />
                <MyInput
                  label="DEPTH"
                  placeholder="m"
                  value={depth}
                  onChangeText={setDepth}
                />
              </View>

              <View style={styles.leftSliderContainer}>
                <Text style={styles.voltageLabel}>VOLTAGE</Text>
                <GapView />
                <View>
                  <View style={styles.sliderTicksContainer}>
                    <View style={styles.sliderTick} />
                    <View style={styles.sliderTick} />
                    <View style={styles.sliderTick} />
                    <View style={styles.sliderTick} />
                    <View style={styles.sliderTick} />
                    <View style={styles.sliderTick} />
                    <View style={styles.sliderTick} />
                    <View style={styles.sliderTick} />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Slider
                      style={{flex: 1, width: '100%'}}
                      low={VOLT_SIG}
                      min={0}
                      max={100}
                      step={10}
                      disabled={true}
                      disableRange={true}
                      floatingLabel
                      renderThumb={() => <Thumb />}
                      renderRail={() => (
                        <View style={styles.sliderRail}>
                          <View style={styles.sliderRailInner} />
                          <View style={styles.sliderRailBorder}>
                            <GradientBorderView
                              gradientProps={{
                                colors: ['#FFFFFF66', '#00000066'],
                                locations: [0.39, 1],
                              }}
                              style={styles.gradientBorder}
                            />
                          </View>
                        </View>
                      )}
                      renderRailSelected={() => (
                        <View style={styles.sliderRailSelected}>
                          <View style={styles.sliderRailSelectedInner} />
                        </View>
                      )}
                      onValueChanged={handleValueChange}
                    />
                    <View
                      style={{
                        borderRadius: 4,
                        position: 'absolute',
                        right: -35,
                        backgroundColor: '#202020',
                        padding: 10,
                      }}>
                      <Text style={{fontSize: 18}}>{VOLT_SIG?.toString()}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  backgroundImageStyle: {
    opacity: 0.25,
    resizeMode: 'cover',
  },
  safeAreaContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    // width: width,
    // height: height,
    // position: 'absolute',
  },
  riveAnimation: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  radarPosition: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 10,
  },
  rightInputsContainer: {
    position: 'absolute',
    bottom: '5%',
    right: 10,
    width: '40%',
  },
  leftSliderContainer: {
    position: 'absolute',
    bottom: '5%',
    left: 10,
    width: '40%',
  },
  voltageLabel: {
    textTransform: 'uppercase',
    fontFamily: 'InriaSans-Regular',
    color: '#FFFFFF66',
    fontSize: 16,
    marginLeft: 20,
  },
  sliderTicksContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    position: 'absolute',
  },
  sliderTick: {
    height: 6,
    width: 3,
    backgroundColor: '#AFAFAF',
  },
  sliderRail: {
    flex: 1,
    height: 10,
  },
  sliderRailBorder: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  gradientBorder: {
    borderBottomWidth: 4,
  },
  sliderRailSelected: {
    height: 10,
  },
  sliderRailSelectedInner: {
    height: 6,
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  sliderRailInner: {
    height: 6,
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#000',
  },
});

export default Dashboard;
