import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {Image, View} from 'react-native';
import Styles from './styles';
import I18n from '../../locales/i18n';
import ActionButton from '../../components/ActionButton';
import {baseColor} from '../../theme/appTheme';
import auth from '@react-native-firebase/auth';

const earthImage = require('../../assets/earth_from_moon.jpg');

interface Props extends StackScreenProps<any, any> {
}

export const StartScreen = ({navigation}: Props) => {
    function newGame() {
        navigation.navigate('GameScreen', {initInvite: undefined, initInviteRef: undefined});
    }

    function openAuth() {
        navigation.navigate('AuthScreen');
    }

    auth().onAuthStateChanged((user) => {
            // setCurrentUser(user)
            if (user != null) {
                navigation.navigate('MainScreen');
            }
            return true;
        }
    );
    return (
        <View style={Styles.container}>
            <Image style={{}} source={earthImage}/>
            <View style={Styles.training}>
                <ActionButton backgroundColor={baseColor.sky} textColor={baseColor.white} onPress={newGame}
                              title={I18n.t('game.training_game')}/>
            </View>
            <View style={Styles.online}>
                <ActionButton backgroundColor={baseColor.pink} textColor={baseColor.white} onPress={openAuth}
                              title={I18n.t('game.online_game')}/>
            </View>
        </View>);

};
