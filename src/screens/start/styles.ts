import {StyleSheet} from 'react-native';
import {baseColor} from "../../theme/appTheme";

export default  StyleSheet.create({

    container: {
        backgroundColor:baseColor.gray,
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },

    training:{
        position:'absolute',
        left:30,
        right:30,
        top:"20%"

    },
    online: {
        position:'absolute',
        left:30,
        right:30,
        top:"65%"

    },


});

