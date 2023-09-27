import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Styles from "../home/styles";
import I18n from "../../locales/i18n";

interface Props extends StackScreenProps<any, any> {
}

export const HomeScreen = ({navigation}: Props) => {
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            headerBackTitle: '',
        });
    }, [navigation]);

    function newGame() {
        navigation.navigate('GameScreen')
    }

    return (
        <View style={Styles.container}>
            <TouchableOpacity style={Styles.newGame} onPress={() => newGame()}>
                <Text style={Styles.newGameText}>{I18n.t('home.new_game')}</Text>
            </TouchableOpacity>
        </View>
    );
};
