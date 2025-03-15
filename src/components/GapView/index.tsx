import React from 'react';
import {View} from 'react-native';

function GapView({
  mode = 'vertical',
  length = 10,
}: {
  length?: number;
  mode?: 'vertical' | 'horizontal';
}) {
  if (mode == 'horizontal') {
    return <View style={{width: length}} />;
  } else {
    return <View style={{height: length}} />;
  }
}

export default GapView;
