import I18n from 'react-native-i18n';
import en from './en.json';
import uk from './uk.json';
import tr from './tr.json';
import pl from './pl.json';
import {NativeModules, Platform} from 'react-native';

I18n.fallbacks = true;

I18n.translations = {
    en,
    pl,
    uk,
    tr,
};

const serverLocaleRegion = ['en_US', 'uk_UA', 'pl_PL', 'tr_TR'];
const serverLocales = ['en', 'uk', 'pl', 'tr'];

export const getDeviceLocale = () => {
    if (deviceLanguage) {
        const locale = deviceLanguage.toLowerCase().split('_')[0];
        const foundIndex = serverLocales.indexOf(locale);
        if (foundIndex === -1) {
            return serverLocaleRegion[0];
        } else {
            return serverLocaleRegion[foundIndex];
        }
    } else {
        return serverLocaleRegion[0];
    }
};

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;

export const getDeviceLocaleShort = () => {
    const locale = getDeviceLocale().split('_');
    return locale[0].toLowerCase();
};

export const getDeviceLocaleWeb = () => {
    const locale = getDeviceLocale().split('_');
    return locale[1];
};

export default I18n;
