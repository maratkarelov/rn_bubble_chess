import {StyleSheet} from 'react-native';
import {baseColor} from '../../theme/appTheme';

export default StyleSheet.create({
    container:{
        justifyContent:'space-between'
    },
    sign_out: {
        backgroundColor: baseColor.blue,
        position: 'absolute',
        bottom:-200,
        padding:20,
        left:30,
        right:30
    },
    sign_out_text: {
        color: baseColor.white,
    },
});

