import {StackScreenProps} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import Styles from './styles';
import {useFormik} from 'formik';
import * as yup from 'yup';
import I18n from '../../locales/i18n';

interface Props extends StackScreenProps<any, any> {
}

export const StartScreen = ({navigation}: Props) => {
    const [loading, setLoading] = useState(false);
    const register = () => {
        setLoading(true);
        auth()
            .createUserWithEmailAndPassword(formik.values.email, formik.values.password)
            .then(() => {
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                if (error.code === 'auth/email-already-in-use') {
                }

                if (error.code === 'auth/invalid-email') {
                }

                console.error(error);
            });

    };

    const handleAuth = () => {
        setLoading(true);
        console.log(formik.values.email, formik.values.password)
        Keyboard.dismiss();
        auth()
            .signInWithEmailAndPassword(formik.values.email, formik.values.password )
            .then(() => {
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                if (error.code === 'auth/email-already-in-use') {
                }
                register();

                if (error.code === 'auth/invalid-email') {
                }

                console.error(error);
            });

    };
    const validationSchema = yup.object().shape({
        code: yup.string(),
        email: yup.string().email(I18n.t('validate.email_not_valid')),
    });

    const formik = useFormik({
        initialValues: {email: '', password: ''},
        validationSchema: validationSchema,
        onSubmit: handleAuth,
        onReset: () => {
        },
    });
    auth().onAuthStateChanged((user) => {
            console.log(user)
            if (user != null) {
                navigation.navigate('MainScreen');
            }
            return true;
        }
    )
    ;
    const {width, height} = Dimensions.get('window');

    if (loading) {
        return <ActivityIndicator
            styleAttr={'LargeInverse'}
            style={{
                position: 'absolute',
                left: width / 2,
                height: height / 2,
                justifyContent: 'center',
                alignItems: 'center',
                // @ts-ignore
                color: '#000',
            }}/>;
    }

    return (
        <View style={Styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={Styles.writeTaskWrapper}
            >
                <View style={Styles.inputs}>
                    <TextInput
                        style={Styles.email}
                        placeholder={'email'}
                        inputMode="email"
                        defaultValue={formik.values.email}
                        onChangeText={formik.handleChange('email')}

                    />
                    {formik.errors.email && (<Text>{formik.errors.email}</Text>)}
                    <TextInput
                        style={Styles.input}
                        placeholder={'password'}
                        textContentType="password"
                        defaultValue={formik.values.password}
                        onChangeText={formik.handleChange('password')}
                    />
                    <TouchableOpacity onPress={() => formik.handleSubmit()}>
                        <View style={Styles.login}>
                            <Text style={Styles.addText}>Авторизоваться</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>);
}
