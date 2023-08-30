import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { RootStackParams } from '../navigator/StackNavigator';
import { styles } from '../theme/appTheme';

// SIMPLE WAY NOT RECOMMENDED
// interface RouteParams {
//   id: number;
//   name: string;
// }

//RECOMMENDED WAY
interface Props extends StackScreenProps<RootStackParams, 'PersonScreen'> {}

export const PersonScreen = ({ navigation, route }: Props) => {
  // THIS CONTINUES THE SIMPLE WAY
  // const params = route.params as RouteParams;

  const params = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: params.name,
      headerBackTitle: '',
    });
  }, [navigation, params.name]);

  return (
    <View style={styles.globalMargin}>
      <Text style={styles.title}>User Screen</Text>
      <Text>{JSON.stringify(params, null, 3)}</Text>

      <Button title="Go Back" onPress={() => navigation.popToTop()} />
    </View>
  );
};
