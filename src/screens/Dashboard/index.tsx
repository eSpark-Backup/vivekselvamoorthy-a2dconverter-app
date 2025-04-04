import React, {useCallback, useEffect, useRef} from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Rive, {Alignment, RiveRef} from 'rive-react-native';
import Slider from 'rn-range-slider';
import {GradientBorderView} from '@good-react-native/gradient-border';

import BackImage from '../../../src/assets/background.png';
import {Radar, Thumb} from '../../../src/assets';
import {GapView, MyInput} from '../../../src/components';

const resourceName = 'wheel_dash';

function Dashboard(): React.JSX.Element {
  const riveRef = useRef<RiveRef>(null);

  useEffect(() => {
    const rpm = Math.random() * 100;
    const Oil = Math.random() * 100;
    riveRef.current?.setInputState('State Machine 1', 'ERPMs', rpm);
    riveRef.current?.setInputState('State Machine 1', 'OReads', Oil);
    // riveRef.current?.setInputState('State Machine 1', 'CReads', 46);
    // riveRef.current?.setInputState('State Machine 1', 'FReads', 46);
    getGaugeValues();
  }, []);

  const getGaugeValues = () => {
    const rpm = Math.random() * 40;
    const cool = Math.random() * 30;
    const Fuel = Math.random() * 50;
    const Oil = Math.random() * 50;
    setInterval(() => {
      let RpmVal = Math.random() * rpm;
      let CoolVal = Math.random() * cool;
      let FuelVal = Math.random() * Fuel;
      let OilVal = Math.random() * Oil;
      console.log('RPM', ((RpmVal / 8) * 1000).toFixed(1));
      console.log('Coolant', (CoolVal * 5).toFixed(0));
      console.log('Fuel', (FuelVal * 2).toFixed(0));
      console.log('Oil', (OilVal / 5).toFixed(0));
      riveRef.current?.setTextRunValue(
        'RpmVal',
        ((RpmVal / 8) * 1000).toFixed(1),
      );
      riveRef.current?.setTextRunValue('CoolVal', (CoolVal * 5).toFixed(0));
      riveRef.current?.setTextRunValue('FuelVal', (FuelVal * 2).toFixed(0));
      riveRef.current?.setTextRunValue('OilVal', (OilVal / 5).toFixed(0));
      riveRef.current?.setInputState(
        'State Machine 1',
        'ERPMs',
        Number(RpmVal.toFixed(1)),
      );
      riveRef.current?.setInputState(
        'State Machine 1',
        'CReads',
        Number(CoolVal.toFixed(0)),
      );
      riveRef.current?.setInputState(
        'State Machine 1',
        'FReads',
        Number(FuelVal.toFixed(1)),
      );
      riveRef.current?.setInputState(
        'State Machine 1',
        'OReads',
        Number(OilVal.toFixed(1)),
      );
    }, 1000);
  };

  const handleValueChange = useCallback(
    (low: number, high: number, byUser: boolean) => {
      console.log('low', low);
      console.log('high', high);
    },
    [],
  );

  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <ImageBackground
        source={BackImage}
        style={{flex: 1, backgroundColor: '#000'}}
        imageStyle={{opacity: 0.25}}>
        <Rive
          ref={riveRef}
          resourceName={resourceName}
          stateMachineName="State Machine 1"
          autoplay={true}
          alignment={Alignment.TopCenter}
          style={{width: '100%', position: 'relative'}}
        />
        <Radar style={{position: 'absolute', right: 10, top: 10}} />
        <View
          style={{position: 'absolute', bottom: '5%', right: 10, width: '40%'}}>
          <MyInput label="HOURS" placeholder="hours" />
          <GapView />
          <MyInput label="ALTERNATOR" placeholder="V" />
          <GapView />
          <MyInput label="TRIM" placeholder="%" />
          <GapView />
          <MyInput label="ENG ECONOMY TOT" placeholder="nm/Ltr" />
          <GapView />
          <MyInput label="DEPTH" placeholder="m" />
        </View>
        <View
          style={{position: 'absolute', bottom: '5%', left: 10, width: '40%'}}>
          <Text
            style={{
              textTransform: 'uppercase',
              fontFamily: 'InriaSans-Regular',
              color: '#FFFFFF66',
              fontSize: 16,
              marginLeft: 20,
            }}>
            VOLTAGE
          </Text>
          <GapView />
          <View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 22,
                position: 'absolute',
              }}>
              <View style={{height: 6, width: 3, backgroundColor: '#AFAFAF'}} />
              <View style={{height: 6, width: 3, backgroundColor: '#AFAFAF'}} />
              <View style={{height: 6, width: 3, backgroundColor: '#AFAFAF'}} />
              <View style={{height: 6, width: 3, backgroundColor: '#AFAFAF'}} />
              <View style={{height: 6, width: 3, backgroundColor: '#AFAFAF'}} />
              <View style={{height: 6, width: 3, backgroundColor: '#AFAFAF'}} />
              <View style={{height: 6, width: 3, backgroundColor: '#AFAFAF'}} />
              <View style={{height: 6, width: 3, backgroundColor: '#AFAFAF'}} />
            </View>
            <Slider
              min={0}
              max={70}
              step={10}
              disableRange={true}
              floatingLabel
              renderThumb={() => <Thumb />}
              renderRail={() => (
                <View
                  style={{
                    flex: 1,
                    height: 10,
                  }}>
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                    }}>
                    <GradientBorderView
                      gradientProps={{
                        colors: ['#FFFFFF66', '#00000066'],
                        locations: [0.39, 1],
                      }}
                      style={{
                        borderBottomWidth: 4,
                      }}></GradientBorderView>
                  </View>
                </View>
              )}
              renderRailSelected={() => (
                <View
                  style={{
                    height: 10,
                  }}>
                  <View
                    style={{
                      height: 6,
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      backgroundColor: '#fff',
                    }}></View>
                </View>
              )}
              onValueChanged={handleValueChange}
            />
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

export default Dashboard;
