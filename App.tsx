/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useRef} from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import Rive, {Alignment, RiveRef} from 'rive-react-native';
import Slider from 'rn-range-slider';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import BackImage from './src/assets/background.png';
import {Radar, Thumb} from './src/assets';
import {GapView, MyInput} from './src/components';
import {GradientBorderView} from '@good-react-native/gradient-border';

const resourceName = 'wheel_dash';

function App(): React.JSX.Element {
  const riveRef = useRef<RiveRef>(null);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyles = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleValueChange = useCallback(
    (low: number, high: number, byUser: boolean) => {
      console.log('low', low);
      console.log('high', high);
    },
    [],
  );

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={BackImage}
        style={{flex: 1, backgroundColor: '#000'}}
        imageStyle={{opacity: 0.25}}>
        <View style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
        </View>
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
              // renderLabel={renderLabel}
              // renderNotch={renderNotch}
              onValueChanged={handleValueChange}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({});

export default App;
