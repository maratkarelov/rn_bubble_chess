import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { styles } from '../theme/appTheme';

interface Props extends StackScreenProps<any, any> {}

export const Page3Screen = ({ navigation }: Props) => {
  return (
    <View style={styles.globalMargin}>
      <Text style={styles.title}>Page3Screen</Text>

      <Button title="Go Back" onPress={() => navigation.pop()} />
      <Button title="Home" onPress={() => navigation.popToTop()} />
    </View>
  );
};
