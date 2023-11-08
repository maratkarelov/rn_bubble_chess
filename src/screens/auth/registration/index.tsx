import {KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View} from 'react-native';
import Styles from '../styles';
import I18n from '../../../locales/i18n';
import ActionButton from '../../../components/ActionButton';
import {baseColor} from '../../../theme/appTheme';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {StackScreenProps} from '@react-navigation/stack';
import {firestoreCollections} from "../../../constants/firestore";

interface Props extends StackScreenProps<any, any> {
}

const RegistrationScreen = ({navigation}: Props) => {
    const [loading, setLoading] = useState(false);
    const [registerError, setRegisterError] = useState<string | undefined>(undefined);

    const handleRegister = () => {
        setLoading(true);
        auth()
            .createUserWithEmailAndPassword(formik.values.email, formik.values.password)
            .then(() => {
                setLoading(false);
                const uid = auth().currentUser?.uid;
                if (uid !== undefined) {
                    const usersCollection = firestore().collection(firestoreCollections.USERS);
                    usersCollection.doc(uid).set({
                        name: formik.values.name,
                    }).then(() => {
                        navigation.navigate('MainScreen');
                    });
                }
            })
            .catch(error => {
                setLoading(false);
                setRegisterError(error.code);
            });

    };
    const validationSchema = yup.object().shape({
        name: yup.string(),
        email: yup.string().email(I18n.t('auth.email_not_valid')),
        password: yup.string(),
    });

    const formik = useFormik({
        initialValues: {name: '', email: '', password: ''},
        validationSchema: validationSchema,
        onSubmit: handleRegister,
        onReset: () => {
        },
    });


    const renderDialog = () => {
        return (<Modal
            animationType="slide"
            transparent={true}
            visible={registerError !== undefined}
        >
            <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                    <Text style={Styles.modalText}>{I18n.t('registration.' + registerError)}</Text>
                    <Pressable
                        style={[Styles.button, Styles.buttonClose]}
                        onPress={() => setRegisterError(undefined)}>
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
                        placeholder={'name'}
                        inputMode="text"
                        defaultValue={formik.values.name}
                        onChangeText={formik.handleChange('name')}

                    />
                    <Text>{formik.errors.name ?? ' '}</Text>
                    <TextInput
                        style={Styles.input}
                        placeholder={'email'}
                        inputMode="email"
                        autoCapitalize="none"
                        defaultValue={formik.values.email}
                        onChangeText={formik.handleChange('email')}

                    />
                    <Text>{formik.errors.email ?? ' '}</Text>
                    <TextInput
                        style={Styles.input}
                        placeholder={'password'}
                        textContentType="password"
                        autoCapitalize="none"
                        defaultValue={formik.values.password}
                        onChangeText={formik.handleChange('password')}
                    />
                    <Text>{formik.errors.password ?? ' '}</Text>
                    <View style={Styles.login}>
                        <ActionButton
                            disable={!formik.isValid || !formik.values.email || !formik.values.password}
                            isLoading={loading}
                            onPress={formik.handleSubmit}
                            title={I18n.t('registration.create_account')}
                            backgroundColor={baseColor.pink}
                            textColor={baseColor.white}/>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </View>);
};
export default RegistrationScreen;
