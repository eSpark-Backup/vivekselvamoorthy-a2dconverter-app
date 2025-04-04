import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import SystemNavigationBar from 'react-native-system-navigation-bar';
import {Dashboard} from './src/screens';

function App(): React.JSX.Element {
  useEffect(() => {
    SystemNavigationBar.navigationHide();
  }, []);

  return (
    <View style={styles.conatiner}>
      <StatusBar hidden={true} />
      <Dashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {flex: 1},
});

export default App;
