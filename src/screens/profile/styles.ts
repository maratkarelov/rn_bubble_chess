import {StyleSheet} from 'react-native';
import {baseColor} from '../../theme/appTheme';
import {blue} from "react-native-reanimated";

export default StyleSheet.create({
    container:{
        justifyContent:'space-between'
    },
    profile:{
        width:"100%",
        fontSize:18,
        color:baseColor.blue,
        fontFamily:'copperplate',
        marginTop:20,
        marginHorizontal:20,
    },
    settings_text:{
        fontSize:18,
        padding:8,
        color:baseColor.blue,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: baseColor.blue,
        fontFamily:'copperplate',
        marginTop:20,
        marginHorizontal:20,
    },
    sign_out_text: {
        fontSize:18,
        marginStart:16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: baseColor.red,
        padding:4,
        fontFamily:'copperplate',
        color: baseColor.red,
    },
});

