import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {baseColor} from "../../theme/appTheme";
import LoadingSpinner from "../LoadingSpinner";
import Styles from "../ActionButton/styles";
import {disableColor} from "../../tools/common";

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

    const renderContent = () => {
        if (props.isLoading) {
            return <LoadingSpinner color={baseColor.gray_30}/>;
        }

        return (
            <Text adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={[Styles.text, {color: props.textColor ?? baseColor.white}]}>{title}</Text>
        );
    };
    return (
        <TouchableOpacity
            style={[Styles.button, {backgroundColor: props.disable ? disableColor(props.backgroundColor ?? baseColor.blue) : props.backgroundColor ?? baseColor.blue}]}
            onPress={onPress}
            disabled={props.disable || props.isLoading}>
            {renderContent()}
        </TouchableOpacity>
    );
}

