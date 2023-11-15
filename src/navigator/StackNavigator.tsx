import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StartScreen} from '../screens/start';
import {MainScreen} from '../screens/main';
import {SettingsScreen} from "../screens/profile/settings";
import I18n from "../locales/i18n";
import {GameScreen} from "../screens/game";
import {AuthScreen} from "../screens/auth";
import RegistrationScreen from "../screens/auth/registration";
import {baseColor} from "../theme/appTheme";

export type RootStackParams = {
    StartScreen: undefined;
    AuthScreen: undefined;
    RegistrationScreen: undefined;
    MainScreen: undefined;
    GameScreen: undefined;
    SettingsScreen: undefined;
};

const Stack = createStackNavigator<RootStackParams>();


export const StackNavigator = () => {

    return (
        <Stack.Navigator
            initialRouteName={'StartScreen'}
            screenOptions={{
                headerTintColor: 'black',
                headerStyle: {
                    backgroundColor: baseColor.white,
                    elevation: 0,
                },
                cardStyle: {
                    backgroundColor: baseColor.transparent,
                },
            }}>
            <Stack.Screen
                name="StartScreen"
                options={{headerShown: false}}
                component={StartScreen}
            />
            <Stack.Screen
                name="AuthScreen"
                options={{title: I18n.t('auth.title')}}
                component={AuthScreen}
            />
            <Stack.Screen
                name="RegistrationScreen"
                options={{title: I18n.t('registration.title')}}
                component={RegistrationScreen}
            />
            <Stack.Screen
                name="MainScreen"
                options={{headerShown: false}}
                component={MainScreen}
            />
            <Stack.Screen
                name="SettingsScreen"
                options={{title: I18n.t('profile.settings')}}
                component={SettingsScreen}/>
            <Stack.Screen
                name="GameScreen"
                options={{title: I18n.t('game.label')}}
                component={GameScreen}/>
        </Stack.Navigator>
    );
};
