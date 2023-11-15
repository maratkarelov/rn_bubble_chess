import {StyleSheet} from 'react-native';
import {baseColor} from '../../theme/appTheme';

export default StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
    },
    back: {
        padding: 16,
    },
    whiteSquare: {
        backgroundColor: baseColor.white,
    },
    blackSquare: {
        backgroundColor: baseColor.black,
    },
    centeredView: {
        backgroundColor: baseColor.gray_30,
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
        marginTop: 30,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        width: 100,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    counterText: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        color: baseColor.black,
        fontSize: 20,
    }
});

