import {StackScreenProps} from "@react-navigation/stack";
import {Text, View} from "react-native";

interface Props extends StackScreenProps<any, any> {
}
export const NotepadScreen = ({navigation}: Props) => {

    return (<View>
        <Text>notepad</Text>
    </View>)
}
