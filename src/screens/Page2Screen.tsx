import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { styles } from '../theme/appTheme';

interface Props extends StackScreenProps<any, any> {}

export const Page2Screen = ({ navigation }: Props) => {
  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: '',
    });
  }, [navigation]);

  return (
    <View style={styles.globalMargin}>
      <Text style={styles.title}>Page2Screen</Text>
      <Button
        title="Go to Page 3"
        onPress={() => navigation.navigate('Page3Screen')}
      />
    </View>
  );
};
