import {StyleSheet} from 'react-native';
import {baseColor} from "../../theme/appTheme";

export default StyleSheet.create({

    container:{
        justifyContent:'space-between'
    },
    newGame: {
        backgroundColor: baseColor.blue,
        position: 'absolute',
        bottom:-400,
        padding:20,
        left:30,
        right:30
    },
    newGameText: {
        color: baseColor.white,
    },

});

