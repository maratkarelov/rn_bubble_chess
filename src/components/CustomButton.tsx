import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {baseColor} from "../theme/appTheme";

export default function CustomButton(props: { onPress: any; title: string; }) {
    const { onPress, title} = props;
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position:'absolute',
        top:0,
        right:20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginEnd:10,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: baseColor.sky,
    },
    text: {
        fontSize: 20,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});
