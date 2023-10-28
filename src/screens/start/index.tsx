import {StackScreenProps} from '@react-navigation/stack';
import React, {useState} from 'react';
import {ActivityIndicator, Dimensions, Image, View} from 'react-native';
import Styles from './styles';
import I18n from '../../locales/i18n';
import ActionButton from "../../components/ActionButton";
import {baseColor} from "../../theme/appTheme";
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

const earthImage = require('../../assets/earth_from_moon.jpg');

interface Props extends StackScreenProps<any, any> {
}

export const StartScreen = ({navigation}: Props) => {
    const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(null)
    const {width, height} = Dimensions.get('window');

    function newGame() {
        navigation.navigate('GameScreen')
    }

    function openAuth() {
        navigation.navigate('AuthScreen')
    }

    auth().onAuthStateChanged((user) => {
            console.log(user);
            // setCurrentUser(user)
            if (user != null) {
                navigation.navigate('MainScreen');
            }
            return true;
        }
    );
    if (currentUser === null) {
        return (
            <View style={Styles.container}>
                <Image style={{}} source={earthImage}/>
                <View style={Styles.training}>
                    <ActionButton backgroundColor={baseColor.sky} textColor={baseColor.white} onPress={newGame}
                                  title={I18n.t('game.training_game')}/>
                </View>
                <View style={Styles.online}>
                    <ActionButton backgroundColor={baseColor.yellow} textColor={baseColor.black} onPress={openAuth}
                                  title={I18n.t('game.online_game')}/>
                </View>
            </View>);
    }
    return <ActivityIndicator
        styleAttr={'LargeInverse'}
        style={{
            position: 'absolute',
            left: width / 2,
            height: height / 2,
            justifyContent: 'center',
            alignItems: 'center',
            // @ts-ignore
            color: '#000',
        }}/>;
    ;


};
