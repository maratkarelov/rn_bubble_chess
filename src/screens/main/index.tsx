import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {HomeScreen} from '../../screens/home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ProfileScreen} from '../../screens/profile';
import I18n from "../../locales/i18n";
import {NotepadScreen} from "../../screens/notepad";

const Tab = createBottomTabNavigator();

interface Props extends StackScreenProps<any, any> {
}

export const MainScreen = ({navigation}: Props) => {
    useEffect(() => {
        navigation.setOptions({
            headerBackTitle: '',
        });
    }, [navigation]);

    return (
        <Tab.Navigator>
            <Tab.Screen name="HomeScreen"
                        component={HomeScreen}
                        options={{
                            tabBarLabel: I18n.t('home.label'),
                            tabBarIcon: ({color, size}) => (
                                <MaterialCommunityIcons name="play-circle" color={color} size={size}/>
                            ),
                            // tabBarBadge: 3,
                        }}/>
            <Tab.Screen name="NotepadScreen"
                        component={NotepadScreen}
                        options={{
                            tabBarLabel: I18n.t('notepad.label'),
                            tabBarIcon: ({color, size}) => (
                                <MaterialCommunityIcons name="clipboard-list-outline" color={color} size={size}/>
                            )
                        }}/>
            <Tab.Screen name="ProfileScreen"
                        component={ProfileScreen}
                        options={{
                            tabBarLabel:  I18n.t('profile.label'),
                            tabBarIcon: ({color, size}) => (
                                <MaterialCommunityIcons name="account" color={color} size={size}/>
                            )
                        }}/>
        </Tab.Navigator>
    );
};
