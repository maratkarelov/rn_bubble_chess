import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {baseColor} from "../../theme/appTheme";
import LoadingSpinner from "../LoadingSpinner";
import Styles from "../ActionButton/styles";

export default function ActionButton(
    props: {
        onPress: any;
        title: string;
        backgroundColor?: string,
        textColor?: string,
        disable?: boolean,
        isLoading?: boolean
    }) {
    const {onPress, title} = props;
    function disableColor(): string {
        // coerce values so ti is between 0 and 1.
        const _opacity = Math.round(Math.min(Math.max(0.5 || 1, 0), 1) * 255);
        return props.backgroundColor + _opacity.toString(16).toUpperCase();
    }
    const renderContent = () => {
        if (props.isLoading) {
            return <LoadingSpinner color={baseColor.gray_30} />;
        }

        return (
            <Text style={[Styles.text, {color: props.textColor ?? baseColor.white}]}>{title}</Text>
        );
    };
    return (
        <TouchableOpacity style={[Styles.button, {backgroundColor: props.disable ? disableColor() : props.backgroundColor ?? baseColor.sky}]} onPress={onPress}
                          disabled={props.disable || props.isLoading}>
            {renderContent()}
        </TouchableOpacity>
    );
}

