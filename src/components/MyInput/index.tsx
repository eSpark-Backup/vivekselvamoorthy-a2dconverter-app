import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {GradientBorderView} from '@good-react-native/gradient-border';

import GapView from '../GapView';
import {handleDigitsOnly} from '../../utils/helperfunctions';

function MyInput({
  label,
  value,
  placeholder,
  onChangeText,
}: {
  label: string;
  value?: string;
  placeholder: string;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.labelStyling}>{label}:</Text>
      <GapView mode="horizontal" />
      <GradientBorderView
        gradientProps={{
          colors: ['#161A1D', '#FFFFFF', '#B1A7A6'],
          locations: [0, 0.39, 1],
        }}
        style={styles.inputContainer}>
        <TextInput
          style={styles.inputStyling}
          value={value ?? '0'}
          onChangeText={e => onChangeText?.(handleDigitsOnly(e))}
          onBlur={() => {
            if (value === '') {
              onChangeText?.('0');
            }
          }}
        />
      </GradientBorderView>
      <Text style={styles.placeholderStyling}>{placeholder}</Text>
    </View>
  );
}

export default MyInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
  },
  inputStyling: {
    borderRadius: 5,
    backgroundColor: '#7F7F7F33',
    borderColor: '#00000001',
    color: '#FFFFFF',
    fontSize: 16,
    height: 30,
    paddingVertical: 0,
    paddingHorizontal: 8,
    zIndex: 1,
    fontFamily: 'InriaSans-Regular',
  },
  labelStyling: {
    textTransform: 'uppercase',
    color: '#FFFFFF66',
    fontSize: 16,
    fontFamily: 'InriaSans-Regular',
  },
  placeholderStyling: {
    color: '#6C6C6C',
    position: 'absolute',
    right: 10,
    fontSize: 12,
    fontFamily: 'InriaSans-Regular',
  },
});
