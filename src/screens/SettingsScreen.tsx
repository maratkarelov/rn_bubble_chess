import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../theme/appTheme';

export const SettingsScreen = () => {
  return (
    <View style={styles.settings}>
      <Text style={[styles.title, styles.globalMargin]}>Settings Screen</Text>
    </View>
  );
};
