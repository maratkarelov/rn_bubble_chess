import {StyleSheet} from 'react-native';
import {baseColor} from '../../theme/appTheme';

export default StyleSheet.create({

    container: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 60,
    },
    iAmReady: {
        position: 'relative',
        top: 30,
        left: 20,
    },
    listOnline: {
        width: '50%',
    },
    listInvitesContainer: {
        width: '50%',
    },
    listInvites: {
        height: '50%',
    },
    tabs: {
        flexDirection: 'row',
        position: 'relative',
        top: 20,

    },
    users: {
        flexDirection: 'row',
        position: 'relative',
        top: 20,

    },
    invite_item:{
    height: 50,
        margin: 8,
        alignItems: 'center',
        justifyContent: 'center'
},
    online: {
        fontSize: 18,
        textAlign: 'center',
        width: '50%',
        color: baseColor.sky,
        fontFamily: 'copperplate',
    },
    me_invited_text: {
        fontSize: 18,
        textAlign: 'center',
        width: '50%',
        color: baseColor.pink,
        fontFamily: 'copperplate',
    },
    i_invited_text: {
        fontSize: 18,
        textAlign: 'center',
        width: '100%',
        color: baseColor.green,
        fontFamily: 'copperplate',
    },
    new_game: {
        fontSize: 18,
        marginStart: 16,
        padding: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: baseColor.sky,
        fontFamily: 'copperplate',
        color: baseColor.sky,
    },
    centeredView: {
        backgroundColor:baseColor.gray_30,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        marginTop:16,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonConfirm: {
        backgroundColor: baseColor.sky,
    },
    buttonCancel: {
        backgroundColor: baseColor.gray,
    },
    textStyle: {
        color: 'white',
        width:100,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

