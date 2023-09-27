import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {firebase} from '@react-native-firebase/auth';
import PushNotification, {Importance} from 'react-native-push-notification';
import {StackNavigator} from './src/navigator/StackNavigator';
import {PermissionsAndroid, Platform,} from 'react-native';
// import {
//     FIREBASE_API_KEY_ANDROID,
//     FIREBASE_API_KEY_IOS,
//     FIREBASE_APP_ID_ANDROID,
//     FIREBASE_APP_ID_IOS,
//     FIREBASE_CLIENT_ID_ANDROID,
//     FIREBASE_CLIENT_ID_IOS,
//     FIREBASE_MESSAGING_SENDER_ID, FIREBASE_PROJECT_ID
// } from '@env';
//
// // firebase android config
const androidCredentials = {
    appId: "1:225653718903:android:a2857b9ad6dc9970d16b72",
    apiKey: "AIzaSyBV1z1LulOqq-hzdNQvdfLuOqWXYvTtRSU",
    projectId: "bubbles-6452d",
    messagingSenderId: "225653718903",
};
//
// // firebase ios config
// const iosCredentials = {
//     clientId: FIREBASE_CLIENT_ID_IOS,
//     appId: FIREBASE_APP_ID_IOS,
//     projectId: FIREBASE_PROJECT_ID,
//     apiKey: FIREBASE_API_KEY_IOS,
//     messagingSenderId: FIREBASE_MESSAGING_SENDER_ID
// };

const iosCredentials = {
    apiKey: "AIzaSyAoxyNoY_S1j8ISJg5ZJXjJZGjEGTuDodQ",
    projectId: "bubbles-6452d",
    storageBucket: "bubbles-6452d.appspot.com",
    messagingSenderId: "225653718903",
    appId: "1:225653718903:ios:08e5b6607c6e3f55d16b72",
};

const App = () => {
    const config = Platform.OS === 'ios' ? iosCredentials : androidCredentials;
    const requestNotificationsPermission = async () => {
        try {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                {
                    title: 'Notifications',
                    message: 'Need request for sending notifications',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
        } catch (err) {
            console.warn(err);
        }
    };

    useEffect(() => {
        if (Platform.OS === 'android') {
            requestNotificationsPermission().then();
        } else {
            messaging().requestPermission().then();
        }

        if (!firebase.apps.length) {
            firebase.initializeApp({...config}, {}).then();
        }

        PushNotification.createChannel(
            {
                channelId: 'bubbles_app',
                channelName: 'Bubbles App',
                channelDescription: 'Bubbles App notifications',
                importance: Importance.HIGH,
                soundName: 'default',
                playSound: true,
                vibrate: true,
            },
            () => {
            }
        );
    });

    return (
        <NavigationContainer>
            <StackNavigator/>
        </NavigationContainer>
    );
};

export default App;
