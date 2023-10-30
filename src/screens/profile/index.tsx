import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import I18n from '../../locales/i18n';
import Styles from '../profile/styles';
import firestore from '@react-native-firebase/firestore';
import {firestoreCollections} from "../../constants/firestore";

interface Props extends StackScreenProps<any, any> {
}

export const ProfileScreen = ({navigation}: Props) => {
    const [name, setName] = useState<string | undefined>(undefined);
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: '',
            title: I18n.t('profile.label'),
            headerBackTitle: '',
            headerLeft: () => (
                <TouchableOpacity
                    onPress={handleLogout}>
                    <Text style={Styles.sign_out_text}> {I18n.t('profile.sign_out')}</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleLogout = () => {
        auth().signOut().then(() => {
            navigation.navigate('StartScreen');
        });
    };
    const userFb = auth().currentUser;

    async function readDbUser() {
        const userDocumentSnapshot = await firestore().collection(firestoreCollections.USERS).doc(userFb?.uid).get();
        setName(userDocumentSnapshot.data()['name'])

    }
    readDbUser().then(() => {});

    return (
        <View style={Styles.container}>
            <Text style={Styles.profile}>{userFb?.email}</Text>
            <Text  style={Styles.profile}>{name}</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('SettingsScreen')}>
                <Text style={Styles.settings_text}> {I18n.t('profile.settings')}</Text>
            </TouchableOpacity>
        </View>
    );
};
