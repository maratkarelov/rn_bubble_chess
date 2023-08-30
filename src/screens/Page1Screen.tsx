import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Button, Image, Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../theme/appTheme';

interface Props extends StackScreenProps<any, any> {}

export const Page1Screen = ({ navigation }: Props) => {
  return (
    <View style={styles.globalMargin}>
      <Text style={styles.title}>Page1Screen</Text>
      <Button
        title="Go to Page 2"
        onPress={() => navigation.navigate('Page2Screen')}
      />

      <Text style={styles.title}>CONTACTS</Text>
      <View style={styles.personButtonContainer}>
        <View>
          <TouchableOpacity
            style={{ ...styles.personButton, backgroundColor: '#f6bd60' }}
            onPress={() =>
              navigation.navigate('PersonScreen', {
                id: 1,
                name: 'Teo',
              })
            }>
            <Text style={styles.personButtonText}>Teo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PersonScreen', {
                id: 1,
                name: 'Teo',
              })
            }>
            <Image
              style={styles.personImage}
              source={{
                uri: 'https://i.pinimg.com/280x280_RS/1a/46/3d/1a463dc7f8217f2720c605894084d23b.jpg',
              }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{ ...styles.personButton, backgroundColor: '#84a59d' }}
            onPress={() =>
              navigation.navigate('PersonScreen', {
                id: 2,
                name: 'Gabriel',
              })
            }>
            <Text style={styles.personButtonText}>Gabriel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PersonScreen', {
                id: 2,
                name: 'Gabriel',
              })
            }>
            <Image
              style={styles.personImage}
              source={{
                uri: 'https://media.licdn.com/dms/image/C4E03AQEoUP6ZAaWsjQ/profile-displayphoto-shrink_400_400/0/1517053037962?e=1698278400&v=beta&t=8yOA9vITb-JZHg6KseoP5e_36LZuYczp3me-XPpYoNA',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
