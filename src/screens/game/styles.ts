import {StyleSheet} from 'react-native';
import {baseColor} from '../../theme/appTheme';

export default StyleSheet.create({

    container:{
        flex:1,
        alignItems:'center'
    },
    whiteSquare:{
        backgroundColor:baseColor.white,
    } ,
    blackSquare:{
        backgroundColor:baseColor.black,
    },
});

