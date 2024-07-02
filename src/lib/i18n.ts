import { I18n } from "i18n-js";
import { getLocales } from "expo-localization";
import English from "../translations/en.json";
import German from "../translations/de.json";

export const deviceLanguage = getLocales()?.[0]?.languageCode ?? "en";

export const i18n = new I18n({
  en: English,
  de: German,
});

i18n.defaultLocale = deviceLanguage;

i18n.locale = deviceLanguage;
