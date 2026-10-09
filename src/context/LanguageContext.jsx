import { createContext, useContext, useEffect, useState } from "react";
import { T } from "../i18n/translations";

const LanguageContext = createContext(null);
export const useLang = () => useContext(LanguageContext);

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

    useEffect(() => {
        localStorage.setItem("lang", lang);
        document.documentElement.lang = lang;
    }, [lang]);

    const t = (key) => T[lang][key] ?? T.en[key] ?? key;   // fixed text
    const ts = (name) => T[lang].spec?.[name] ?? name;     // speciality naam

    return <LanguageContext.Provider value={{ lang, setLang, t, ts }}>{children}</LanguageContext.Provider>;
}
