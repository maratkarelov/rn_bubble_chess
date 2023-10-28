import {StyleSheet} from 'react-native';
import {baseColor} from "../../theme/appTheme";

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inputs: {
        width: '100%',
        flexDirection: 'column',
    },


    writeTaskWrapper: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    input: {
        fontSize: 16,
        fontFamily:'copperplate',
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: '100%',
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: '#b9a7a7',
        marginTop: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 7},
        shadowOpacity: 0.11,
        shadowRadius: 3,
        elevation: 1,
    },

    login: {
        width: '100%',
        height: 60,
        marginTop: 50,
    },
    dont_have_account:{
        width:"100%",
        textAlign:'center',
        fontSize: 14,
        fontFamily:'copperplate',
        color:baseColor.gray,
    },
    register: {
        width: '100%',
        marginTop:50,
        marginBottom:20,
        fontSize: 30,
        fontFamily:'copperplate',
        color: baseColor.blue,
        fontWeight: 'bold',
        alignSelf: 'center',
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
        width:100,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    }
});

