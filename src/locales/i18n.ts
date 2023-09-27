import I18n from 'react-native-i18n';
import en from './en.json';
import uk from './uk.json';
import tr from './tr.json';
import pl from './pl.json';
import ru from './ru.json';
import {NativeModules, Platform} from 'react-native';

I18n.fallbacks = true;

I18n.translations = {
    en,
    ru,
    pl,
    uk,
    tr,
};

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;



export default I18n;
