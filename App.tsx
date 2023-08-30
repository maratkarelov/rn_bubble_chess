import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
// import { StackNavigator } from './src/navigator/StackNavigator';
// import { DrawerNavigator } from './src/navigator/DrawerNavigator';
import { NewDrawerNavigator } from './src/navigator/NewDrawerNavigator';

const App = () => {
  return (
    <NavigationContainer>
      {/* <StackNavigator /> */}
      <NewDrawerNavigator />
    </NavigationContainer>
  );
};

export default App;
