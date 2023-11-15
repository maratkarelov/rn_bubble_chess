import {StackScreenProps} from '@react-navigation/stack';
import React, {useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View,} from 'react-native';
import auth from '@react-native-firebase/auth';
import Styles from './styles';
import {useFormik} from 'formik';
import * as yup from 'yup';
import I18n from '../../locales/i18n';
import ActionButton from '../../components/ActionButton';
import {baseColor} from '../../theme/appTheme';

interface Props extends StackScreenProps<any, any> {
}

export const AuthScreen = ({navigation}: Props) => {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [authError, setAuthError] = useState<string | undefined>(undefined);

    const handleAuth = () => {
        setLoading(true);
        Keyboard.dismiss();
        auth()
            .signInWithEmailAndPassword(formik.values.email, formik.values.password)
            .then(() => {
                setLoading(false);
                navigation.navigate('MainScreen');
            })
            .catch(error => {
                setAuthError(error.code);
                setLoading(false);
                setModalVisible(true);
            });

    };
    const validationSchema = yup.object().shape({
        email: yup.string().email(I18n.t('auth.email_not_valid')),
        password: yup.string(),
    });

    const formik = useFormik({
        initialValues: {email: '', password: ''},
        validationSchema: validationSchema,
        onSubmit: handleAuth,
        onReset: () => {
        },
    });

    const openRegister = () => {
        navigation.navigate('RegistrationScreen');
    };
    const renderDialog = () => {
        return (<Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                    <Text style={Styles.modalText}>{I18n.t('auth.' + authError)}</Text>
                    <Pressable
                        style={[Styles.button, Styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={Styles.textStyle}>{I18n.t('ok')}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>);

    };

    return (
        <View style={Styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={Styles.writeTaskWrapper}
            >
                {renderDialog()}
                <View style={Styles.inputs}>
                    <TextInput
                        style={Styles.input}
                        placeholder={'email'}
                        inputMode="email"
                        autoCapitalize="none"
                        defaultValue={formik.values.email}
                        onChangeText={formik.handleChange('email')}
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <Text>{formik.errors.email ?? " "}</Text>
                    <TextInput
                        style={Styles.input}
                        placeholder={'password'}
                        textContentType="password"
                        autoCapitalize="none"
                        defaultValue={formik.values.password}
                        onChangeText={formik.handleChange('password')}
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <View style={Styles.login}>
                        <ActionButton
                            disable={!formik.isValid || !formik.values.email || !formik.values.password}
                            isLoading={loading}
                            onPress={formik.handleSubmit}
                            title={I18n.t('auth.sign_in')}
                            backgroundColor={baseColor.sky}
                            textColor={baseColor.white}/>
                    </View>
                    <View style={Styles.register}>
                        <Text style={Styles.dont_have_account}>{I18n.t('auth.dont_have_account')}</Text>
                        <ActionButton
                            onPress={openRegister}
                            title={I18n.t('auth.sign_up')}
                            backgroundColor={baseColor.white}
                            textColor={baseColor.pink}/>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </View>);
};
