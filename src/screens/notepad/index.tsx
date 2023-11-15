import {StackScreenProps} from "@react-navigation/stack";
import {Text, TouchableOpacity, View} from "react-native";
import Styles from "../../screens/start/styles";
import ActionButton from "../../components/ActionButton";
import {baseColor} from "../../theme/appTheme";
import I18n from "../../locales/i18n";
import React, {useEffect} from "react";

interface Props extends StackScreenProps<any, any> {
}
export const NotepadScreen = ({navigation}: Props) => {
    function newGame() {
        navigation.navigate('GameScreen', {initInvite: undefined, initInviteRef: undefined})
    }

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackTitle: '',
            headerTitle: () => {
                return (
                    <Text></Text>
                );
            },

        });
    }, []);

    return (<View>
        <View style={Styles.training}>
            <ActionButton backgroundColor={baseColor.sky} textColor={baseColor.white} onPress={newGame}
                          title={I18n.t('game.training_game')}/>
        </View>

    </View>)
}
