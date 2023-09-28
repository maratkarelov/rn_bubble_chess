import {StyleSheet} from 'react-native';
import {baseColor} from "../../theme/appTheme";

export default StyleSheet.create({

    progress: {
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        paddingTop:20,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inputs: {
        width: '100%',
        flexDirection: 'column',
    },

    tasksWrapper: {
        paddingTop: 80,
        paddingHorizontal: 20,
    },

    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingBottom: 10,
        color: '#2b32b4',
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

    email: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: '100%',
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 60,
        borderColor: '#b9a7a7',
        marginTop: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 7},
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
    },

    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: '100%',
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 60,
        borderColor: '#b9a7a7',
        marginTop: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 7},
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
    },

    login: {
        width: '100%',
        height: 60,
        backgroundColor: baseColor.sky,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 7},
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
    },

    addText: {
        fontSize: 30,
        color: '#ffffff',
        fontWeight: 'bold',
        alignSelf: 'center',
    },

});

