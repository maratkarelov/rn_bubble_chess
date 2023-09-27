import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import I18n from "../../locales/i18n";
import Styles from "../profile/styles";

interface Props extends StackScreenProps<any, any> {
}

export const ProfileScreen = ({navigation}: Props) => {
      useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle:'',
            title: I18n.t('profile.label'),
            headerBackTitle: '',
        });
    }, [navigation]);

    const handleLogout = () => {
        auth().signOut().then();
    };

    return (
        <View style={Styles.container}>
            <Button title={I18n.t('profile.settings')}
                    onPress={() => navigation.navigate('SettingsScreen')}/>
            <TouchableOpacity style={Styles.sign_out} onPress={() => handleLogout()}>
                <Text style={Styles.sign_out_text}>{I18n.t('profile.sign_out')}</Text>
            </TouchableOpacity>
        </View>
    );
};
